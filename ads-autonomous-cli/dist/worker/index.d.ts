import { Hono } from 'hono';
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