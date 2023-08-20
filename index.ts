import { HttpDenoKv } from "./mod.ts";

Deno.serve((req: Request) => HttpDenoKv(req));
