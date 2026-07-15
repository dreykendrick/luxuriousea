-- Grant execute permission on generate_order_number to anon and authenticated roles
-- This function is called automatically as a DEFAULT when inserting into orders table
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO anon, authenticated;
