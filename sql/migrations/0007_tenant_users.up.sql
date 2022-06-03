-- Add tables
CREATE TABLE tenant_users (
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  invite_hash text,
  invite_status text CHECK ((invite_status = ANY (ARRAY['sent'::text, 'accepted'::text]))),
  user_tenant_role_slug text REFERENCES user_tenant_roles ON DELETE NO ACTION ON UPDATE NO ACTION,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6),
  PRIMARY KEY (tenant_id, user_id)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON tenant_users TO onebrand_read_write_role;
GRANT SELECT ON tenant_users TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON tenant_users
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
