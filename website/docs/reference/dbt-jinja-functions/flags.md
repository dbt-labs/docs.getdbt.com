---
title: "flags"
id: "flags"
---

The `flags` variable contains true/false values for flags provided on the command line.

__Example usage:__

<File name='flags.sql'>

```sql
{% if flags.FULL_REFRESH %}
drop table ...
{% else %}
-- no-op
{% endif %}
```

</File>

The list of valid flags are:
- `flags.STRICT_MODE`: True if `--strict` (or `-S`) was provided on the command line
- `flags.FULL_REFRESH`: True if `--full-refresh` was provided on the command line 
- `flags.NON_DESTRUCTIVE`: True if `--non-destructive` was provided on the command line