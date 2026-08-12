To use the <Constant name="wizard" />, follow these steps:
1. Open your dbt project in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), then click **<Constant name="wizard" />** in the command palette. 
2. Start a prompt in several ways in the [<Constant name="wizard" /> panel](/docs/dbt-ai/wizard-ide):
   - **Quick actions**: Use [quick-action resource generation](/docs/dbt-ai/wizard-ide#quick-action-resource-generation) at the top of the panel to generate documentation, tests, semantic models, and metrics.
   - **Plain text**: Type directly into the text field to describe what you want to build or change.
   - **Model context**: Type `@` to select a model as context. This scopes the agent's changes to that resource.
3. Select the [**Agent mode** button](/docs/dbt-ai/wizard-ide) to specify the mode for the <Constant name="wizard" />. Available modes are **Ask for approval** (default) and **Edit files automatically**.
4. [Review the agent's suggestions](/docs/dbt-ai/wizard-ide) and approve or reject the changes. You can also use the **Start new dbt Wizard chat** button to start a new chat session.
5. [Approve dbt commands](/docs/dbt-ai/wizard-ide) when the <Constant name="wizard" /> requests to run commands like `dbt compile` or `dbt build`.
6. Repeat the process to build or change more models.
7. Commit the changes to your dbt project and open a pull request.
