// Minimal Cloudflare Workers / Pages types (locally declared)
// In a real project, install @cloudflare/workers-types:
//   npm i -D @cloudflare/workers-types

declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    get(key: string, type: "text"): Promise<string | null>;
    get<T>(key: string, type: "json"): Promise<T | null>;
    put(key: string, value: string, options?: { expirationTtl?: number; expiration?: number; metadata?: unknown }): Promise<void>;
    put(key: string, value: ArrayBuffer | ArrayBufferView | ReadableStream, options?: { expirationTtl?: number; expiration?: number; metadata?: unknown }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
  }

  type PagesFunction<E = unknown> = (context: EventContext<E, string, Record<string, unknown>>) => Response | Promise<Response>;

  interface EventContext<Env = unknown, P extends string = string, Data = unknown> {
    request: Request;
    env: Env;
    params: Record<P, string>;
    data: Data;
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
    next(input?: Request | string, init?: RequestInit): Promise<Response>;
  }
}

export {};
