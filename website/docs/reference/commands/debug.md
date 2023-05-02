---
title: "debug"
id: "debug"
---

`dbt debug` is a utility function to test the database connection and show information for debugging purposes. Not to be confused with the `--debug` option which increases verbosity.

The `--config-dir` option to `dbt debug` will show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```
