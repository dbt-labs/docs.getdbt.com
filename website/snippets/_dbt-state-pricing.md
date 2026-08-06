### Daily active target tables

For purposes of pricing, daily active target tables (DATT) are measured as the number of distinct target tables (as defined below) for which dbt State performs at least one of the following unique operations on a given day (based on UTC time): a skip, clone, or test reuse.

A target table is a database object managed by your dbt project for a given database and schema name. It includes seeds, snapshots, dbt models (including incremental models). It also includes each distinct test (even if the tests are not built into the database because `store_failures` is disabled). For example, if `stg_customers` has `not_null` and `unique` tests on its `id` column, that's three target tables: the model and its two tests.

When you run `dbt build` or a similar command, a target table is selected for execution. It counts as an active target table if dbt State can reuse it based on your configuration rules. All reuses of the same active target table in a single day (based on UTC time) count as a single daily active target table (DATT).

### Monthly cost calculation

dbt State calculates cost per billing period using the unit price (USD $0.094) x sum of daily active target tables (DATT) for all account users and all days in that billing period. For example, if you have 100 DATT in a billing period, you'll be billed for 100 * $0.094 = $9.40.

For current unit price and more information, refer to the [dbt Labs Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table).

### DATT chart

You can view your DATT count in **Account settings** > **Billing & Usage** > **Usage-based features**. Under the **State** tab, the DATT chart shows DATTs split into **Billable** and **Free**. Trial accounts see their DATTs counted under **Free**.

### Cancellation

Usage is tracked through your cancellation date. You're billed at month end for usage incurred before cancellation and not charged for usage after.
