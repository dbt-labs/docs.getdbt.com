---
title: "Custom target names"
id: "custom-target-names"
description: "You can define a custom target name for any dbt Cloud job to correspond to settings in your dbt project."
pagination_next: null
---

## dbt Cloud Scheduler

You can define a custom target name for any dbt Cloud job to correspond to settings in your dbt project. This is helpful if you have logic in your dbt project that behaves differently depending on the specified target, for example:

```sql
select *
from a_big_table

-- limit the amount of data queried in dev
{% if target.name != 'prod' %}
where created_at > date_trunc('month', current_date)
{% endif %}
```

To set a custom target name for a job in dbt Cloud, configure the **Target Name** field for your job in the Job Settings page.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/jobs-settings-target-name.png" title="Overriding the target name to 'prod'"/>

## dbt Cloud IDE
When developing in dbt Cloud, you can set a custom target name in your development credentials. Click your account name above the profile icon in the left panel, select **Account settings**, then go to **Credentials**. Choose the project to update the target name.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/development-credentials.png" title="Overriding the target name to 'dev'"/>
