-- Add pre-order toggle to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN NOT NULL DEFAULT false;
