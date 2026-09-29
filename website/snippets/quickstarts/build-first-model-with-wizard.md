### Build it with AI using dbt Wizard

Prefer not to write the SQL by hand? <Constant name="wizard" /> can build the same model for you, right in the <Constant name="studio_ide" />, grounded in your project's actual schema and lineage.

1. Open <Constant name="wizard" /> from the <Constant name="studio_ide" />.

<Lightbox src="/img/docs/dbt-platform/wizard-panel.png" width="95%" title="The dbt Wizard panel in the Studio IDE" />

2. Prompt it: "Create a customers model that joins orders and customers, and includes each customer's most recent order date and total number of orders."
3. Review the SQL <Constant name="wizard" /> generates, then accept it to save the model.
4. Enter `dbt run` to build it.

Either way, you end up with the same working model. Learn more about [dbt Wizard in the dbt platform](/docs/dbt-ai/wizard-ide).
