<VersionBlock lastVersion="1.99">

:::tip Upgrade for automatic updates
Upgrade to [v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) to run <Constant name="wizard"/> as `wizard` and get automatic updates.
:::

</VersionBlock>

<Steps>

<Step title="Install the dbt Wizard CLI">

Run the install script for your operating system:

macOS/Linux:

```bash
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

Windows (PowerShell):

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

This installs <Constant name="wizard"/> to `/usr/local/bin/wizard`, along with the [dbt Information Schema](/docs/build/dbt-information-schema) that powers <Constant name="wizard"/>'s project-aware answers.

</Step>

<Step title="Start a session">

Verify the install and start an interactive session:

```bash
wizard --version   # confirm the install
wizard             # start a session
```

</Step>

</Steps>

For first-run setup and billing, refer to [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart).
