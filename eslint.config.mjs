import toruslabsJavascript from "@toruslabs/eslint-config-javascript";

export default [
  ...toruslabsJavascript,
  {
    ignores: ["build/"],
    rules: {
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
];
