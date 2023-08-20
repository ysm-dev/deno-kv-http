import { DenoKvHttp } from "./deno-kv-http.ts";

const URL = ["http://localhost:8000", "https://deno-kv-http.deno.dev"];

const kv = DenoKvHttp(URL[1]);

async function main() {
  const r1 = kv.list({ prefix: ["foo"] }, { limit: 100, reverse: true });

  for await (const entry of r1) {
    await kv.delete(entry.key);
  }

  await kv.set(["foo", 1n, crypto.randomUUID()], crypto.randomUUID());

  console.log("set foo1");
  await kv.set(["foo", 2n], "foo2");

  console.log("set foo2");

  const r2 = await kv.get<string>(["foo", 1n]);

  console.log({ value: r2.value });

  console.log({ r2 });

  await kv.delete(["foo"]);

  const r4 = await kv.get(["foo"]);

  console.log({ r4 });

  const result = kv.list({ prefix: ["foo"] }, { limit: 100, reverse: true });

  for await (const entry of result) {
    console.log(entry);
  }
}

main();
