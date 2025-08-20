-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Can view own RSVP by token" ON public.rsvp_responses;

-- Create a secure policy that only allows access with the correct QR token
-- This ensures guests can only view their own RSVP data using their unique token
CREATE POLICY "Guests can view own RSVP by token" 
ON public.rsvp_responses 
FOR SELECT 
USING (
  -- Only allow access if a qr_code_token parameter is provided and matches
  qr_code_token::text = current_setting('request.jwt.claims', true)::json->>'qr_token'
  OR
  -- Fallback: allow access via URL parameter (for QR code scanning)
  qr_code_token::text = current_setting('request.headers', true)::json->>'x-qr-token'
);

-- Update the database function to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set explicit search_path for security
  SET search_path = public;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;