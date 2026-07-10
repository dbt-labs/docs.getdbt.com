

Install <Constant name="wizard"/> as `wizard` on your `PATH` using the curl script for your operating system:

<Tabs groupId="wizard-install-os">
<TabItem value="macos-linux" label="macOS/Linux" default>

```bash
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

</TabItem>
<TabItem value="windows" label="Windows">

Run the following in PowerShell:

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

</TabItem>
</Tabs>

Then verify the install and start a session:

```bash
wizard --version   # confirm the install
wizard             # start an interactive session
```

After running `wizard --version`, you should see something like `dbt-wizard VERSION`. Run `wizard --help` to see all available commands and flags. <Constant name="wizard" /> installs default config files &mdash; refer to the [config reference](/docs/dbt-ai/wizard-config) for more details.

<VersionBlock lastVersion="1.99">

:::tip Upgrade for automatic updates
Upgrade to [v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2) to run <Constant name="wizard"/> as `wizard` and get automatic updates.
:::

</VersionBlock>
