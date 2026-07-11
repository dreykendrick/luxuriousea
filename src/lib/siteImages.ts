import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteImageSlot {
  key: string;
  label: string;
  location: string;
  aspect: string; // for the preview box, e.g. "16/9"
  instructions: string;
}

// Every image slot across the site that admins can manage.
// Add a new entry here, then use useSiteImage(key, fallback) wherever
// that image is rendered on the actual site.
export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: "home_hero",
    label: "Home Page Hero",
    location: "Home page, full-screen banner at the top",
    aspect: "16/10",
    instructions:
      "Landscape, at least 1920×1280px. This image fills the entire screen and has a dark overlay + text on top, so slightly darker or lower-contrast-in-the-middle photos read best.",
  },
  {
    key: "editorial_section",
    label: "Editorial / Philosophy Image",
    location: "Home page, \"The Philosophy\" section",
    aspect: "4/5",
    instructions:
      "Portrait, at least 900×1125px (4:5 ratio). A close-up or detail shot works well here since it sits next to text.",
  },
  {
    key: "about_hero",
    label: "About Page Hero",
    location: "About page, banner at the top",
    aspect: "16/9",
    instructions:
      "Landscape, at least 1920×1080px. Has a dark overlay with the page title on top, similar to the home hero.",
  },
  {
    key: "about_founders",
    label: "Founders Photo",
    location: "About page, \"The Founders\" section",
    aspect: "4/5",
    instructions:
      "Portrait, at least 800×1000px (4:5 ratio). A clear photo of Emmanuel & Ainekisha works best here.",
  },
];

const MAX_SITE_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB, matches the storage bucket limit

export async function fetchSiteImages(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_images").select("key, url");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.url;
  return map;
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

export async function uploadSiteImage(key: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_SITE_IMAGE_BYTES) {
    throw new Error("Image is larger than 8MB");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${key}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  const url = data.publicUrl;

  const { error: upsertError } = await supabase
    .from("site_images")
    .upsert({ key, url, updated_at: new Date().toISOString() });
  if (upsertError) throw upsertError;

  return url;
}

/**
 * Fetches the current URL for a site image slot, falling back to a default
 * (e.g. the existing hardcoded/placeholder image) until an admin uploads one.
 *
 * Results are cached in sessionStorage so the correct image is shown instantly
 * on every page visit within the same browser session — no flash of the old
 * fallback while the DB fetch is in flight.
 */
export function useSiteImage(key: string, fallback: string): string {
  const cacheKey = `site_image_${key}`;
  const cached = sessionStorage.getItem(cacheKey);

  const [url, setUrl] = useState<string>(cached ?? fallback);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const found = await fetchSiteImage(key);
        if (!cancelled && found) {
          sessionStorage.setItem(cacheKey, found);
          setUrl(found);
        }
      } catch {
        // keep fallback silently
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key, cacheKey]);

  return url;
}