-- Table: public.art_classes

-- DROP TABLE IF EXISTS public.art_classes;

CREATE TABLE IF NOT EXISTS public.art_classes
(
    id integer NOT NULL DEFAULT nextval('art_classes_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    class_level character varying(100) COLLATE pg_catalog."default",
    additional_notes text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    enroll_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    age integer,
    CONSTRAINT art_classes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.art_classes
    OWNER to postgres;

GRANT ALL ON TABLE public.art_classes TO admin;

GRANT ALL ON TABLE public.art_classes TO postgres;