import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  sku: string | null;
  price_override: number | null;
  stock: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meaning: string | null;
  fabric: string | null;
  fit: string | null;
  care: string | null;
  base_price: number;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_preorder: boolean;
  category?: { slug: string; name: string } | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
}

export async function fetchProducts(opts?: {
  categorySlug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  includeInactive?: boolean;
}) {
  let query = supabase
    .from("products")
    .select(
      `id, slug, name, description, meaning, fabric, fit, care, base_price,
       category_id, is_active, is_featured, is_best_seller, is_new, is_preorder,
       category:categories(slug, name),
       product_images(id, url, alt_text, display_order)`
    )
    .order("created_at", { ascending: false });

  if (!opts?.includeInactive) query = query.eq("is_active", true);
  if (opts?.featured) query = query.eq("is_featured", true);
  if (opts?.bestSeller) query = query.eq("is_best_seller", true);
  if (opts?.isNew) query = query.eq("is_new", true);

  const { data, error } = await query;
  if (error) throw error;

  let products = (data ?? []) as unknown as Product[];
  if (opts?.categorySlug) {
    products = products.filter((p) => p.category?.slug === opts.categorySlug);
  }
  // Ensure images sorted
  products.forEach((p) => {
    p.product_images?.sort((a, b) => a.display_order - b.display_order);
  });
  return products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, slug, name, description, meaning, fabric, fit, care, base_price,
       category_id, is_active, is_featured, is_best_seller, is_new, is_preorder,
       category:categories(slug, name),
       product_images(id, url, alt_text, display_order),
       product_variants(id, size, color, color_hex, sku, price_override, stock, is_active)`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = data as unknown as Product;
  product.product_images?.sort((a, b) => a.display_order - b.display_order);
  return product;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("display_order");
  if (error) throw error;
  return data ?? [];
}
