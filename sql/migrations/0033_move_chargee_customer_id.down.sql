ALTER TABLE tenants
ADD chargebee_customer_id text;

update tenants as t
set chargebee_customer_id = ( 
  select chargebee_customer_id from tenant_brands where tenant_id = t.tenant_id 
);

ALTER TABLE tenants 
ALTER COLUMN chargebee_customer_id SET NOT NULL;

ALTER TABLE tenant_brands DROP COLUMN chargebee_customer_id;
