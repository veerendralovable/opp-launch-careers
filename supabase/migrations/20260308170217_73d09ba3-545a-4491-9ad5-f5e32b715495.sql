
-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (no auth required)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY "Only admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update contact messages
CREATE POLICY "Only admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete contact messages
CREATE POLICY "Only admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (public.is_admin(auth.uid()));
