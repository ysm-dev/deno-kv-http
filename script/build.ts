import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./deno/deno-kv-http.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  scriptModule: false,
  package: {
    // package.json properties
    name: "deno-kv-http",
    version: Deno.args[0],
    description: "Deno KV HTTP wrapper.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ysm-dev/deno_kv_http.git",
    },
    bugs: {
      url: "https://github.com/ysm-dev/deno_kv_http/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
