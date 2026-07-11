import { useEffect, useState } from "react";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { SiteImageRow, fetchSiteImageRows, uploadSiteImage } from "@/lib/siteImages";

function aspectRatioToCss(recommended: string): string {
  // "4:5 (Portrait)" -> "4/5", "16:9 (Landscape)" -> "16/9"
  const match = recommended.match(/(\d+):(\d+)/);
  return match ? `${match[1]}/${match[2]}` : "4/5";
}

const AdminSiteImages = () => {
  const [rows, setRows] = useState<SiteImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    void loadRows();
  }, []);

  async function loadRows() {
    try {
      setRows(await fetchSiteImageRows());
    } catch {
      toast.error("Failed to load current images");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(row: SiteImageRow, file: File | null) {
    if (!file) return;
    setUploadingKey(row.key);
    try {
      const url = await uploadSiteImage(row, file);
      setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, url } : r)));
      toast.success("Image updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingKey(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl mb-2">Site Images</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Manage the banner and feature photos used across the site. Each slot below shows
        exactly where it appears and what size image works best.
      </p>

      <div className="space-y-8">
        {rows.map((row) => {
          const isUploading = uploadingKey === row.key;
          return (
            <div key={row.key} className="border border-border rounded-lg p-5 flex gap-5">
              <div
                className="w-32 shrink-0 bg-secondary overflow-hidden flex items-center justify-center rounded"
                style={{ aspectRatio: aspectRatioToCss(row.recommended_aspect_ratio) }}
              >
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : row.url ? (
                  <img src={row.url} alt={row.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg">{row.name}</h2>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Recommended: <span className="text-foreground">{row.recommended_aspect_ratio}</span>
                  {" · "}Max file size: <span className="text-foreground">{row.max_file_size}</span>
                </p>

                <label className="mt-4 inline-flex h-10 items-center gap-2 px-4 border border-input rounded-md text-sm cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Replace image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingKey !== null}
                    onChange={(e) => {
                      void handleFileSelect(row, e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSiteImages;
