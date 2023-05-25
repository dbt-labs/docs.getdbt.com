---
title: .dbtignore
---

You can create a `.dbtignore` file in the root of your [dbt project](/docs/build/projects) to specify files that should be **entirely** ignored by dbt. The file behaves like a [`.gitignore` file, using the same syntax](https://git-scm.com/docs/gitignore). Files and subdirectories matching the pattern will not be read, parsed, or otherwise detected by dbt—as if they didn't exist.

**Examples**

<File name=".dbtignore">

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

</File>
