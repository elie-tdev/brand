-- Add tables
CREATE TABLE brands (
  brand_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  website_url text UNIQUE NOT NULL,
  locale text NOT NULL DEFAULT 'en-US'::text,
  had_guidelines text NOT NULL CHECK (((had_guidelines)::text = ANY ((ARRAY['yes'::character varying, 'no'::character varying, 'dont_know'::character varying])::text[]))),
  is_published bool NOT NULL DEFAULT false,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON brands TO onebrand_read_write_role;
GRANT SELECT ON brands TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
