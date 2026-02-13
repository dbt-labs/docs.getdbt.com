The Developer agent is integrated into [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) and helps you generate or refactor dbt models from natural language prompts, with plans you can review and approve before execution. It uses dbt metadata and lineage for context, validates changes using [compare changes](/docs/deploy/advanced-ci#compare-changes), and can generate semantic models from existing models. All agent actions are auditable.

:::info Availability
The Developer agent is only available in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) (not in VS Code or the <Constant name="cloud_cli" />). It works with all dbt engines (<Constant name="fusion" /> or <Constant name="core" />). <Lifecycle status="beta" />
:::

### Prerequisites

- A [<Constant name="cloud" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/cloud/manage-access/seats-and-users).
- A [development environment](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="cloud_ide" />.
- Enable beta features: **Account settings** > **Personal profile** > **Experimental features**. See [Preview new dbt platform features](/docs/dbt-versions/experimental-features).
- Enterprise-tier plan for dbt Agents. Contact your account manager for access.

### Activate the Developer agent in dbt Studio

1. Open the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) and open your dbt project.
2. [Enable experimental features](/docs/dbt-versions/experimental-features) if you haven’t already.
3. <!-- TODO: Add exact UI location when available (e.g. sidebar, command palette) --> Open the Developer agent from the Studio interface.
4. Click on the <Constant name="copilot" /> icon in the editor toolbar to open the Agent panel.
5. Start by describing what you want to build or change; the agent will create a plan for you to review before any changes are applied.

For end-to-end workflows, see [Developer agent](/docs/dbt-ai/developer-agent).
