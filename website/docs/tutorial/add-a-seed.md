---
title: Add a seed file
id: add-a-seed
description: Learn how to add a seed file to your project
---
:::caution Heads up!
You'll need to have completed the Getting Started part of this tutorial to
complete this lesson
:::

1. Add a seed file:

<File name='seeds/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Run `dbt seed`
3. Ref the model in a downstream model

<File name='models/something.sql'>

```sql
select * from {{ ref('country_codes') }}
```

</File>
