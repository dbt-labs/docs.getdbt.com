#### Or, build it with dbt Wizard

Prefer not to write the SQL by hand? The [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) can build the same model for you from your terminal, grounded in your project's actual schema and lineage.

1. Install and run <Constant name="wizard" /> from your terminal — see [Use dbt Wizard locally](/docs/dbt-ai/wizard-quickstart).
2. Prompt it: "Create a customers model that joins orders and customers, and includes each customer's most recent order date and total number of orders."
3. Review the SQL <Constant name="wizard" /> generates, then accept it to save the model.
4. Enter `dbt run` to build it.

Either way, you end up with the same working model.
