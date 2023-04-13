---
title: "IDE glossary"
id: ide-glossary
description: "Develop, test, run, and build in the Cloud IDE. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: IDE glossary
tags: [IDE]
---

The [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) is an interface tool for developers to effortlessly build, test, run, and version-control their dbt projects - all from the convenience of your browser. Use the Cloud IDE to compile dbt code into SQL and run it against your database directly -- no command line required!

## Basic layout

The IDE is designed to streamline your workflow, and features a popular user interface and layout with all files and folders on the left, editor on the right, and command and console information at the bottom. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-basic-layout.jpg" width="100%" title="The Cloud IDE layout includes version control on the upper left, files/folders on the left, editor on the right and command/console at the bottom"/>

The basic layout of the IDE landing page with the following areas:

- **Git repository link &mdash;** Clicking the Git repository link, located on the upper left of the IDE, takes you to your repository on the same active branch. This feature is only available for GitHub or GitLab repositories on multi-tenant dbt Cloud accounts.

- **Documentation site button &mdash;** Clicking the Documentation site book icon, located next to the Git repository link, leads to the dbt Documentation site. The site is powered by the latest dbt artifacts generated in the IDE using the `dbt docs generate` command from the Command bar.

- **Version Control menu &mdash;** The IDE's Version Control menu contains all git-related elements. The Git actions Button will update with relevant actions based on your editor's state, such as prompting to pull remote changes, commit and sync when reverted commit changes are present, or creating a merge/pull request when appropriate. The dropdown menu on the Git actions Button allows users to revert changes, refresh git state, create merge/pull requests, and change branches. For more info, refer to [Version control basics](/docs/collaborate/git/version-control-basics#the-git-button-in-the-cloud-ide) for more info. 

Below the Git Actions Button, the **Changes** section lists all file changes since the last commit. Clicking on a change opens the Git Diff View to see the inline changes.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-upper-left.jpg" width="40%" title="The Git repo link, documentation site button, and Version Control menu"/>

- **File Explorer &mdash;** The File Explorer shows the filetree of your repository. You can:
  - Click on any file in the filetree to open the file in the File Editor. 
  - Click and drag files between directories to move files. 
  - Right click a file to access the sub-menu options like copy file name, copy as `ref`, rename, delete.
  - **Note**: To perform these actions, the user must not be in `read-only` mode, which generally happens when the user is viewing the default branch.
  - See when changes or actions were made to files using file state indicators. The indicators appear to the right of your file or folder name and indicate the actions performed:
    * Unsaved (•) — The IDE detects unsaved changes to your file/folder
    * Modification (M) — The IDE detects a modification of existing files/folders
    * Added (A) — The IDE detects added files
    * Deleted (D) — The IDE detects deleted files.


<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-explorer-menu.jpg" width="30%" title="Manage files, right click to access menu options, and see changes made"/>

- **Command bar &mdash;**  The Command bar, located in the lower left of the IDE, is used to invoke [dbt commands](/reference/dbt-commands). When a command is invoked, the associated logs are shown in the Invocation History Drawer.

- **IDE Status button &mdash;** The IDE Status button, located on the lower right of the IDE, displays the current IDE status. If there is an error in the status or in the dbt code that stops the project from parsing, the button will turn red and display "Error". If there aren't any errors, the button will display a green "Ready" status. To access the [IDE Status Modal](#IDE-Status-Modal), simply click on this button.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-cmd-status.jpg" width="100%" title="Use the command bar to write dbt commands and the status button for the current IDE status"/>


## Editing features

The IDE features some delightful tools and layouts to make it easier for you to write dbt code and collaborate with teammates. 

- **File Editor &mdash;** The File Editor is where users edit code. Tabs break out the region for each opened file, and unsaved files are marked with a blue dot icon in the tab view.

- **Format button &mdash;** The editor has a **Format** button for `{{ filetypes }}`files. When you click the button, the editor will use `sqlfmt` or `sqlfluff` for SQL files and `black` for Python files to reformat the contents of the file.

- **Save button &mdash;** The editor has a **Save** button that saves editable files. Pressing the button or using the Command-S or Control-S shortcut saves the file contents. Saving isn't needed to preview code results in the Console section, but it's necessary before changes appear in a dbt invocation. The File Editor tab shows a blue icon for unsaved changes.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editing.jpg" width="100%" title="Use the file editor, format, and save button during your development workflow"/>

## Console
The console section, located below the File editor, includes various console tabs and buttons to help you with tasks such as previewing, compiling, building, and viewing the DAG. Refer to the following sub-bullets for more details on the console tabs and buttons.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-console.jpg" width="100%" title="Use the file editor, format, and save button during your development workflow"/>

- **Preview console button &mdash;** When you click on the Preview Button, it runs the SQL in the active file editor regardless of whether you have saved it or not, and sends the results to the Results console tab. To prevent the IDE from returning too much data and causing browser problems, a limit of 500 is automatically added to queries executed via the Preview Button.

- **Compile console button &mdash;** The Compile Button compiles the SQL code from the active File Editor, irrespective of its save status, and outputs it to the Compiled Code console tab.

- **Build console button &mdash;** The build button allows users to quickly access dbt commands related to the active model in the File Editor. The available commands include dbt build, dbt test, and dbt run, with options to include only the current resource, the resource and its upstream dependencies, the resource and its downstream dependencies, or the resource with all dependencies. This menu is available for all executable nodes.

- **Results console tab &mdash;** The Results console tab displays the most recent Preview results in tabular format. 
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/results-console-tab.jpg" width="100%" title="Preview results show up in the Results console tab"/>

- **Compile console tab &mdash;** The Compile button triggers a compile invocation that generates compiled code, which is displayed in the Compiled Code Tab.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/compiled-code-console-tab.jpg" width="100%" title="Compile results show up in the Compiled code console tab"/>

- **Lineage console tab &mdash;** The Lineage console tab in the File Editor displays the active model's lineage. By default, it shows two degrees of lineage in both directions (`2+model_name+2`), but this selection syntax can be changed.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/lineage-console-tab.jpg" width="100%" title="View resource lineage in the Lineage console tab"/>

<!---Continue from here-->

### Additional editing features

#### Minimap
A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is displayed on the upper-right side of the editor. To quickly jump to different sections of your file, click the shaded area.

#### Editor Command palette
The Editor Command Palette displays text editing actions and their associated keyboard shortcuts. This can be accessed by pressing `F1` or right-clicking in the text editing area and selecting Command Palette.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editor-command-palette-with-save.jpg" width="100%" title="Click F1 to access the Editor Command Palette menu for editor shortcuts"/>

#### Editor tab menu
To interact with open editor tabs, right-click any tab to access the helpful options in the file tab menu.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/editor-tab-menu-with-save.jpg" width="100%" title="Right click a tab to view the Editor tab menu options"/>

#### Git Diff View
Clicking on a file in the **Changes** section of the **Version Control Menu** will open the changed file with Git Diff view. The editor will show the previous version on the left and the in-line changes made on the right.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-git-diff-view-with-save.jpg" width="100%" title="The Git Diff View displays the previous version on the left and the changes made on the right of the Editor"/>

#### Markdown Preview console tab
The Markdown Preview console tab shows a preview of your .md file's markdown code in your repository, and updates it automatically as you edit your code.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-markdown-with-save.jpg" width="100%" title="The Markdown Preview console tab renders markdown code below the Editor tab."/>

#### CSV Preview console tab
The CSV Preview console tab displays the data from your CSV file in a table, which updates automatically as you edit the file in your seed directory.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-csv.jpg" width="100%" title="View csv code in the CSV Preview console tab below the Editor tab."/>

## Invocation history
The Invocation History Drawer stores information on dbt invocations in the IDE. Open the drawer by clicking the `^` icon next to the Command Bar on the lower left of the page or by using a command.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/invocation-components-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

A &mdash; [Invocation History list](#invocation-history-list)<br />
B &mdash; [Invocation Summary](#invocation-summary)<br />
C &mdash; [System Logs toggle](#system-logs-toggle)<br />
D &mdash; [Result Status tabs](#result-status-tabs)<br />
E &mdash; [Node result](#node-result)<br />
F &mdash; [Command Control button](#command-control-button)<br />

### Invocation History list

The left-hand panel of the Invocation History Drawer displays a list of previous invocations in the IDE, including the command, branch name, command status, and elapsed time.

### Invocation Summary

The Invocation Summary displays information about a selected command from the Command History List, such as the command, its status (`Running` if it's still running), the git branch that was active during the command, and the time the command was invoked.

### System Logs toggle
The System Logs Toggle allows the user to see the full stdout and debug logs for entirety of the invoked command. 

### Result Status tabs
Clicking on the Results Status Tabs will filter the Node Status List based on their corresponding status. The available statuses are Pass (successful invocation of a node), Warn (test executed with warning), Error (database error or test failure), Skip (nodes not run due to upstream error), and Queued (nodes that have not executed yet).

### Node result
After running a dbt command, information about each executed node can be found in a Node Result toggle, which includes a summary and debug logs. The Node Results List lists every node that was invoked during the command.

### Node result list
The Node result list shows all the Node Results used in the dbt run, and you can filter it by clicking on a Result Status tab.

### Command Control button
Use the command control button to control your invocation and cancel or rerun a selected run.

## Modals and Menus

### File Search
You can easily search for and navigate between files using the File Navigation Menu, which can be accessed by pressing Command-O or Control-O or clicking on the 🔍 icon in the File Explorer.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-search-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### Global Command Palette
The Global Command Palette provides helpful shortcuts to interact with the IDE, such as git actions, specialized dbt commands, compile, and preview actions, among others. To open the menu, use Command-P or Control-P.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-global-command-palette-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### IDE Status modal

The IDE Status modal shows the current error message and debug logs for the server. This also contains an option to restart the IDE. Open this by clicking on the [IDE Status button](#ide-status-button)

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-status-modal-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### Commit Changes modal

The Commit Changes modal is accessible via the Git Actions button to commit all changes or via the Version Control Options menu to commit individual changes. Once you enter a commit message, you can use the modal to commit and sync the selected changes.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-changes-modal.png" width="100%" title="The Commit Changes modal is how users commit changes to their branch."/>

### Change Branch modal

The Change Branch modal allows users to switch git branches in the IDE. It can be accessed through the `Change Branch` link or the Git Actions Button in the Version Control Menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/change-branch-modal.png" width="100%" title="The Commit Changes modal is how users change their branch."/>

### Revert Uncommitted Changes modal

The Revert Uncommitted Changes modal is how users revert changes in the IDE. This is accessible via the `Revert File` option above the Version Control Options Menu, or via the Git Actions Button when there are saved, uncommitted changes in the IDE.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/revert-uncommitted-changes-with-save.jpg" width="100%" title="The Commit Changes modal is how users change their branch."/>

### IDE Options menu
The IDE Options menu can be accessed by clicking on the three-dot menu located at the bottom right corner of the IDE. This menu contains global options such as:
- Toggling between dark or light mode for a better viewing experience
- Restarting the IDE
- Fully recloning your repository to refresh your git state aviewing status details
- Viewing status details, including the [IDE Status Modal](#ide-status-modal)

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.jpg" width="85%" title="Click on the kebab menu to view the options menu"/>

### Version Control Options menu

To control the git state of individual changed files, right-click any file in the **Changes** section and use the file-specific options in the Version Control Options menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/version-control-options-menu.png" width="30%" title="Right click changed files to access sub-menu options"/>
