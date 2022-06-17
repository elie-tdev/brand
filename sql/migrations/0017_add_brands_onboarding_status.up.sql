ALTER TABLE brands
ADD onboarding_status jsonb not null default '{"colors":"waiting","logos":"waiting","typography":"waiting","templates":"waiting"}'::jsonb;