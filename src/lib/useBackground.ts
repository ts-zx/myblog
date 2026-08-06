"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

const DB_NAME = "blog-bg";
const STORE = "backgrounds";
const SETTINGS_KEY = "bg-current-settings";
const ID_KEY = "bg-current-id";

export type BgSettings = {
  opacity: number; // 背景图透明度 0-1
  blur: number; // 模糊度 px
  overlayOpacity: number; // 蒙层不透明度（保证文字可读）
};

const DEFAULT_SETTINGS: BgSettings = {
  opacity: 0.4,
  blur: 0,
  overlayOpacity: 0.3,
};

// 模块级共享 state - 所有 useBackground() 调用共享同一份
type State = {
  bgUrl: string | null;
  settings: BgSettings;
  ready: boolean;
};

let state: State = {
  bgUrl: null,
  settings: DEFAULT_SETTINGS,
  ready: false,
};

const listeners = new Set<() => void>();

function setState(updater: (s: State) => State) {
  state = updater(state);
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// 加载已保存的背景（全局只跑一次）
let loadStarted = false;
function ensureLoaded() {
  if (loadStarted) return;
  loadStarted = true;
  (async () => {
    const id = localStorage.getItem(ID_KEY);
    let url: string | null = null;
    if (id) {
      try {
        const blob = await getImage(id);
        if (blob) url = URL.createObjectURL(blob);
      } catch (e) {
        console.error("load background failed", e);
      }
    }
    const s = localStorage.getItem(SETTINGS_KEY);
    let settings = DEFAULT_SETTINGS;
    if (s) {
      try {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
      } catch {}
    }
    setState((s) => ({ ...s, bgUrl: url, settings, ready: true }));
  })();
}

// 暴露给外部使用的方法
export const backgroundActions = {
  async setImage(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error("请选择图片文件");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("图片不能超过 5MB");
    }
    const id = `bg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await saveImage(id, file);
    localStorage.setItem(ID_KEY, id);
    const oldUrl = state.bgUrl;
    const newUrl = URL.createObjectURL(file);
    setState((s) => ({ ...s, bgUrl: newUrl }));
    if (oldUrl) URL.revokeObjectURL(oldUrl);
  },

  updateSettings(patch: Partial<BgSettings>) {
    const newSettings = { ...state.settings, ...patch };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    setState((s) => ({ ...s, settings: newSettings }));
  },

  async reset() {
    const id = localStorage.getItem(ID_KEY);
    if (id) await deleteImage(id);
    localStorage.removeItem(ID_KEY);
    const oldUrl = state.bgUrl;
    setState((s) => ({ ...s, bgUrl: null }));
    if (oldUrl) URL.revokeObjectURL(oldUrl);
  },
};

// React hook
export function useBackground() {
  // 触发首次加载
  useEffect(() => {
    ensureLoaded();
  }, []);

  // 订阅 state 变化
  const snapshot = useSyncExternalStore(
    (cb) => subscribe(cb),
    () => state,
    () => state
  );

  const setImage = useCallback(backgroundActions.setImage, []);
  const updateSettings = useCallback(backgroundActions.updateSettings, []);
  const reset = useCallback(backgroundActions.reset, []);

  return {
    bgUrl: snapshot.bgUrl,
    settings: snapshot.settings,
    setImage,
    updateSettings,
    reset,
    ready: snapshot.ready,
  };
}

// IndexedDB helpers
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function saveImage(id: string, blob: Blob): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(blob, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function getImage(id: string): Promise<Blob | null> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      })
  );
}

function deleteImage(id: string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}