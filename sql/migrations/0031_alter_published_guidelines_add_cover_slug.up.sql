ALTER TABLE published_guidelines
ADD cover_art_slug text NOT NULL  DEFAULT 'cover1'
REFERENCES cover_art(cover_art_slug);
