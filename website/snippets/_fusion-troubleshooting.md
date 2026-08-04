If you run into any issues, check out the troubleshooting section below.

<Expandable alt_header="How to create a .dbt directory in root and move dbt_cloud.yml file">

import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

<DbtDirectoryFaq />

</Expandable>

<Expandable alt_header="I can't see the lineage tab in Cursor">

If you're using the dbt VS Code extension in Cursor, the lineage tab works best in Editor mode and doesn't render in Agent mode. If you're in Agent mode and the lineage tab isn't rendering, just switch to Editor mode to view your project's table and column lineage.
</Expandable>

<Expandable alt_header="The extension gets stuck in a loading state">

If the extension is attempting to activate during startup and locks into a permanent loading state, check that:
- Your dbt VS Code extension is on the latest version.
- Your IDE is on the latest version.
- You have a valid `dbt_cloud.yml` file configured and in the [correct location](#register-with-dbt_cloudyml).

If you're still experiencing issues, try these steps before contacting dbt Support:
- Delete and download a new copy of your `dbt_cloud.yml` file.
- Delete and reinstall the dbt VS Code extension.


</Expandable>

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
If necessary, you can also install the <Constant name="fusion_engine" /> directly using these instructions: [Install the <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2)

</Expandable>

<Expandable alt_header="dbt Fusion binary not found at the configured path">

If the extension reports that the <Constant name="fusion_engine" /> binary can't be found at the configured path (for example, `dbt-fusion binary not found at [path]`), the `dbt.fusionPath` setting is pointing to a location that doesn't contain a valid binary.

- Verify that [`dbt.fusionPath`](/docs/configure-dbt-extension#dbt-extension-settings) points to a valid <Constant name="fusion" /> binary.
- If you haven't installed <Constant name="fusion" /> manually, clear the setting and let the extension download and manage it for you.
- To install manually, follow [Install the <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2).
</Expandable>

<Expandable alt_header="dbt Fusion version is not compatible with this extension">

If the extension reports that the installed <Constant name="fusion" /> version isn't compatible with your dbt VS Code extension version, the two are outside the supported range.

1. Run `dbt --version` to check your installed <Constant name="fusion" /> version.
2. Compare it against the [version compatibility matrix](/docs/dbt-versions/fusion-version-compatibility#compatibility-matrix) for your extension version.
3. Update <Constant name="fusion" /> or the extension so both fall within the supported range. Use the **Download compatible version** action in the notification if it appears.

</Expandable>

<Expandable alt_header="dbt Fusion crashes on startup">

If the extension reports that <Constant name="fusion" /> crashed on startup, confirm the binary runs on its own:

1. Run `dbt --version` in your terminal. If this fails, reinstall <Constant name="fusion" /> using [Install the <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2).
2. Use the **Show Logs** action in the notification (or open the **Output** tab) to review the startup error.
</Expandable>

<Expandable alt_header="A known-bad dbt Fusion version is installed">

If the extension warns that your installed <Constant name="fusion" /> version has a known regression, dbt Labs has flagged that release as [known-bad](/docs/dbt-versions/fusion-version-compatibility#known-bad-releases). Update to the version named in the notification.

For standalone installations:
```shell
dbt system update
```

The warning persists across restarts until you update. If you work in an air-gapped environment, refer to [known-bad releases](/docs/dbt-versions/fusion-version-compatibility#known-bad-releases) for how to distribute the manifest locally.

</Expandable>

<Expandable alt_header="Addressing the 'dbt language server is not running in this workspace' error">

To resolve the `dbt language server is not running in this workspace` error, you need to add your dbt project folder to a workspace: 

1. In VS Code, click **File** in the toolbar then select **Add Folder to Workspace**.
2. Select the dbt project file you want to add to a workspace.
3. To save your workspace, click **File** then select **Save Workspace As**.  
4. Navigate to the location you want to save your workspace.

This should resolve the error and open your dbt project by opening the workspace it belongs to. For more information on workspaces, refer to [What is a VS Code workspace?](https://code.visualstudio.com/docs/editing/workspaces/workspaces).
</Expandable>

<Expandable alt_header="Manifest cannot be downloaded from the dbt platform">

If the dbt VS Code extension cannot download the manifest from the <Constant name="dbt_platform" /> or you get `warning: dbt1200: Failed to download manifest` using <Constant name="fusion" /> locally, you are probably having DNS-related issues.

To confirm this, do a DNS lookup for the host <Constant name="fusion" /> is trying to download from (for example, prodeu2.blob.core.windows.net) by using `dig` on Linux/Mac or `nslookup` on Windows.

If this doesn't return an IP address, the likely reason is that your company uses the same cloud provider with private endpoints for cloud resources, and DNS requests for these are forwarded to private DNS zones.

This situation can be remedied by setting up an internet fallback, which will then return a public IP to any cloud storage that does not have a private IP registered with the private DNS zone.

For Azure refer to [Fallback to internet for Azure Private DNS zones](https://learn.microsoft.com/en-us/azure/dns/private-dns-fallback).
</Expandable>
