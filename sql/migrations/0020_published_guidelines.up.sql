CREATE TABLE published_guidelines (
  published_guideline_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  brand_id uuid REFERENCES brands NOT NULL,
  scrape_id uuid REFERENCES scrapes NOT NULL,
  draft_guideline_id uuid REFERENCES draft_guidelines NOT NULL,
  published_guideline_obj jsonb NOT NULL,
  is_public bool NOT NULL DEFAULT true,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON published_guidelines TO onebrand_read_write_role;
GRANT SELECT ON published_guidelines TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON published_guidelines
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
