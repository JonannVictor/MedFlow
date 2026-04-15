/**
 * Initialize environment variables for the application
 * This ensures Supabase credentials are available at runtime
 */

export function initializeEnvironment() {
  // Check if variables are already set
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    console.log("[ENV] Supabase variables already loaded");
    return;
  }

  // Try to get from global scope (injected by build system)
  if (typeof global !== "undefined") {
    if (!process.env.VITE_SUPABASE_URL && (global as any).VITE_SUPABASE_URL) {
      process.env.VITE_SUPABASE_URL = (global as any).VITE_SUPABASE_URL;
      console.log("[ENV] Loaded VITE_SUPABASE_URL from global");
    }
    if (!process.env.VITE_SUPABASE_ANON_KEY && (global as any).VITE_SUPABASE_ANON_KEY) {
      process.env.VITE_SUPABASE_ANON_KEY = (global as any).VITE_SUPABASE_ANON_KEY;
      console.log("[ENV] Loaded VITE_SUPABASE_ANON_KEY from global");
    }
  }

  // Log current state
  console.log("[ENV] VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL ? "✓ Set" : "✗ Missing");
  console.log("[ENV] VITE_SUPABASE_ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing");
}

// Initialize on module load
initializeEnvironment();
