-- Table: public.birthday_parties

-- DROP TABLE IF EXISTS public.birthday_parties;

CREATE TABLE IF NOT EXISTS public.birthday_parties
(
    id integer NOT NULL DEFAULT nextval('birthday_parties_id_seq'::regclass),
    parent_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default" NOT NULL,
    child_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    child_age integer NOT NULL,
    party_date date NOT NULL,
    party_time time without time zone NOT NULL,
    guest_count integer NOT NULL,
    package character varying(50) COLLATE pg_catalog."default" NOT NULL,
    theme character varying(50) COLLATE pg_catalog."default" NOT NULL,
    custom_theme character varying(200) COLLATE pg_catalog."default",
    venue_address character varying(200) COLLATE pg_catalog."default" NOT NULL,
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    zip_code character varying(10) COLLATE pg_catalog."default" NOT NULL,
    special_requests text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT birthday_parties_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.birthday_parties
    OWNER to postgres;

GRANT ALL ON TABLE public.birthday_parties TO admin;

GRANT ALL ON TABLE public.birthday_parties TO postgres;