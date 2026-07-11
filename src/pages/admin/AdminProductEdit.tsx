import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, ArrowLeft, Upload, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}
interface VariantForm {
  id?: string;
  size: string;
  color: string;
  color_hex: string;
  sku: string;
  stock: number;
  price_override: string;
  is_active: boolean;
  _isNew?: boolean;
  _deleted?: boolean;
}
interface ImageForm {
  id?: string;
  url: string;
  display_order: number;
  _isNew?: boolean;
  _deleted?: boolean;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB, matches the storage bucket limit

async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is larger than 5MB");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    meaning: "",
    fabric: "",
    fit: "",
    care: "",
    category_id: "",
    base_price: "",
    is_active: true,
    is_new: false,
    is_featured: false,
    is_best_seller: false,
  });
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [images, setImages] = useState<ImageForm[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  async function handleFileSelect(idx: number, file: File | null) {
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadProductImage(file);
      setImages((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], url };
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingIdx(null);
    }
  }

  useEffect(() => {
    void (async () => {
      const { data: cats } = await supabase.from("categories").select("id, name").order("display_order");
      setCategories(cats ?? []);

      if (!isNew && id) {
        const { data } = await supabase
          .from("products")
          .select(
            `*, product_variants(id, size, color, color_hex, sku, stock, price_override, is_active),
             product_images(id, url, display_order)`
          )
          .eq("id", id)
          .maybeSingle();
        if (data) {
          setForm({
            slug: data.slug ?? "",
            name: data.name ?? "",
            description: data.description ?? "",
            meaning: data.meaning ?? "",
            fabric: data.fabric ?? "",
            fit: data.fit ?? "",
            care: data.care ?? "",
            category_id: data.category_id ?? "",
            base_price: String(data.base_price ?? ""),
            is_active: data.is_active,
            is_new: data.is_new,
            is_featured: data.is_featured,
            is_best_seller: data.is_best_seller,
          });
          setVariants(
            (data.product_variants ?? []).map((v: any) => ({
              id: v.id,
              size: v.size ?? "",
              color: v.color ?? "",
              color_hex: v.color_hex ?? "",
              sku: v.sku ?? "",
              stock: v.stock,
              price_override: v.price_override != null ? String(v.price_override) : "",
              is_active: v.is_active,
            }))
          );
          setImages(
            (data.product_images ?? [])
              .sort((a: any, b: any) => a.display_order - b.display_order)
              .map((img: any) => ({
                id: img.id,
                url: img.url,
                display_order: img.display_order,
              }))
          );
        }
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  async function handleSave() {
    if (!form.name || !form.base_price) {
      toast.error("Name and price are required");
      return;
    }
    if (uploadingIdx !== null) {
      toast.error("Please wait for the image upload to finish");
      return;
    }
    const slug = form.slug || slugify(form.name);

    setSaving(true);
    try {
      let productId = id;
      if (isNew) {
        const { data, error } = await supabase
          .from("products")
          .insert({
            ...form,
            slug,
            base_price: Number(form.base_price),
            category_id: form.category_id || null,
          })
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase
          .from("products")
          .update({
            ...form,
            slug,
            base_price: Number(form.base_price),
            category_id: form.category_id || null,
          })
          .eq("id", id!);
        if (error) throw error;
      }

      // Variants: delete removed, upsert others
      const varsToDelete = variants.filter((v) => v._deleted && v.id);
      const varsToUpsert = variants
        .filter((v) => !v._deleted)
        .map((v) => ({
          ...(v.id && !v._isNew ? { id: v.id } : {}),
          product_id: productId!,
          size: v.size || null,
          color: v.color || null,
          color_hex: v.color_hex || null,
          sku: v.sku || null,
          stock: Number(v.stock) || 0,
          price_override: v.price_override ? Number(v.price_override) : null,
          is_active: v.is_active,
        }));
      if (varsToDelete.length > 0) {
        await supabase.from("product_variants").delete().in("id", varsToDelete.map((v) => v.id!));
      }
      if (varsToUpsert.length > 0) {
        const { error } = await supabase.from("product_variants").upsert(varsToUpsert);
        if (error) throw error;
      }

      // Images
      const imgsToDelete = images.filter((i) => i._deleted && i.id);
      const imgsToUpsert = images
        .filter((i) => !i._deleted && i.url)
        .map((i, idx) => ({
          ...(i.id && !i._isNew ? { id: i.id } : {}),
          product_id: productId!,
          url: i.url,
          display_order: idx,
        }));
      if (imgsToDelete.length > 0) {
        await supabase.from("product_images").delete().in("id", imgsToDelete.map((i) => i.id!));
      }
      if (imgsToUpsert.length > 0) {
        const { error } = await supabase.from("product_images").upsert(imgsToUpsert);
        if (error) throw error;
      }

      toast.success(isNew ? "Product created" : "Product updated");
      navigate("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!confirm("Delete this product permanently? Orders that reference it will keep their snapshot.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id!);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    navigate("/admin/products");
  }

  if (loading) {
    return <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>;
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 font-sans text-xs tracking-wide uppercase text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Products
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
          {isNew ? "New Product" : form.name || "Edit Product"}
        </h1>
        <div className="flex gap-3">
          {!isNew && (
            <Button variant="outline" onClick={handleDelete} className="h-11 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-foreground hover:bg-foreground/90 text-background h-11 px-6 font-sans text-xs tracking-ultra uppercase"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Basic */}
        <section className="border border-border p-6 space-y-4">
          <h2 className="font-serif text-xl font-light mb-2">Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Slug (URL)</Label>
              <Input
                placeholder={slugify(form.name)}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Category</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Price (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-sans text-xs tracking-wide uppercase">Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-sans text-xs tracking-wide uppercase">
              Meaning Behind This Piece
            </Label>
            <Textarea
              rows={3}
              value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              placeholder="2–4 lines, poetic but grounded."
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Fabric</Label>
              <Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Fit</Label>
              <Input value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs tracking-wide uppercase">Care</Label>
              <Input value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })} className="h-11" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            {[
              { key: "is_active", label: "Live on Site" },
              { key: "is_new", label: "New Arrival" },
              { key: "is_featured", label: "Featured" },
              { key: "is_best_seller", label: "Best Seller" },
            ].map((f) => (
              <label key={f.key} className="flex items-center gap-3 cursor-pointer">
                <Switch
                  checked={(form as any)[f.key]}
                  onCheckedChange={(v) => setForm({ ...form, [f.key]: v })}
                />
                <span className="font-sans text-xs tracking-wide uppercase">{f.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-light">Images</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setImages([...images, { url: "", display_order: images.length, _isNew: true }])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Image
            </Button>
          </div>
          <div className="space-y-3">
            {images.filter((i) => !i._deleted).length === 0 && (
              <p className="font-sans text-sm text-muted-foreground">No images yet.</p>
            )}
            {images.map((img, idx) =>
              img._deleted ? null : (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="w-16 aspect-[3/4] bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                    {uploadingIdx === idx ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : img.url ? (
                      <img src={img.url} alt="" className="w-full h-full object-contain" />
                    ) : null}
                  </div>
                  <label className="flex-1 h-11 border border-input rounded-md flex items-center px-3 gap-2 cursor-pointer text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {uploadingIdx === idx
                        ? "Uploading..."
                        : img.url
                        ? "Replace image"
                        : "Choose image to upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIdx !== null}
                      onChange={(e) => {
                        void handleFileSelect(idx, e.target.files?.[0] ?? null);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const next = [...images];
                      next[idx] = { ...next[idx], _deleted: true };
                      setImages(next);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            )}
          </div>
        </section>

        {/* Variants */}
        <section className="border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-light">Variants & Inventory</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setVariants([
                  ...variants,
                  {
                    size: "",
                    color: "",
                    color_hex: "",
                    sku: "",
                    stock: 0,
                    price_override: "",
                    is_active: true,
                    _isNew: true,
                  },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Variant
            </Button>
          </div>
          {variants.filter((v) => !v._deleted).length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">
              Add at least one variant so customers can add this piece to their bag.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-12 gap-2 font-sans text-xs tracking-wide uppercase text-muted-foreground">
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Color</div>
                <div className="col-span-2">Hex</div>
                <div className="col-span-2">SKU</div>
                <div className="col-span-1">Stock</div>
                <div className="col-span-2">Price ovr.</div>
                <div className="col-span-1"></div>
              </div>
              {variants.map((v, idx) =>
                v._deleted ? null : (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-6 md:col-span-2 h-10"
                      placeholder="Size"
                      value={v.size}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].size = e.target.value;
                        setVariants(n);
                      }}
                    />
                    <Input
                      className="col-span-6 md:col-span-2 h-10"
                      placeholder="Color"
                      value={v.color}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].color = e.target.value;
                        setVariants(n);
                      }}
                    />
                    <Input
                      className="col-span-6 md:col-span-2 h-10"
                      placeholder="#000000"
                      value={v.color_hex}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].color_hex = e.target.value;
                        setVariants(n);
                      }}
                    />
                    <Input
                      className="col-span-6 md:col-span-2 h-10"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].sku = e.target.value;
                        setVariants(n);
                      }}
                    />
                    <Input
                      type="number"
                      className="col-span-4 md:col-span-1 h-10"
                      value={v.stock}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].stock = Number(e.target.value);
                        setVariants(n);
                      }}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      className="col-span-6 md:col-span-2 h-10"
                      placeholder="—"
                      value={v.price_override}
                      onChange={(e) => {
                        const n = [...variants];
                        n[idx].price_override = e.target.value;
                        setVariants(n);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="col-span-2 md:col-span-1 h-10"
                      onClick={() => {
                        const n = [...variants];
                        n[idx] = { ...n[idx], _deleted: true };
                        setVariants(n);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminProductEdit;
