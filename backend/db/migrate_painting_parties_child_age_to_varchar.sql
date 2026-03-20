-- One-time migration: normalize painting_parties.child_age to VARCHAR(20)
-- Purpose: keep schema consistent across environments for age-range values (e.g., '4-6', 'mixed').
-- Safe to run multiple times.

DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_data_type TEXT;
    v_max_length INTEGER;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'painting_parties'
    ) INTO v_table_exists;

    IF NOT v_table_exists THEN
        RAISE NOTICE 'Skipping migration: public.painting_parties does not exist.';
        RETURN;
    END IF;

    SELECT data_type, character_maximum_length
    INTO v_data_type, v_max_length
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'painting_parties'
      AND column_name = 'child_age';

    IF v_data_type IS NULL THEN
        RAISE EXCEPTION 'Migration failed: public.painting_parties.child_age does not exist.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.painting_parties
        WHERE length(child_age::text) > 20
    ) THEN
        RAISE EXCEPTION 'Migration failed: found child_age values longer than 20 characters. Clean data first.';
    END IF;

    IF v_data_type <> 'character varying' OR v_max_length IS DISTINCT FROM 20 THEN
        ALTER TABLE public.painting_parties
        ALTER COLUMN child_age TYPE VARCHAR(20)
        USING child_age::text;

        RAISE NOTICE 'Migration applied: public.painting_parties.child_age is now VARCHAR(20).';
    ELSE
        RAISE NOTICE 'No change needed: public.painting_parties.child_age is already VARCHAR(20).';
    END IF;
END
$$;
