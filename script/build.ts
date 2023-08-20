// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "deno-kv-http",
    version: Deno.args[0],
    description: "Deno KV HTTP wrapper.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ysm-dev/deno-kv-http.git",
    },
    bugs: {
      url: "https://github.com/ysm-dev/deno-kv-http/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
