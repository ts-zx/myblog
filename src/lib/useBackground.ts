"use client";

import { useEffect, useState, useCallback } from "react";

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

export function useBackground() {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<BgSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  // 加载已保存的背景
  useEffect(() => {
    let url: string | null = null;
    (async () => {
      const id = localStorage.getItem(ID_KEY);
      if (id) {
        try {
          const blob = await getImage(id);
          if (blob) {
            url = URL.createObjectURL(blob);
            setBgUrl(url);
          }
        } catch (e) {
          console.error("load background failed", e);
        }
      }
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
        } catch {}
      }
      setReady(true);
    })();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const setImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("请选择图片文件");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("图片不能超过 5MB");
    }
    const id = `bg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await saveImage(id, file);
    localStorage.setItem(ID_KEY, id);
    setBgUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return URL.createObjectURL(file);
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<BgSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    const id = localStorage.getItem(ID_KEY);
    if (id) await deleteImage(id);
    localStorage.removeItem(ID_KEY);
    setBgUrl((url) => {
      if (url) URL.revokeObjectURL(url);
      return null;
    });
  }, []);

  return { bgUrl, settings, setImage, updateSettings, reset, ready };
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