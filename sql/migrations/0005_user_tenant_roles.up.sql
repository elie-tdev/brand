-- Add tables
CREATE TABLE user_tenant_roles (
  user_tenant_role_slug text PRIMARY KEY NOT NULL,
  display_name text UNIQUE NOT NULL,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON user_tenant_roles TO onebrand_read_write_role;
GRANT SELECT ON user_tenant_roles TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON user_tenant_roles
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add seed
INSERT INTO user_tenant_roles (user_tenant_role_slug,display_name) 
VALUES ('admin', 'Org Admin'),('user', 'Org User');
