---
title: "Print output"
id: "print-output"
sidebar: "Print output"
---

### Suppress `print()` messages in stdout

<VersionBlock lastVersion="1.4">

By default, dbt includes `print()` messages in standard out (stdout). You can use the `NO_PRINT` config to prevent these messages from showing up in stdout.

<File name='profiles.yml'>

```yaml
config:
  no_print: true
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.5">

By default, dbt includes `print()` messages in standard out (stdout). You can use the `PRINT` config to prevent these messages from showing up in stdout.

<File name='profiles.yml'>

```yaml
config:
  print: false
```

</File>

:::warning Syntax deprecation

The original `NO_PRINT` syntax has been deprecated, starting with dbt v1.5. Backward compatibility is supported but will be removed in an as-of-yet-undetermined future release.

:::

</VersionBlock>

Supply `--no-print` flag to `dbt run` to suppress `print()` messages from showing in stdout.

```text
dbt --no-print run
...

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

```text
dbt --use-colors run
dbt --no-use-colors run
```
<VersionBlock firstVersion="1.5">

You can set the color preferences for the file logs only using the `--use-colors-file / --no-use-colors-file` flags.

```text
dbt --use-colors-file run
dbt --no-use-colors-file run
```

</VersionBlock>

</File>