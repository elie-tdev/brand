-- Add tables
CREATE TABLE tenant_brand_roles (
  tenant_brand_role_slug text PRIMARY KEY NOT NULL,
  display_name text UNIQUE NOT NULL,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON tenant_brand_roles TO onebrand_read_write_role;
GRANT SELECT ON tenant_brand_roles TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON tenant_brand_roles
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

INSERT INTO tenant_brand_roles (tenant_brand_role_slug, display_name) 
VALUES ('owner', 'Brand Owner'), ('agent', 'Brand Agent');
