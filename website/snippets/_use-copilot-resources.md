
import CopilotLimitation from '/snippets/_copilot-limitation.md';

Generate documentation, tests, metrics, and semantic models [resources](/docs/build/projects) with the click-of-a-button in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) using dbt Copilot, saving you time. To access and use this AI feature:

1. Navigate to the <Constant name="studio_ide" /> and select a SQL model file under the **File Explorer**.
2. In the **Console** section (under the **File Editor**), click the dbt Copilot button and choose what you want to generate, such as documentation, tests, metrics, SQL, or semantic models. To generate multiple YAML configs for the same model, select each option separately. dbt Copilot saves them to the same YAML file.

   <CopilotLimitation />

   - To generate metrics, you need to first have semantic models defined. 
   - Once defined, click **dbt Copilot** and select **Generate metrics**.
   - Write a prompt describing the metrics you want to generate and press enter.
   - **Accept** or **Reject** the generated code.
3. Verify the AI-generated code. You can update or fix the code as needed.
4. Click **Save As**. You should see the file changes under the **Version control** section.
