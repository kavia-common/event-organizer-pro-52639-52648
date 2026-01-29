import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      ".angular/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.config.mjs",
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        // Test globals
        describe: "readonly",
        beforeEach: "readonly",
        it: "readonly",
        expect: "readonly",

        // Browser globals (required for Angular apps)
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        window: "readonly",
        localStorage: "readonly",
        CustomEvent: "readonly",
        Event: "readonly",

        // Node.js globals
        process: "readonly",
        console: "readonly"
      }
    },
    rules: {
      // This repo uses the TypeScript parser but does not register the @typescript-eslint plugin rules.
      // If rule comments reference these, ESLint errors with "Definition for rule ... was not found".
      "@typescript-eslint/no-explicit-any": "off",

      "no-undef": "error",
      "no-unused-vars": "off", // Turn off since TS handles this
      "no-unreachable": "error",
      "no-unexpected-multiline": "error",
      "no-unsafe-finally": "error",
      "no-invalid-regexp": "error",
      "no-obj-calls": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-duplicate-case": "error",
      "no-empty-character-class": "error",
      "no-ex-assign": "error",
      "no-func-assign": "error",
      "no-inner-declarations": "error",
      "no-irregular-whitespace": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error"
    }
  }
];
