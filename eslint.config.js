// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import globals from "globals";

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Node-only CommonJS scripts (e.g. __dirname) run outside the app bundle,
    // same treatment eslint-config-expo already gives metro.config.js.
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
