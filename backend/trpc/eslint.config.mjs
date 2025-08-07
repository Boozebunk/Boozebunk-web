import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default [
  { files: ["**/*.{ts,js}"] },
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginPrettier,
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["dist/**", "coverage", "node_modules"],
  },
];
