import { createClient, type SupabaseClient } from "@supabase/supabase-js";
function lazyClient(
  key: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY",
): SupabaseClient {
  let client: SupabaseClient | undefined;
  return new Proxy({} as SupabaseClient, {
    get(_, property) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const secret = process.env[key];
      if (!url || !secret) throw new Error("Supabase is not configured");
      client ??= createClient(url, secret);
      const value = Reflect.get(client, property);
      return typeof value === "function" ? value.bind(client) : value;
    },
  });
}
export const supabase = lazyClient("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const supabaseAdmin = lazyClient("SUPABASE_SERVICE_ROLE_KEY");
