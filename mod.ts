import { stringify, parse } from "https://esm.sh/superjson@1.13.1";

const kv = await Deno.openKv();

const transformReq = async (req: Request) => {
  const { method, url } = req;
  const { pathname } = new URL(url);

  const [, m, p] = pathname.split("/");

  const params = decodeURIComponent(p);

  if (method === "GET") {
    // get, getMany, list
    if (m === "get") {
      const param = parse<Parameters<typeof kv.get>>(params);
      return kv[m](...param);
    } else if (m === "getMany") {
      const param = parse<Parameters<typeof kv.getMany>>(params);
      return kv[m](...param);
    } else if (m === "list") {
      const param = parse<Parameters<typeof kv.list>>(params);
      const result = kv[m](...param);
      let value: any[] = [];
      for await (const entry of result) {
        value.push(entry);
      }
      const done =
        value.length === 0 ||
        (!!param[1]?.limit && value.length < param[1].limit);

      const cursor = result.cursor;

      return {
        value,
        done,
        cursor,
      };
    }
  } else if (method === "POST") {
    // set, delete, close
    if (m === "set") {
      const body = await req.text();
      const param = parse<Parameters<typeof kv.set>>(body);
      return kv[m](...param);
    } else if (m === "delete") {
      const body = await req.text();
      const param = parse<Parameters<typeof kv.delete>>(body);
      return kv[m](...param);
    } else if (m === "close") {
      return kv[m]();
    }
  }

  throw new Error("Invalid request");
};

export const HttpDenoKv = async (req: Request) => {
  const res = await transformReq(req);

  if (res) {
    return new Response(stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response(null);
};
