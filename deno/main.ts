import { HttpDenoKv } from "./openKv.ts";

const URL = ["http://localhost:8000"];

const kv = HttpDenoKv(URL[1]);

async function main() {
  // await kv.delete(["foo", 1n]);
  // await kv.delete(["foo", 2n]);
  // await kv.delete(["foo", 1]);
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

  const result = kv.list({ prefix: ["foo"] }, { limit: 10, reverse: true });

  for await (const entry of result) {
    // console.log(entry);
    // await kv.delete(entry.key);
  }

  console.log("cursor", result.cursor);

  const r = await kv.getMany([
    ["foo", 1n],
    ["foo", 2n],
  ]);

  console.log(r);
}

main();
