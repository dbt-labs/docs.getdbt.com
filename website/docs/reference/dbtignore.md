:::info New in v1.3
Added with the introduction of Python models to allow ignoring non-model `.py` files from being parsed by dbt.
:::

You can create a `.dbtignore` file in the root of your [dbt project](projects) to specify files that dbt should ignored by dbt. The file behaves like a [`.gitignore` file, using the same syntax](https://git-scm.com/docs/gitignore).

For instance:

```md
# .dbtignore

# ignore individual .py files
not-a-dbt-model.py
another-non-dbt-model.py

# ignore all .py files
**.py

# ignore all .py files with "codegen" in the filename
*codegen*.py
```
