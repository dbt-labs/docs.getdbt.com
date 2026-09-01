<Expandable alt_header="Availability and considerations">

- **Where it runs:** Supported in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) only, all [deployment types](/docs/platform/about-platform/tenancy?version=2.0). Not supported in VS Code or the <Constant name="platform_cli" />.
- **Engines:** Works with <Constant name="fusion_engine" /> and <Constant name="core" />.
- **Conversations:** In the conversation list, open **More actions** menu (three dots) of the conversation you want to delete, then click **Delete** to remove one thread. Deleting the open thread clears the panel.
- **Sessions:** Refreshing the same browser tab keeps your active session. A new tab, or returning after closing the tab, starts empty. 
- **Chat history:** Retained for 90 days only. Chat history isn't supported yet on single-tenant deployments, so save anything important before closing.
- **Plan mode:** Not supported yet. The agent doesn't show a separate plan before applying changes, however you can use the **Ask for approval** mode to approve each file.
- **New chat:** Click **Start new dbt Wizard chat** (top right of the dbt Wizard panel) to begin a new session.
</Expandable>

### Using dbt Wizard

Use the <Constant name="wizard" /> panel to generate resources with quick actions, or use the agent to build and refactor models end-to-end with natural language prompts.

To use the <Constant name="wizard" />, follow these steps:

1. Open your dbt project in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), then click **<Constant name="wizard" />** in the command palette.
2. Start a prompt in several ways in the [<Constant name="wizard" /> panel](/docs/dbt-ai/wizard-ide):
   - **Quick actions**: Use [quick-action resource generation](/docs/dbt-ai/wizard-ide#quick-action-resource-generation) at the top of the panel for quick action prompts.
   - **Plain text**: Type directly into the text field to describe what you want to build or change.
   - **Model context**: Type `@` to select a model as context. This scopes the agent's changes to that resource.
3. Select the [**Agent mode** button](/docs/dbt-ai/wizard-ide) to specify the mode for the <Constant name="wizard" />. Available modes are **Ask for approval** (default) and **Edit files automatically**.
4. Select the dbt <Term id="managed" /> model you'd like to work with from the [model picker](/docs/dbt-ai/pricing-billing/overview#choose-a-model) next to the **Agent mode** button.
5. [Review the agent's suggestions](/docs/dbt-ai/wizard-ide) and approve or reject the changes. You can also use the **Start new dbt Wizard chat** button to start a new chat session.
6. [Approve dbt commands](/docs/dbt-ai/wizard-ide) when the <Constant name="wizard" /> requests to run commands like `dbt compile` or `dbt build`.
7. Repeat the process to build or change more models.
8. Commit the changes to your dbt project and open a pull request.

The following images show how <Constant name="wizard"/> displays its work and outcome:

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-lineage.png" width="85%" title="dbt Wizard refactoring a model and displaying the lineage inside the chat interface."/>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-diff.png" width="85%" title="Wizard final refactor result displayed as a diff"/>

</DocCarousel>

For more details on the <Constant name="wizard" /> and how it works, expand the following sections to open additional information.

<Expandable alt_header="Panel controls">

The <Constant name="wizard" /> panel contains:

1. **Quick actions** (center): Buttons at the top of the panel for quick action prompts. When selected, the text field is pre-filled with a prompt.
2. **Agent mode button** (bottom left): Switch between **Ask for approval** and **Edit files automatically** mode. Click the button to change modes.
3. **Model picker** (bottom left): Select the dbt <Term id="managed" /> model to use for the session. Refer to [Choose a model](#choose-a-model) for the available models.
4. **dbt model context** (bottom left): Shows the currently open file. Use `@` in the text field to reference a different dbt model. Click **x** to remove the dbt model context.
5. **Text input field** (bottom left): Type your prompt in the text field to describe what you want to build or change. Type `@` to select a dbt model as context. This scopes the agent's changes to that resource.
6. **Start new dbt Wizard chat** (top right): Starts a new chat session.
7. **Stop** or **Enter** (bottom right): Press **Enter** to submit your prompt. Press **Stop** to stop the current session and agent processing. You cannot undo this action. 

<Lightbox src="/img/docs/dbt-platform/wizard-panel.png" width="95%" title="The Wizard panel in the Studio IDE showing quick-action buttons, the agent mode button, the model picker, and the text input field." />

<Constant name="wizard"/> also has a simplified wayfinder bar above the text input field. The wayfinder bar shows your current project and branch and guides you through Git tasks, such as committing files or creating a branch.

</Expandable>

<Expandable alt_header="Agent modes">

The <Constant name="wizard" /> operates in three modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Ask for approval** (default) | The agent drafts edits to files. You approve each file change before it is persisted. Best when you want tight control over what gets saved to your branch. |
| **Edit files automatically** | The agent drafts and automatically saves file edits without per-file approval. Best for faster iteration when you're confident in the prompt. |
</SimpleTable>

You can switch between modes at any time by clicking the **Agent mode** button in the <Constant name="wizard" /> panel. 

</Expandable>

<Expandable alt_header="Reviewing agent suggestions">

When the <Constant name="wizard" /> proposes code changes, you can review them before they are saved to your project:

- **View the diff**: The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators**: Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor**: Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.


</Expandable>

<Expandable alt_header="Granting command permissions">

To validate or run models during a session, the agent may request to run dbt commands such as `dbt compile` or `dbt build`. You'll be prompted to approve each request before it executes. For example, the agent might request to run:

```bash
dbt compile --select model_name
```

You can select one of the following options:

<SimpleTable>

| Option | Behavior |
|--------|----------|
| **Yes, run once** | Grants permission to run this specific command one time. |
| **Yes, and allow `dbt_command_name` for the session** | Grants permission to run dbt commands for the remainder of your session without prompting again. |
| **No** | Denies the request. The agent will not run the command. |

</SimpleTable>

After you run a command, <Constant name="wizard" /> adds an icon and a tooltip to the <Constant name="studio_ide" /> [**Commands** tab](/docs/platform/studio-ide/ide-user-interface#console-section) results. This helps you distinguish agent-run commands from manually run commands in the run results and logs. 

</Expandable>

### Bringing your own skills

You can extend <Constant name="wizard" /> with custom skills to encode your team's SQL conventions, naming rules, and modeling workflows — so you don't repeat them in every prompt. See [Skills](/docs/dbt-ai/wizard-platform-skills) for the full reference, including how to create, structure, and invoke skills.

### Debug job failures

The <Constant name="wizard" /> can investigate and troubleshoot dbt job and run failures directly from the <Constant name="studio_ide" />. This capability is powered by the `troubleshooting-dbt-job-errors` [dbt Agent Skill](https://github.com/dbt-labs/dbt-agent-skills), which comes pre-configured with the agent — no setup required.

You can ask the agent questions and issue commands like:

- "What jobs have failed recently?"
- "What is the root cause of the job failure?"
- "How can I fix the recent job failure?"
- "Fix the job failure."

The agent notes when your local project state may differ from the job — for example, if you're on a different branch or have uncommitted changes — so you have full context before acting on any suggested fixes.

### Timeout handling

When a dbt command run by <Constant name="wizard" /> runs for more than 5 minutes, the agent automatically attempts to stop the command on the server before returning control to you.

Instead of hanging or showing a generic error, the agent returns a clear message that explains the command timed out and was aborted. The message also tells you whether the cancellation request succeeded. If cancellation fails, it's possible the command may still be running on the server.

You can then choose whether to retry the command, narrow the request, or take another action.

### Fusion migration workflow {#fusion-migration-workflow}

import FusionMigrationWorkflow from '/snippets/_fusion-migration-workflow.md';

<FusionMigrationWorkflow />

For more on how to prepare your project for <Constant name="fusion" /> and what to do when you hit compatibility errors, see the [dbt v2 readiness checklist](/docs/dbt/dbt-readiness) and the [Upgrade to Fusion guides](/guides/prepare-dbt-upgrade).

### Writing effective prompts

Good prompts include the _scope_ (which models or area of the project), the _intent_ (the transformation or business logic you want), and any _constraints_ (naming conventions, materialization, tests). Here are a few examples:

<SimpleTable>

| Task | Example prompt |
|------|---------------|
| Build a new model | "Create a model called `fct_daily_revenue` that joins `stg_orders` and `stg_payments`, aggregates revenue by day, and materializes as a table." |
| Refactor an existing model | "Refactor `fct_orders` to use incremental materialization. Keep existing tests and follow our naming conventions." |
| Generate tests and docs | "Add `not_null` and `unique` tests to the primary key of `dim_customers`, and generate documentation for all columns." |

</SimpleTable>

For detailed guidance, patterns, and more examples across SQL, documentation, tests, and semantic models, see the [Prompt cookbook](/guides/prompt-cookbook).
