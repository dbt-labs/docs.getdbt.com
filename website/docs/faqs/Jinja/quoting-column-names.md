---
title: Why do I need to quote column names in Jinja?
description: "Use quotes to pass string"
sidebar_label: 'Why quote column names in Jinja'
id: quoting-column-names
---

In the [macro example](/docs/build/jinja-macros#macros) we passed the column name `amount` quotes:

```sql
{{ cents_to_dollars('amount') }} as amount_usd
```

We have to use quotes to pass the _string_ `'amount'` to the macro.

Without the quotes, the Jinja parser will look for a variable named `amount`. Since this doesn't exist, it will compile to nothing.

Quoting in Jinja can take a while to get used to! The rule is that you're within a Jinja expression or statement (i.e. within `{% ... %}` or `{{ ... }}`), you'll need to use quotes for any arguments that are strings.

Single and double quotes are equivalent in Jinja – just make sure you match them appropriately.

And if you do need to pass a variable as an argument, make sure you [don't nest your curlies](/docs/building-a-dbt-project/dont-nest-your-curlies)
