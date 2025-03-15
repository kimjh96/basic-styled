import { fileURLToPath } from "node:url";

import { extname, resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { glob } from "glob";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const withUseClientChunkNameTokens = ["injector"];
const inputs = ["core", "setup", "utils"];

export default defineConfig({
  build: {
    lib: {
      entry: inputs
    },
    rollupOptions: {
      external: [/react/g, /react-dom/g],
      input: Object.fromEntries(
        inputs
          .map((input) =>
            glob
              .sync(`${input}/**/*.{ts,tsx}`, {
                ignore: [
                  "**/*.d.ts",
                  "**/*.styles.{ts,tsx}",
                  "**/*.stories.tsx",
                  "**/typing.ts",
                  "**/*.typing.ts"
                ]
              })
              .map((file) => [
                file.slice(0, file.length - extname(file).length),
                fileURLToPath(new URL(file, import.meta.url))
              ])
          )
          .flat()
      ),
      output: [
        {
          interop: "auto",
          format: "es",
          banner: (chunk) => {
            const hasWithUseClientChunkNameToken = withUseClientChunkNameTokens.some(
              (withUseClientChunkNameToken) =>
                chunk.name.indexOf(withUseClientChunkNameToken) !== -1
            );

            if (hasWithUseClientChunkNameToken) {
              return '"use client"';
            }

            return "";
          },
          entryFileNames: "[name].mjs"
        }
      ]
    }
  },
  plugins: [react(), dts()],
  resolve: {
    alias: inputs.map((input) => ({
      find: `@${input}`,
      replacement: resolve(__dirname, input)
    }))
  }
});
