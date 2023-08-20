# deno-kv-http

A simple HTTP wrapper for [Deno KV](https://deno.land/x/kv) which you can use in other runtime (e.g. Node.js, Edge runtime).

## Usage

- Create new Deno Deploy project.

- Copy & Paste this code to Deno Deploy.

```ts
import { HttpDenoKv } from "https://github.com/ysm-dev/deno-kv-http/raw/main/mod.ts";

Deno.serve((req: Request) => HttpDenoKv(req));
```

- Deploy it.

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
