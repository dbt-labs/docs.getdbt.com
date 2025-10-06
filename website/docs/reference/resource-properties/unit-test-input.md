---
title: "Input for unit tests"
sidebar_label: "Input"
---

Use inputs in your unit tests to reference a specific model or source for the test:

-  For `input:`, use a string that represents a `ref` or `source` call:
    - `ref('my_model')` or `ref('my_model', v='2')` or `ref('dougs_project', 'users')`
    - `source('source_schema', 'source_name')`
- Optionally use for seeds:
    - If you don’t supply an input for a seed, we will use the seed _as_ the input.
    - If you do supply an input for a seed, we will use that input instead.
- Use “empty” inputs by setting rows to an empty list `rows: []`

<File name='models/schema.yml'>
```yml
unit_tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: dim_customers # name of the model I'm unit testing
    given: # the mock data for your inputs
      - input: ref('stg_customers')
        rows:
         - {email: cool@example.com,     email_top_level_domain: example.com}
         - {email: cool@unknown.com,     email_top_level_domain: unknown.com}
         - {email: badgmail.com,         email_top_level_domain: gmail.com}
         - {email: missingdot@gmailcom,  email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        rows:
         - {tld: example.com}
         - {tld: gmail.com}
...

```
</File>
