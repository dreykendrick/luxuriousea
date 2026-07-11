import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2, Link2, Eye } from "lucide-react";
import { SITE_IMAGE_SLOTS, SiteImageSlot, fetchSiteImages, uploadSiteImage } from "@/lib/siteImages";

interface DatabaseImage {
  id: string;
  key: string;
  url: string;
  recommended_aspect_ratio: string;
  max_file_size: string;
}

const AdminImages = () => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [editingUrlKey, setEditingUrlKey] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");

  async function loadImages() {
    try {
      setLoading(true);
      const data = await fetchSiteImages();
      setUrls(data);
    } catch (err) {
      toast.error("Failed to load site images");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
  }, []);

  async function handleFileUpload(key: string, file: File, maxMbStr: string) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Parse max MB size limit
    const maxMbVal = parseFloat(maxMbStr) || 5;
    const maxBytes = maxMbVal * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`Image size is too large. Max size allowed is ${maxMbStr}.`);
      return;
    }

    setUploadingKey(key);
    try {
      const publicUrl = await uploadSiteImage(key, file);
      setUrls((prev) => ({ ...prev, [key]: publicUrl }));
      toast.success("Image uploaded and updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSaveManualUrl(key: string) {
    if (!manualUrl.trim()) return;
    setUploadingKey(key);
    try {
      const { error } = await supabase
        .from("site_images")
        .upsert({ key, url: manualUrl.trim(), updated_at: new Date().toISOString() });
      if (error) throw error;
      setUrls((prev) => ({ ...prev, [key]: manualUrl.trim() }));
      toast.success("Image URL updated successfully!");
      setEditingUrlKey(null);
      setManualUrl("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update URL");
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
          Site-wide Images
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          Manage and upload background images, banners, and layouts across the website.
        </p>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading slots...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {SITE_IMAGE_SLOTS.map((slot) => {
            const currentUrl = urls[slot.key];
            const aspectStyle =
              slot.aspect === "16/9"
                ? "aspect-video"
                : slot.aspect === "4/5"
                ? "aspect-[4/5]"
                : slot.aspect === "16/10"
                ? "aspect-[16/10]"
                : "aspect-square";

            const recommendedSizeText = slot.key.includes("hero") || slot.key.includes("background") ? "5MB" : "3MB";

            return (
              <div key={slot.key} className="border border-border p-6 space-y-6 flex flex-col justify-between bg-card text-card-foreground">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-light">{slot.label}</h3>
                    <p className="font-sans text-xs text-muted-foreground mt-1">{slot.location}</p>
                  </div>

                  {/* Requirements badge bar */}
                  <div className="flex flex-wrap gap-2">
                    <span className="font-sans text-[10px] tracking-wide uppercase px-2.5 py-1 bg-secondary text-secondary-foreground font-medium rounded-none">
                      Aspect Ratio: {slot.aspect}
                    </span>
                    <span className="font-sans text-[10px] tracking-wide uppercase px-2.5 py-1 bg-secondary text-secondary-foreground font-medium rounded-none">
                      Max Size: {recommendedSizeText}
                    </span>
                  </div>

                  {/* Image Preview Box */}
                  <div className={`relative border border-border bg-muted overflow-hidden w-full ${aspectStyle}`}>
                    {currentUrl ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="font-sans text-xs text-muted-foreground">No image set (using default fallback)</span>
                      </div>
                    )}

                    {uploadingKey === slot.key && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-foreground" />
                          <p className="font-sans text-xs text-muted-foreground">Uploading...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    {slot.instructions}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  {editingUrlKey === slot.key ? (
                    <div className="space-y-2">
                      <Label className="font-sans text-xs tracking-wide uppercase">Paste Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://images.unsplash.com/..."
                          value={manualUrl}
                          onChange={(e) => setManualUrl(e.target.value)}
                          className="h-11 flex-1 font-sans text-sm rounded-none"
                        />
                        <Button
                          onClick={() => handleSaveManualUrl(slot.key)}
                          disabled={uploadingKey !== null}
                          className="bg-foreground hover:bg-foreground/90 text-background rounded-none h-11 px-4 font-sans text-xs tracking-wide uppercase"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingUrlKey(null);
                            setManualUrl("");
                          }}
                          className="h-11 rounded-none font-sans text-xs tracking-wide uppercase"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Upload Button */}
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingKey !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleFileUpload(slot.key, file, recommendedSizeText);
                          }}
                        />
                        <div className="w-full inline-flex items-center justify-center gap-2 border border-foreground/20 hover:border-foreground bg-background hover:bg-secondary text-foreground text-xs tracking-ultra uppercase font-sans font-normal h-11 transition-all duration-300 cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload File
                        </div>
                      </label>

                      {/* Direct URL Button */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingUrlKey(slot.key);
                          setManualUrl(currentUrl || "");
                        }}
                        disabled={uploadingKey !== null}
                        className="h-11 rounded-none border border-transparent hover:border-foreground/10 text-xs tracking-ultra uppercase font-sans font-normal"
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        External URL
                      </Button>

                      {/* View Original Image */}
                      {currentUrl && (
                        <Button
                          asChild
                          variant="ghost"
                          className="h-11 rounded-none text-xs tracking-ultra uppercase font-sans font-normal"
                        >
                          <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminImages;
