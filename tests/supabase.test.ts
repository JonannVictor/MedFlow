import "../lib/env-generated";
import { describe, it, expect } from "vitest";

describe("Supabase Configuration", () => {
  it("should have Supabase environment variables configured", () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();
    expect(supabaseUrl).toContain("supabase.co");
    expect(supabaseKey).toBeDefined();
  });

  it("should validate Supabase URL format", () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    expect(supabaseUrl).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
  });

  it("should validate Supabase anon key format", () => {
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    expect(supabaseKey).toMatch(/^sb_/);
  });
});
