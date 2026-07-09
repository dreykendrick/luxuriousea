
-- Fix search_path on generate_order_number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'EA-' || to_char(now(), 'YYYY') || '-' ||
                lpad(floor(random() * 1000000)::text, 6, '0');
  RETURN new_number;
END;
$$;

-- Revoke public EXECUTE on internal functions (triggers/defaults still work)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
-- has_role must be callable by authenticated (used by RLS policies)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;

-- Tighten "Anyone can create orders": user_id must be null (guest) OR match caller
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Guests or self create orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL AND auth.uid() IS NULL)
    OR (user_id = auth.uid())
  );

-- Tighten "Anyone can create order items": must belong to an order the caller could create/own
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Create items for own orders" ON public.order_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (
          (o.user_id IS NULL AND auth.uid() IS NULL)
          OR o.user_id = auth.uid()
        )
    )
  );
