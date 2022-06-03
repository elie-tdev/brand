-- Add tables
CREATE TABLE tenant_brands (
  tenant_id uuid REFERENCES tenants NOT NULL,
  brand_id uuid REFERENCES brands NOT NULL,
  tenant_brand_role_slug text REFERENCES tenant_brand_roles ON DELETE NO ACTION ON UPDATE NO ACTION NOT NULL,
  subscription_period_ends timestamp(6) NOT NULL DEFAULT (now() + '30 days'::interval day),
  chargebee_subscription_id text UNIQUE,
  subscription_plan_slug text REFERENCES subscription_plans ON DELETE NO ACTION ON UPDATE NO ACTION,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6),
  PRIMARY KEY (tenant_id, brand_id)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON tenant_brands TO onebrand_read_write_role;
GRANT SELECT ON tenant_brands TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON tenant_brands
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();