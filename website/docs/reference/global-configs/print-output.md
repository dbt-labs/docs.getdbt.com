---
title: "Print output"
id: "print-output"
sidebar: "Print output"
---

### Suppress `print()` messages in stdout

By default, dbt includes [`print()`](/reference/dbt-jinja-functions/print) messages in standard out (stdout). You can use the `DBT_PRINT` environment variable to prevent these messages from showing up in stdout.

:::warning Syntax deprecation

The original `DBT_NO_PRINT` environment variable has been deprecated, starting with dbt v1.5. Backward compatibility is supported but will be removed in an as-of-yet-undetermined future release.

:::

Supply `--no-print` flag to `dbt run` to suppress `print()` messages from showing in stdout.

```text
dbt run --no-print
```

### Printer width

By default, dbt will print out lines padded to 80 characters wide. You can change this setting by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
```

</File>

### Print color

By default, dbt will colorize the output it prints in your terminal. You can turn this off by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  use_colors: False
```

</File>

```text
dbt run --use-colors
dbt run --no-use-colors
```

You can set the color preferences for the file logs only within `profiles.yml` or using the `--use-colors-file / --no-use-colors-file` flags.

<File name='profiles.yml'>

```yaml
config:
  use_colors_file: False
```

</File>

```text
dbt run --use-colors-file
dbt run --no-use-colors-file
```
