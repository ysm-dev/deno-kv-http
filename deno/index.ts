import { HttpDenoKv } from "https://deno.land/x/deno_kv_http/mod.ts";

Deno.serve((req: Request) => HttpDenoKv(req));
