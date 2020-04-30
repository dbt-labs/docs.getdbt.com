#### tags

<Changelog> Added in v0.16.0 </Changelog>

The `tags` field can be used to set tags for a column, or to set tags on a specific test. Example:

```yml
models:
  - name: users
    columns:
      - name: email
        # Add a "pii" tag to this column, and all associated tests
        tags:
          - pii
        tests:
          - unique

      - name: account_id
        tests:
          - relationships:
              to: ref("accounts")
              field: id
              # Add a "foreign-key" tag to this test
              tags:
                - foreign-key
```

Tests on column tags can be run using the `tag:` selector:

```
$ dbt test --models tag:pii
```
