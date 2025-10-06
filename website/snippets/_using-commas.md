:::tip
You can combine multiple selector methods in one `--select` command by separating them with commas (`,`) without whitespace (for example, `dbt run --select "marts.finance,tag:nightly"`). This only selects resources that satisfy _all_ arguments. In this example, the command runs models that are in the `marts/finance` subdirectory and tagged `nightly`. For more information, see [Set operators](/reference/node-selection/set-operators).
:::
