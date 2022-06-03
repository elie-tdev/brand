-- Add tables
CREATE TABLE subscription_plans (
  subscription_plan_slug text PRIMARY KEY NOT NULL,
  display_name text UNIQUE NOT NULL,
  features jsonb NOT NULL,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON subscription_plans TO onebrand_read_write_role;
GRANT SELECT ON subscription_plans TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();