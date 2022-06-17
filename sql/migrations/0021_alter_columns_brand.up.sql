ALTER TABLE brands
ALTER COLUMN scrape_id DROP NOT NULL;

ALTER TABLE brands
ADD draft_guideline_id uuid REFERENCES draft_guidelines;
