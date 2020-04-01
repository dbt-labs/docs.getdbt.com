---
title: "Setting a custom target name"
id: "cloud-setting-a-custom-target-name"
---

You can define a custom target name for any dbt Cloud job to correspond to settings in your dbt project. This is helpful if you have logic in your dbt project that behaves differently depending on the specified target, for example:

```sql
select *
from a_big_table

-- limit the amount of data queried in dev
{% if target.name != 'prod' %}
where created_at > date_trunc('month', current_date)
{% endif %}
```

To set a custom target name for a job in dbt Cloud, configure the "Target Name" field for you job in the Job Settings page.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/60f3fa2-Screen_Shot_2019-02-08_at_10.33.20_PM.png" title="Overriding the target name to 'prod'"/>
