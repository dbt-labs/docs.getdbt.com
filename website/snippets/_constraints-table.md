
Select the adapter-specific tab for more information on [constraint](/reference/resource-properties/constraints) support across platforms. Constraints fall into three categories based on definability and platform enforcement:

- **Definable and enforced** &mdash; The model won't build if it violates the constraint.
- **Definable and not enforced** &mdash; The platform supports specifying the type of constraint, but a model can still build even if building the model violates the constraint. This constraint exists for metadata purposes only. This approach is more typical in cloud data warehouses than in transactional databases, where strict rule enforcement is more common.
- **Not definable and not enforced** &mdash; You can't specify the type of constraint for the platform.

<Tabs>

<TabItem value="Redshift" label="Redshift">

| Constraint type | Definable       | Enforced         |
|:----------------|:-------------:|:------------------:|
| not_null        | ✅ | ✅ |
| primary_key     | ✅ | ❌ |
| foreign_key     | ✅ | ❌ |
| unique          | ✅ | ❌ |
| check           | ❌ | ❌ |

</TabItem>
<TabItem value="Snowflake" label="Snowflake">

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:---------------------:|
| not_null        | ✅  | ✅ |
| primary_key     | ✅  | ❌ |
| foreign_key     | ✅  | ❌ |
| unique          | ✅  | ❌ |
| check           | ❌  | ❌ |

</TabItem>
<TabItem value="BigQuery" label="BigQuery">

| Constraint type | Definable     | Enforced |
|:-----------------|:-------------:|:---------------------:|
| not_null        | ✅ | ✅  |
| primary_key     | ✅ | ❌  |
| foreign_key     | ✅ | ❌  |
| unique          | ❌ | ❌  |
| check           | ❌ | ❌  |

</TabItem>
<TabItem value="Postgres" label="Postgres">

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:--------------------:|
| not_null        | ✅  |	✅  |
| primary_key     | ✅  |	✅  |
| foreign_key     | ✅  |	✅  |
| unique          | ✅  |	✅  |
| check           | ✅  |	✅  |

</TabItem>
<TabItem value="Spark" label="Spark">

Currently, `not_null` and `check` constraints are enforced only after a model is built. Because of this platform limitation, dbt considers these constraints definable but not enforced, which means they're not part of the _model contract_ since they can't be enforced at build time. This table will change as the features evolve.

| Constraint type | Definable    | Enforced |
|:----------------|:------------:|:---------------------:|
| not_null        |	✅  | ❌ |
| primary_key     |	✅  | ❌ |
| foreign_key     |	✅  | ❌ |
| unique          |	✅  | ❌ |
| check           |	✅  | ❌ |

</TabItem>
<TabItem value="Databricks" label="Databricks">

Currently, `not_null` and `check` constraints are enforced only after a model is built. Because of this platform limitation, dbt considers these constraints definable but not enforced, which means they're not part of the _model contract_ since they can't be enforced at build time. This table will change as the features evolve.

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:---------------------:|
| not_null        |	✅  | ✅ |
| primary_key     | ✅  | ❌ |
| foreign_key     |	✅  | ❌ |
| unique          |	❌  | ❌ |
| check           |	✅  | ✅ |

</TabItem>
<TabItem value="Athena" label="Athena">

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:---------------------:|
| not_null        |	❌  | ❌ |
| primary_key     | ❌  | ❌ |
| foreign_key     |	❌  | ❌ |
| unique          |	❌  | ❌ |
| check           |	❌  | ❌ |

</TabItem>
</Tabs>
