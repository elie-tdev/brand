ALTER TABLE tenant_brands
ADD chargebee_customer_id text;

update tenant_brands as tb
set chargebee_customer_id = ( 
  select chargebee_customer_id from tenants where tenant_id = tb.tenant_id 
);

ALTER TABLE tenant_brands 
ALTER COLUMN chargebee_customer_id SET NOT NULL;

ALTER TABLE tenants DROP COLUMN chargebee_customer_id;