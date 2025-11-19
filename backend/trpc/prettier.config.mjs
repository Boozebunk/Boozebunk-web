/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  singleQuote: false,
  printWidth: 100,
  bracketSameLine: true,
  endOfLine: "auto",
  semi: true,
  trailingComma: "all",
  // This plugin's options
  importOrder: [
    "<BUILTIN_MODULES>",
    "^(~/bun/(.*)$)|^(~/bun$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@boozebunk-trpc/modules/(.*)$)|^(@boozebunk-trpc/modules$)",
    "^@boozebunk-trpc/(.*)$",
    "",
    "^\\../",
    "",
    "^\\./",
    "",
    "<TYPES>",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypescriptVersion: "5.0.0",
};
