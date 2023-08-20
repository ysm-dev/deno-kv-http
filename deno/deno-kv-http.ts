import { stringify, parse } from "https://esm.sh/superjson@1.13.1";
import fetch from "https://esm.sh/node-fetch@3.3.2"

type KvKey = readonly KvKeyPart[];
type KvKeyPart = Uint8Array | string | number | bigint | boolean;
type KvConsistencyLevel = "strong" | "eventual";
type KvEntry<T> = { key: KvKey; value: T; versionstamp: string };
type KvEntryMaybe<T> =
  | KvEntry<T>
  | {
      key: KvKey;
      value: null;
      versionstamp: null;
    };
interface KvCommitResult {
  ok: true;
  versionstamp: string;
}
type KvListSelector =
  | { prefix: KvKey }
  | { prefix: KvKey; start: KvKey }
  | { prefix: KvKey; end: KvKey }
  | { start: KvKey; end: KvKey };
interface KvListOptions {
  limit?: number;
  cursor?: string;
  reverse?: boolean;
  consistency?: KvConsistencyLevel;
  batchSize?: number;
}
interface KvListIterator<T> {
  get cursor(): string;

  next(): Promise<IteratorResult<KvEntry<T>, undefined>>;
  [Symbol.asyncIterator](): AsyncIterableIterator<KvEntry<T>>;
}

export const DenoKvHttp = (endpoint: string) => {
  const kv = {
    async get<T = unknown>(
      key: KvKey,
      options?: { consistency?: KvConsistencyLevel }
    ): Promise<KvEntryMaybe<T>> {
      const params = stringify([key, options]);
      const res = await fetch(`${endpoint}/get/${params}`);
      const text = await res.text();
      return parse(text);
    },

    async getMany<T extends readonly unknown[]>(
      keys: readonly [...{ [K in keyof T]: KvKey }],
      options?: { consistency?: KvConsistencyLevel }
    ): Promise<{ [K in keyof T]: KvEntryMaybe<T[K]> }> {
      const params = stringify([keys, options]);
      const res = await fetch(`${endpoint}/getMany/${params}`);
      const text = await res.text();
      return parse(text);
    },

    async set(key: KvKey, value: unknown): Promise<KvCommitResult> {
      const params = stringify([key, value]);
      const res = await fetch(`${endpoint}/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: params,
      });
      const text = await res.text();
      return parse(text);
    },

    async delete(key: KvKey): Promise<void> {
      const params = stringify([key]);
      await fetch(`${endpoint}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: params,
      });
    },

    list<T = unknown>(
      selector: KvListSelector,
      options?: KvListOptions
    ): KvListIterator<T> {
      const params = stringify([selector, options]);

      const result = fetch(`${endpoint}/list/${params}`)
        .then((r) => r.text())
        .then((t) =>
          parse<{
            value: KvEntry<T>[];
            cursor?: string;
          }>(t)
        );

      let i = 0;

      const iter: KvListIterator<T> = {
        // @ts-ignore
        cursor: undefined,
        [Symbol.asyncIterator]() {
          return iter;
        },

        async next() {
          const { value: values, cursor } = await result;
          const value = values[i++];
          const done = i >= values.length;

          // @ts-ignore
          iter.cursor = cursor;

          return {
            value,
            done,
          } as IteratorResult<KvEntry<T>, undefined>;
        },
      };

      return iter;
    },
  };

  return kv;
};
