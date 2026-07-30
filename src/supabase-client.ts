import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const galleryBucket = (import.meta.env.VITE_SUPABASE_GALLERY_BUCKET || "client-galleries").trim();
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
export const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim();

let client: SupabaseClient | null = null;

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getSupabase(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error("Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Vercel.");
  }

  if (!client) {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}

export function getProjectId(): string {
  if (!supabaseUrl) return "";
  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

export function publicObjectUrl(path: string, downloadName?: string): string {
  const storage = getSupabase().storage.from(galleryBucket);
  const options = downloadName ? { download: downloadName } : undefined;
  return storage.getPublicUrl(path, options).data.publicUrl;
}
