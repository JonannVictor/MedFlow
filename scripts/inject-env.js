/**
 * Script to inject environment variables into the application
 * This is run before the app starts to ensure variables are available
 */

const fs = require("fs");
const path = require("path");

const envFilePath = path.join(__dirname, "../lib/env-generated.ts");

function readExistingEnvValue(key) {
  if (!fs.existsSync(envFilePath)) {
    return "";
  }

  const currentContent = fs.readFileSync(envFilePath, "utf8");
  const match = currentContent.match(new RegExp(`${key}: "([^"]*)"`, "m"));

  return match?.[1] || "";
}

const existingSupabaseUrl = readExistingEnvValue("VITE_SUPABASE_URL");
const existingSupabaseAnonKey = readExistingEnvValue("VITE_SUPABASE_ANON_KEY");

// Prefer current shell env, but preserve the last generated values if local env is missing.
const supabaseUrl = process.env.VITE_SUPABASE_URL || existingSupabaseUrl;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || existingSupabaseAnonKey;

console.log("[inject-env] VITE_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
console.log("[inject-env] VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing");

// Create a module that exports these variables
const envModule = `
// Auto-generated environment variables
export const ENV = {
  VITE_SUPABASE_URL: "${supabaseUrl || ""}",
  VITE_SUPABASE_ANON_KEY: "${supabaseAnonKey || ""}",
};

// Also set on global for compatibility
declare const global: any;

if (typeof global !== "undefined") {
  global.VITE_SUPABASE_URL = ENV.VITE_SUPABASE_URL;
  global.VITE_SUPABASE_ANON_KEY = ENV.VITE_SUPABASE_ANON_KEY;
}

// Set on process.env for Node compatibility
if (typeof process !== "undefined" && process.env) {
  process.env.VITE_SUPABASE_URL = ENV.VITE_SUPABASE_URL;
  process.env.VITE_SUPABASE_ANON_KEY = ENV.VITE_SUPABASE_ANON_KEY;
}
`;

// Write to lib/env-generated.ts
fs.writeFileSync(envFilePath, envModule);
console.log("[inject-env] Generated:", envFilePath);
