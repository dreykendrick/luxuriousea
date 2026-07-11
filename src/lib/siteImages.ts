import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteImageRow {
  id: string;
  key: string;
  name: string;
  url: string;
  recommended_aspect_ratio: string; // e.g. "4:5 (Portrait)"
  max_file_size: string; // e.g. "3MB"
  created_at: string;
  updated_at: string;
}

export async function fetchSiteImageRows(): Promise<SiteImageRow[]> {
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSiteImage(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_images")
    .select("url")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.url ?? null;
}

function parseMaxBytes(maxFileSize: string): number {
  const match = maxFileSize.match(/([\d.]+)\s*(KB|MB|GB)/i);
  if (!match) return 8 * 1024 * 1024; // sensible fallback
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const multiplier = unit === "GB" ? 1024 * 1024 * 1024 : unit === "MB" ? 1024 * 1024 : 1024;
  return num * multiplier;
}

/**
 * Uploads a new image for an existing site_images row (identified by key),
 * then updates that row's url + updated_at. Never touches name/
 * recommended_aspect_ratio/max_file_size — those are fixed metadata for the slot.
 */
export async function uploadSiteImage(row: SiteImageRow, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  const maxBytes = parseMaxBytes(row.max_file_size);
  if (file.size > maxBytes) {
    throw new Error(`Image is larger than the ${row.max_file_size} limit for this slot`);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${row.key}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  const url = data.publicUrl;

  const { error: updateError } = await supabase
    .from("site_images")
    .update({ url, updated_at: new Date().toISOString() })
    .eq("key", row.key);
  if (updateError) throw updateError;

  return url;
}

/**
 * Fetches the current URL for a site image slot, falling back to a default
 * until the row/upload exists.
 */
export function useSiteImage(key: string, fallback: string): string {
  const [url, setUrl] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const found = await fetchSiteImage(key);
        if (!cancelled && found) setUrl(found);
      } catch {
        // keep fallback silently
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return url;
}
