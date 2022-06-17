ALTER TABLE draft_guidelines ALTER COLUMN scrape_id DROP NOT NULL;
ALTER TABLE published_guidelines ALTER COLUMN scrape_id DROP NOT NULL;
