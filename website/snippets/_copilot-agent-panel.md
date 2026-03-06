To access the <Constant name="dev_agent" />, click **Copilot** in the <Constant name="cloud_ide" /> command palette. The Copilot panel is shared between inline Copilot features and the <Constant name="dev_agent" /> — the **Ask** or **Code** mode toggle at the bottom of the panel is what activates agent mode.

The quick-action buttons at the top of the panel (**Generate documentation**, **Semantic model**, **Generate generic tests**, **Metrics**) pre-fill prompts in the text field for common tasks. The text input field also accepts plain prompts. Type `@` to select a model as context — this scopes the agent's changes to that resource.

The toolbar below the text field contains:

- **Agent mode toggle** (bottom left) &mdash; Switch between **Ask** and **Code** mode. Click the dropdown arrow to change modes.
- **Active model** (bottom left, next to mode) &mdash; Shows the currently open file. This cannot be changed from here — use `@` in the text field to reference a different model. Click **x** to remove the model context.
- **Start over** (top right) &mdash; Resets the current session. A confirmation prompt will appear — click **Start over** to confirm, or **Cancel** to return to your current conversation. This action cannot be undone.
