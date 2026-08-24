:::tip Compiled SQL for snapshots
Starting <Constant name="core" /> v1.12, you can inspect the SQL generated for this snapshot by running [`dbt compile`](/reference/commands/compile) or `dbt compile --select orders_snapshot`. 

Open the compiled SQL in `target/compiled/` to inspect or debug the generated queries. Each snapshot is compiled into its own SQL file, even if multiple snapshots are defined in the same source file.
:::
