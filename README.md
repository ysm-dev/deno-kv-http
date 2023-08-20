# deno_kv_http

A simple HTTP wrapper for [Deno KV](https://deno.land/manual@v1.36.1/runtime/kv) which you can use in other runtime (e.g. Node.js, Browser, Vercel Edge runtime, Cloudflare Workers).

## Usage

- Create new Deno Deploy project: https://dash.deno.com/new

- Select `Hello World` - `Try with playground`

![](https://bafkreifdnt5iqvdtswgdgjgnuh4iavvzybits32kmuhsrcn7ouvnwqqhlq.ipfs.dweb.link/)

- Copy & Paste this code to Deno Deploy editor.

```ts
import { HttpDenoKv } from "https://deno.land/x/deno_kv_http/mod.ts";

Deno.serve((req: Request) => HttpDenoKv(req));
```

- Click ▶︎ Save & Deploy button.

![](https://bafkreidk7dumeh3mutr3gtg5xtxtslabdofiimclfyl5vx454yb4jdbzga.ipfs.dweb.link/)

- Copy your Deno Deploy URL. (e.g. `https://your-project.deno.dev`)

- Install `deno-kv-http` to your project.

```sh
pnpm install deno-kv-http
```

```ts
import { DenoKvHttp } from "deno-kv-http";

const URL = "https://your-project.deno.dev";

const kv = HttpDenoKv(URL);
```

```ts
await kv.set(["foo", 1n, crypto.randomUUID()], crypto.randomUUID());

await kv.set(["foo", 2n], "foo2");

const r2 = await kv.get<string>(["foo", 1n]);

await kv.delete(["foo"]);

const r4 = await kv.get(["foo"]);

const iter = kv.list({ prefix: ["foo"] }, { limit: 100 });

for await (const entry of iter) {
  console.log(entry);
}

const r = await kv.getMany([
  ["foo", 1n],
  ["foo", 2n],
]);
```

- `kv.atomic()`, `kv.close()` not supported yet.
