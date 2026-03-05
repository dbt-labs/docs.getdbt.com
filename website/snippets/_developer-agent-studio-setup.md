To use the <Constant name="dev_agent" />, follow these steps:
1. Open your dbt project in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), then click **<Constant name="copilot" />** in the command palette. 
2. Start a prompt in several ways in the [<Constant name="copilot" /> panel](/docs/dbt-ai/developer-agent#panel-controls):
   - **Quick-action buttons** &mdash; The buttons at the top of the panel (**Generate documentation**, **Semantic model**, **Generate generic tests**, **Metrics**) pre-fill prompts for common tasks.
   - **Plain text** &mdash; Type directly into the text field to describe what you want to build or change.
   - **Slash commands** &mdash; Type `/` to browse available commands.
   - **Model context** &mdash; Type `@` to select a model as context. This scopes the agent's changes to that resource.
3. Select the [**Agent mode** button](/docs/dbt-ai/developer-agent#agent-modes) to specify the mode for the <Constant name="dev_agent" />. Available modes are **Ask** and **Code**.
4. [Review the agent's suggestions](/docs/dbt-ai/developer-agent#reviewing-agent-suggestions) and approve or reject the changes. You can also use the **Start over** button to reset the current session.
5. [Approve and run commands](/docs/dbt-ai/developer-agent#granting-command-permissions) using the `invoke_dbt` command prompted by the <Constant name="dev_agent" />.
6. Repeat the process to build or change more models.
7. Commit the changes to your dbt project and open a pull request.
