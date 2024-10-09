import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react-swc";
import { glob } from "glob";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

const withUseClientChunkNameTokens = ["Updater", "Client", "InserterGuard"];
const inputs = [
  {
    name: "core",
    pullUp: false
  },
  {
    name: "serializer",
    pullUp: false
  },
  {
    name: "setup",
    pullUp: false
  },
  {
    name: "utils",
    pullUp: false
  }
];

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: "styled/index.ts",
        name: "basic-styled"
      },
      rollupOptions: {
        external: [...Object.keys(pkg.peerDependencies), /jsx-runtime/g],
        input: Object.fromEntries(
          inputs
            .map(({ name, pullUp }) =>
              glob
                .sync(`${name}/**/*.{ts,tsx}`, {
                  ignore: [
                    "**/*.d.ts",
                    "**/*.styles.{ts,tsx}",
                    "**/*.stories.tsx",
                    "**/typing.ts",
                    "**/*.typing.ts"
                  ]
                })
                .map((file) => [
                  pullUp
                    ? relative(name, file.slice(0, file.length - extname(file).length))
                    : file.slice(0, file.length - extname(file).length),
                  fileURLToPath(new URL(file, import.meta.url))
                ])
            )
            .flat()
        ),
        output: [
          {
            interop: "auto",
            format: "cjs",
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
            entryFileNames: "[name].js"
          },
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
            entryFileNames: "[name].es.js"
          }
        ]
      }
    },
    plugins: [
      react(),
      dts({
        beforeWriteFile: (filePath, content) => {
          let newPath = filePath;
          let newContent = content;

          inputs.forEach(({ name, pullUp }) => {
            if (pullUp) {
              newPath = newPath.replace(`/${name}`, "");

              newContent = content.replace(/from '\.\.\/\.\.\//g, "from '../");
            }
          });

          return { filePath: newPath, content: newContent };
        }
      })
    ],
    resolve: {
      alias: inputs.map(({ name }) => ({
        find: `@${name}`,
        replacement: resolve(__dirname, name)
      }))
    }
  };
});
