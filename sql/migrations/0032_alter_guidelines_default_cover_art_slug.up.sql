ALTER TABLE draft_guidelines
DROP CONSTRAINT draft_guidelines_cover_art_slug_fkey;

ALTER TABLE draft_guidelines
ALTER COLUMN cover_art_slug DROP DEFAULT;

ALTER TABLE draft_guidelines
ALTER COLUMN cover_art_slug DROP NOT NULL;
