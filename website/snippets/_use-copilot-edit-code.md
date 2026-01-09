<Constant name="copilot" /> also allows you to generate SQL code directly within the SQL file in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), using natural language prompts. This means you can rewrite or add specific portions of the SQL file without needing to edit the entire file. 

This intelligent AI tool streamlines SQL development by reducing errors, scaling effortlessly with complexity, and saving valuable time. <Constant name="copilot" />'s [prompt window](#use-the-prompt-window), accessible by keyboard shortcut, handles repetitive or complex SQL generation effortlessly so you can focus on high-level tasks. 

Use Copilot's prompt window for use cases like:

- Writing advanced transformations
- Performing bulk edits efficiently
- Crafting complex patterns like regex

### Use the prompt window 

Access <Constant name="copilot" />'s AI prompt window using the keyboard shortcut Cmd+B (Mac) or Ctrl+B (Windows) to:

#### 1. Generate SQL from scratch
- Use the keyboard shortcuts Cmd+B (Mac) or Ctrl+B (Windows) to generate SQL from scratch.
- Enter your instructions to generate SQL code tailored to your needs using natural language.
- Ask <Constant name="copilot" /> to fix the code or add a specific portion of the SQL file.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/copilot-sql-generation-prompt.png" width="90%" title="dbt Copilot's prompt window accessible by keyboard shortcut Cmd+B (Mac) or Ctrl+B (Windows)" />

#### 2. Edit existing SQL code
- Highlight a section of SQL code and press Cmd+B (Mac) or Ctrl+B (Windows) to open the prompt window for editing.
- Use this to refine or modify specific code snippets based on your needs.
- Ask <Constant name="copilot" /> to fix the code or add a specific portion of the SQL file.

#### 3. Review changes with the diff view to quickly assess the impact of the changes before making changes
- When a suggestion is generated, <Constant name="copilot" /> displays a visual "diff" view to help you compare the proposed changes with your existing code:
  - **Green**: Means new code that will be added if you accept the suggestion.
  - **Red**: Highlights existing code that will be removed or replaced by the suggested changes.

#### 4. Accept or reject suggestions
- **Accept**: If the generated SQL meets your requirements, click the **Accept** button to apply the changes directly to your `.sql` file directly in the IDE.
- **Reject**: If the suggestion don’t align with your request/prompt, click **Reject** to discard the generated SQL without making changes and start again.

#### 5. Regenerate code
- To regenerate, press the **Escape** button on your keyboard (or click the Reject button in the popup). This will remove the generated code and puts your cursor back into the prompt text area. 
- Update your prompt and press **Enter** to try another generation. Press **Escape** again to close the popover entirely.

Once you've accepted a suggestion, you can continue to use the prompt window to generate additional SQL code and commit your changes to the branch.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/copilot-sql-generation.gif" width="100%" title="Edit existing SQL code using dbt Copilot's prompt window accessible by keyboard shortcut Cmd+B (Mac) or Ctrl+B (Windows)" />
