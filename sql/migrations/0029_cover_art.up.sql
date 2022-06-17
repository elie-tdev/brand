CREATE TABLE cover_art (
  cover_art_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  cover_art_slug text UNIQUE NOT NULL,
  cover_art_title text NOT NULL,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON cover_art TO onebrand_read_write_role;
GRANT SELECT ON cover_art TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON cover_art
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Insert data
INSERT INTO cover_art (
  cover_art_slug,
  cover_art_title
)
values (
  'cover1', 'COVER 1'
), (
  'cover2', 'COVER 2'
), (
  'cover3', 'COVER 3'
), (
  'cover4', 'COVER 4'
), (
  'cover5', 'COVER 5'
), (
  'cover6', 'COVER 6'
);
