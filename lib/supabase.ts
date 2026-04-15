import "@/lib/init-env";
import "@/lib/env-generated";
import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || (global as any).VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || (global as any).VITE_SUPABASE_ANON_KEY;

console.log("[Supabase] URL:", supabaseUrl ? "✓ Loaded" : "✗ Missing");
console.log("[Supabase] Key:", supabaseAnonKey ? "✓ Loaded" : "✗ Missing");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey);
  throw new Error("Missing Supabase environment variables. Please check your configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = any; // TODO: Generate types from Supabase

// Debug: Log that Supabase client was initialized
if (typeof window !== "undefined") {
  console.log("Supabase client initialized successfully");
}
