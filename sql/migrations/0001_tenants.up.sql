-- Add tables
CREATE TABLE tenants (
  tenant_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL ,
  is_agency bool NOT NULL DEFAULT false,
  chargebee_customer_id text UNIQUE,
  admin_review_status text NOT NULL DEFAULT 'pending'::text CHECK ((admin_review_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))),
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON tenants TO onebrand_read_write_role;
GRANT SELECT ON tenants TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
