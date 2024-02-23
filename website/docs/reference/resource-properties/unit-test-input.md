---
title: "Input for unit tests"
sidebar_label: "Input"
---

Inputs in unit testing are used to reference a specific model or source for the test:

- `input:` string that represents a `ref` or `source` call:
    - `ref('my_model')` or `ref('my_model', v='2')` or `ref('dougs_project', 'users')`
    - `source('source_schema', 'source_name')`
- `input:` is optional for seeds:
    - If you don’t supply an input for a seed, we will use the seed _as_ the input.
    - If you do supply an input for a seed, we will use that input instead.
- You can also have “empty” inputs, by setting rows to an empty list `rows: []`