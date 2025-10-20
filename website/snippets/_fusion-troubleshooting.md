If you run into any issues, check out the troubleshooting section below.

<Expandable  alt_header="dbt platform configurations">

If you're a cloud-based dbt platform user who has the `dbt-cloud:` config in the `dbt_project.yml` file and are also using dbt Mesh, you must have the project ID configured:
    ```yaml
    dbt-cloud:
    project-id: 12345 # Required
    ```
If you don’t configure this correctly, cross-platform references will not resolve properly, and you will encounter errors executing dbt commands.

</Expandable>

<Expandable alt_header="dbt extension not activating">

If the dbt extension has activated successfully, you will see the **dbt Extension** label in the status bar at the bottom left of your editor. You can view diagnostic information about the dbt extension by clicking the **dbt Extension** button.

If the **dbt Extension** label is not present, then it is likely that the dbt extension was not installed successfully. If this happens, try uninstalling the extension, restarting your editor, and then reinstalling the extension.

**Note:** It is possible to "hide" status bar items in VS Code. Double-check if the dbt Extension status bar label is hidden by right-clicking on the status bar in your editor. If you see dbt Extension in the right-click menu, then the extension has installed successfully.
</Expandable>

<Expandable alt_header="Missing dbt LSP features">

If you receive a `no active LSP for this workspace` error message or aren't seeing dbt Language Server (LSP) features in your editor (like autocomplete, go-to-definition, or hover text), start by first following the general troubleshooting steps mentioned earlier.

If you've confirmed the dbt extension is installed correctly but don't see LSP features, try the following:

1. Check extension version — Ensure that you're using the latest available version of the dbt extension by:
   - Opening the **Extensions** page in your editor, or
   - Going to the **Output** tab and looking for the version number, or
   - Running `dbtf --version` in the terminal.
2. Reinstall the LSP — If the version is correct, reinstall the LSP:
   1. Open the Command Palette: Command + Shift + P (macOS) or Ctrl + Shift + P (Windows/Linux).
   2. Paste `dbt: Reinstall dbt LSP` and enter.

This command downloads the LSP and re-activates the extension to resolve the error.

</Expandable>

<Expandable alt_header="Unsupported dbt version">

If you see an error message indicating that your version of dbt is unsupported, then there is likely a problem with your environment.

Check the dbt Path setting in your VS Code settings. If this path is set, ensure that it is pointing to a valid dbt Fusion Engine executable.
If necessary, you can also install the dbt Fusion Engine directly using these instructions: [Install the Fusion CLI](/docs/fusion/install-fusion-cli)
</Expandable>

<Expandable alt_header="Addressing the 'dbt language server is not running in this workspace' error">

To resolve the `dbt language server is not running in this workspace` error, you need to add your dbt project folder to a workspace: 

1. In VS Code, click **File** in the toolbar then select **Add Folder to Workspace**.
2. Select the dbt project file you want to add to a workspace.
3. To save your workspace, click **File** then select **Save Workspace As**.  
4. Navigate to the location you want to save your workspace.

This should resolve the error and open your dbt project by opening the workspace it belongs to. For more information on workspaces, refer to [What is a VS Code workspace?](https://code.visualstudio.com/docs/editing/workspaces/workspaces).
</Expandable>
