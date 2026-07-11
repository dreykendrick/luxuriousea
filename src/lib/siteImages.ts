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

// ---------------------------------------------------------------------------
// Local cache helpers
// We use localStorage (persists across tabs/refreshes) instead of sessionStorage
// so the cache is always fresh: we write the new URL the moment the admin saves
// an image, which means the next page refresh always loads the correct image
// immediately with zero flash.
// ---------------------------------------------------------------------------
const CACHE_PREFIX = "site_img_v1_";

export function setSiteImageCache(key: string, url: string): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, url);
  } catch {
    // ignore quota errors
  }
}

export function getSiteImageCache(key: string): string | null {
  try {
    return localStorage.getItem(`${CACHE_PREFIX}${key}`);
  } catch {
    return null;
  }
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

  // Write to local cache immediately so the NEXT page refresh shows this
  // new URL right away — no flash of the old image.
  setSiteImageCache(row.key, url);

  return url;
}

/**
 * Returns the URL for a site image slot, with zero flash on refresh.
 *
 * Strategy:
 * 1. Read from localStorage immediately (written on every admin save) so the
 *    correct image is available synchronously — before any network request.
 * 2. Fetch from DB in the background to pick up any changes made in another
 *    browser/device.
 * 3. When the DB returns a DIFFERENT url, preload it with a hidden Image object
 *    before calling setState, so the src swap is instant (image already in
 *    browser memory) — no blank frame, no visible transition.
 */
export function useSiteImage(key: string, fallback: string): string {
  const [url, setUrl] = useState<string>(() => getSiteImageCache(key) ?? fallback);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const found = await fetchSiteImage(key);
        if (!cancelled && found) {
          // Always keep localStorage up-to-date
          setSiteImageCache(key, found);

          if (found === url) return; // already showing the right image

          // Preload the new image before swapping so there is no blank frame
          const img = new window.Image();
          const swap = () => { if (!cancelled) setUrl(found); };
          img.onload = swap;
          img.onerror = swap; // swap even on error so we don't stay on stale
          img.src = found;
        }
      } catch {
        // keep current url silently
      }
    })();
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return url;
}
