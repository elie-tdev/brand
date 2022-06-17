ALTER TABLE logos DROP CONSTRAINT logos_brand_id_key;

ALTER TABLE logos 
 ADD COLUMN original text,
 ADD COLUMN encoded text;

UPDATE logos SET encoded = logo_url;

ALTER TABLE logos DROP COLUMN logo_url; 