create table tmp_subscription_period_ends_migration (
    tenant_id uuid,
    subscription_period_ends bigint
);

insert into tmp_subscription_period_ends_migration
select tenant_id, (extract(epoch from date_trunc('milliseconds', subscription_period_ends))  * 1000)
from tenant_brands;

alter table tenant_brands 
drop column subscription_period_ends;

alter table tenant_brands 
add column subscription_period_ends bigint;

update tenant_brands as tb
set subscription_period_ends = ( 
    select subscription_period_ends from tmp_subscription_period_ends_migration where tenant_id = tb.tenant_id 
    );

drop table if exists tmp_subscription_period_ends_migration;