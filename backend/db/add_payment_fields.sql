-- Add payment tracking fields to all booking tables

-- Art Classes
ALTER TABLE public.art_classes
ADD COLUMN IF NOT EXISTS payment_status character varying(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS paypal_order_id character varying(100),
ADD COLUMN IF NOT EXISTS paypal_capture_id character varying(100),
ADD COLUMN IF NOT EXISTS payment_date timestamp without time zone;

-- Birthday Parties
ALTER TABLE public.birthday_parties
ADD COLUMN IF NOT EXISTS payment_status character varying(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS paypal_order_id character varying(100),
ADD COLUMN IF NOT EXISTS paypal_capture_id character varying(100),
ADD COLUMN IF NOT EXISTS payment_date timestamp without time zone;

-- Painting Parties
ALTER TABLE public.painting_parties
ADD COLUMN IF NOT EXISTS payment_status character varying(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS paypal_order_id character varying(100),
ADD COLUMN IF NOT EXISTS paypal_capture_id character varying(100),
ADD COLUMN IF NOT EXISTS payment_date timestamp without time zone;

-- Add comments
COMMENT ON COLUMN public.art_classes.payment_status IS 'Payment status: pending, completed, failed, refunded';
COMMENT ON COLUMN public.birthday_parties.payment_status IS 'Payment status: pending, completed, failed, refunded';
COMMENT ON COLUMN public.painting_parties.payment_status IS 'Payment status: pending, completed, failed, refunded';
