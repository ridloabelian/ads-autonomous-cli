import { Hono } from 'hono';
declare global {
    interface KVNamespace {
        get(key: string): Promise<string | null>;
        put(key: string, value: string, options?: any): Promise<void>;
        delete(key: string): Promise<void>;
        list(options?: any): Promise<any>;
    }
    interface Ai {
        run(model: string, options?: Record<string, any>): Promise<any>;
    }
}
type Bindings = {
    CAMPAIGNS: KVNamespace;
    AI: Ai;
    APIFY_API_KEY: string;
};
declare const app: Hono<{
    Bindings: Bindings;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map