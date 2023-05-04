---
title: "About run_started_at variable"
sidebar_label: "run_started_at"
id: "run_started_at"
description: "Use `run_started_at` to output the timestamp the run started."
---

`run_started_at` outputs the timestamp that this run started, e.g. `2017-04-21 01:23:45.678`.

The `run_started_at` variable is a Python `datetime` object. As of 0.9.1, the timezone of this variable 
 defaults to UTC.

<File name='run_started_at_example.sql'>

```sql
select
	'{{ run_started_at.strftime("%Y-%m-%d") }}' as date_day
  
from ...
```

</File>

To modify the timezone of this variable, use the the `pytz` module:

<File name='run_started_at_utc.sql'>

```sql
select
	'{{ run_started_at.astimezone(modules.pytz.timezone("America/New_York")) }}' as run_started_est
  
from ...
```

</File>
