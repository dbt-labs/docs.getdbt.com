### Build it with AI using dbt Wizard

Prefer not to write the SQL by hand? The [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) can build the same model for you from your terminal, grounded in your project's actual schema and lineage. Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.

1. Install the <Constant name="wizard" /> CLI:

<Tabs groupId="operating-systems" queryString>

<TabItem value="macos" label="macOS/Linux">

```shell
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

</TabItem>

<TabItem value="windows" label="Windows (PowerShell)">

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

</TabItem>

</Tabs>

2. Run `wizard` in your project directory to start a session.

<Lightbox src="/img/docs/wizard-cli-intro.png" title="A dbt Wizard session running in the terminal" />

3. Prompt it: "Create a customers model that joins orders and customers, and includes each customer's most recent order date and total number of orders."
4. Review the SQL <Constant name="wizard" /> generates, then accept it to save the model.
5. Enter `dbt run` to build it.

Either way, you end up with the same working model. For full setup details, refer to [Use dbt Wizard locally](/docs/dbt-ai/wizard-quickstart).
