
// Auto-generated environment variables
export const ENV = {
  VITE_SUPABASE_URL: "https://bawljfxhdsxrefgduuel.supabase.co",
  VITE_SUPABASE_ANON_KEY: "sb_publishable_1cO_p_AWkF1LeOZvXPSnIQ_UqjpXby5",
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
