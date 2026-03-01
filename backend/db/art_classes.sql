-- Table: public.art_classes

-- DROP TABLE IF EXISTS public.art_classes;

CREATE TABLE IF NOT EXISTS public.art_classes
(
    id integer NOT NULL DEFAULT nextval('art_classes_id_seq'::regclass),
    parent_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default" NOT NULL,
    student_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    student_age integer NOT NULL,
    enroll_date date NOT NULL,
    class_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    preferred_day character varying(50) COLLATE pg_catalog."default" NOT NULL,
    special_requests text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT art_classes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.art_classes
    OWNER to postgres;

GRANT ALL ON TABLE public.art_classes TO admin;

GRANT ALL ON TABLE public.art_classes TO postgres;