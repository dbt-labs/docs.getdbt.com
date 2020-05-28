---
title: Data test configurations
---

* enabled
* severity

Can only be configured from a config block
```jinja
{{
    config(
        enabled=true | false,
        severity='warn' | 'error'
    )
}}
```
