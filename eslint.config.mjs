import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,mts,ts,jsx,tsx}"],
    ignores: ["dist/**/*", "node_modules/**/*"]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginReact.configs.flat.recommended,
  pluginPrettierRecommended,
  {
    rules: {
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"]
            }
          ]
        }
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          pathGroups: [
            {
              pattern: "react*",
              group: "builtin",
              position: "before"
            },
            {
              pattern: "@core/*",
              group: "internal",
              position: "before"
            },
            {
              pattern: "@serializer/*",
              group: "internal",
              position: "before"
            },
            {
              pattern: "@setup/*",
              group: "internal",
              position: "before"
            },
            {
              pattern: "@utils/*",
              group: "internal",
              position: "before"
            }
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          },
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always-and-inside-groups"
        }
      ],
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {}
      }
    }
  }
];
