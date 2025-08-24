-- Table: public.painting_parties

-- DROP TABLE IF EXISTS public.painting_parties;

CREATE TABLE IF NOT EXISTS public.painting_parties
(
    id integer NOT NULL DEFAULT nextval('painting_parties_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    date timestamp without time zone NOT NULL,
    number_of_guests integer DEFAULT 1,
    theme character varying(100) COLLATE pg_catalog."default",
    additional_notes text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT painting_parties_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.painting_parties
    OWNER to postgres;

GRANT ALL ON TABLE public.painting_parties TO admin;

GRANT ALL ON TABLE public.painting_parties TO postgres;