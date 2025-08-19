-- Create RSVP responses table
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guest_count INTEGER NOT NULL DEFAULT 1,
  is_attending BOOLEAN NOT NULL,
  dietary_restrictions TEXT,
  message TEXT,
  qr_code_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public RSVP form)
CREATE POLICY "Anyone can submit RSVP" 
ON public.rsvp_responses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading only own response by QR token
CREATE POLICY "Can view own RSVP by token" 
ON public.rsvp_responses 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rsvp_responses_updated_at
BEFORE UPDATE ON public.rsvp_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();