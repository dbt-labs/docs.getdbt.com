---
title: "IDE user interface"
id: ide-user-interface
description: "Develop, test, run, and build in the Cloud IDE. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: User interface
tags: [IDE]
---

The [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) is a tool for developers to effortlessly build, test, run, and version-control their dbt projects, and enhance data governance — all from the convenience of your browser. Use the Cloud IDE to compile dbt code into SQL and run it against your database directly -- no command line required!

This page offers comprehensive definitions and terminology of user interface elements, allowing you to navigate the IDE landscape with ease.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-basic-layout.jpg" width="100%" title="The Cloud IDE layout includes version control on the upper left, files/folders on the left, editor on the right an command/console at the bottom"/>

## Basic layout

The IDE streamlines your workflow, and features a popular user interface layout with files and folders on the left, editor on the right, and command and console information at the bottom. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-side-menu.jpg" width="30%" title="The Git repo link, documentation site button, Version Control menu, and File Explorer"/>

1. **Git repository link &mdash;** Clicking the Git repository link, located on the upper left of the IDE, takes you to your repository on the same active branch. 
    * **Note:** This feature is only available for GitHub or GitLab repositories on multi-tenant dbt Cloud accounts.

2. **Documentation site button &mdash;** Clicking the Documentation site book icon, located next to the Git repository link, leads to the dbt Documentation site. The site is powered by the latest dbt artifacts generated in the IDE using the `dbt docs generate` command from the Command bar.

3. [**Version Control**](#editing-features) &mdash; The IDE's powerful Version Control section contains all git-related elements, including the Git actions button and the **Changes** section. 

4. **File Explorer &mdash;** The File Explorer shows the filetree of your repository. You can:
    - Click on any file in the filetree to open the file in the File Editor. 
    - Click and drag files between directories to move files. 
    - Right-click a file to access the sub-menu options like duplicate file, copy file name, copy as `ref`, rename, delete.
    - **Note**: To perform these actions, the user must not be in `read-only` mode, which generally happens when the user is viewing the default branch.
    - Use file indicators, located to the right of your files or folder name, to see when changes or actions were made:
      * Unsaved (•) — The IDE detects unsaved changes to your file/folder
      * Modification (M) — The IDE detects a modification of existing files/folders
      * Added (A) — The IDE detects added files
      * Deleted (D) — The IDE detects deleted files.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-cmd-status.jpg" width="120%" title="Use the Command bar to write dbt commands and the status button for the current IDE status"/>

5. **Command bar &mdash;**  The Command bar, located in the lower left of the IDE, is used to invoke [dbt commands](/reference/dbt-commands). When a command is invoked, the associated logs are shown in the Invocation History Drawer.

6. **IDE Status button &mdash;** The IDE Status button, located on the lower right of the IDE, displays the current IDE status. If there is an error in the status or in the dbt code that stops the project from parsing, the button will turn red and display "Error". If there aren't any errors, the button will display a green "Ready" status. To access the [IDE Status modal](#modals-and-menus), simply click on this button.


## Editing features

The IDE features some delightful tools and layouts to make it easier for you to write dbt code and collaborate with teammates. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editing.jpg" width="100%" title="Use the file editor, version control section, and save button during your development workflow"/>

1. **File Editor &mdash;** The File Editor is where users edit code. Tabs break out the region for each opened file, and unsaved files are marked with a blue dot icon in the tab view. 

    * Use intuitive [keyboard shortcuts](/docs/cloud/dbt-cloud-ide/dbt-cloud-tips#cloud-ide-keyboard-shortcuts) to help develop easier for you and your team.

2. **Save button &mdash;** The editor has a **Save** button that saves editable files. Pressing the button or using the Command-S or Control-S shortcut saves the file contents. You don't need to save to preview code results in the Console section, but it's necessary before changes appear in a dbt invocation. The File Editor tab shows a blue icon for unsaved changes.

3. **Version Control &mdash;** This menu contains all git-related elements, including the Git actions button. The button updates relevant actions based on your editor's state, such as prompting to pull remote changes, commit and sync when reverted commit changes are present, or creating a merge/pull request when appropriate. The dropdown menu on the Git actions button allows users to revert changes, refresh git state, create merge/pull requests, and change branches. You can also [resolve merge conflicts](/docs/collaborate/git/merge-conflicts) and for more info on git, refer to [Version control basics](/docs/collaborate/git/version-control-basics#the-git-button-in-the-cloud-ide).

   - **Version Control Options menu &mdash;** Below the Git Actions button, the **Changes** section, which lists all file changes since the last commit. You can click on a change to open the Git Diff View to see the inline changes. You can also right-click any file and use the file-specific options in the Version Control Options menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/version-control-options-menu.png" width="30%" title=" Right-click edited files to access Version Control Options menu"/>

## Additional editing features

- **Minimap &mdash;** A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is displayed on the upper-right side of the editor. To quickly jump to different sections of your file, click the shaded area.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-minimap.jpg" width="100%" title="Use the Minimap for quick navigation and code understanding"/>

- **dbt Editor Command Palette &mdash;** The dbt Editor Command Palette displays text editing actions and their associated keyboard shortcuts. This can be accessed by pressing `F1` or right-clicking in the text editing area and selecting Command Palette.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editor-command-palette-with-save.jpg" width="100%" title="Click F1 to access the dbt Editor Command Palette menu for editor shortcuts"/>

- **Git Diff View &mdash;** Clicking on a file in the **Changes** section of the **Version Control Menu** will open the changed file with Git Diff view. The editor will show the previous version on the left and the in-line changes made on the right.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-git-diff-view-with-save.jpg" width="100%" title="The Git Diff View displays the previous version on the left and the changes made on the right of the Editor"/>

- **Markdown Preview console tab &mdash;** The Markdown Preview console tab shows a preview of your .md file's markdown code in your repository and updates it automatically as you edit your code.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-markdown-with-save.jpg" width="100%" title="The Markdown Preview console tab renders markdown code below the Editor tab."/>

- **CSV Preview console tab &mdash;** The CSV Preview console tab displays the data from your CSV file in a table, which updates automatically as you edit the file in your seed directory.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-csv.jpg" width="100%" title="View csv code in the CSV Preview console tab below the Editor tab."/>

## Console section

The console section, located below the File editor, includes various console tabs and buttons to help you with tasks such as previewing, compiling, building, and viewing the <Term id="dag" />. Refer to the following sub-bullets for more details on the console tabs and buttons.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-console-overview.jpg" width="100%" title="The Console section is located below the File editor and has various tabs and buttons to help execute tasks"/>

1. **Preview button &mdash;** When you click on the Preview button, it runs the SQL in the active file editor regardless of whether you have saved it or not and sends the results to the Results console tab. 
   * **500-row limit:** To prevent the IDE from returning too much data and causing browser problems, dbt automatically sets a 500-row limit when using the **Preview Button**. You can modify this by adding `limit your_number` at the end of your SQL statement. For example, `SELECT * FROM` table `limit 100` will return up to 100 rows. Remember that you must write the `limit your_number` explicitly and cannot derive it from a macro.
   * **Change row limit default:** In dbt version 1.6 or higher, you have the ability to change the default limit of 500 rows shown in the **Results** tab when you run a query. To adjust the setting you can click on **Change row display** next to the displayed rows. Keep in mind that you can't set it higher than 10,000 rows. If you refresh the page or close your development session, the default limit will go back to 500 rows.
   * **Specify records returned:** The IDE also supports `SELECT TOP #`, which specifies the number of records to return.

2. **Compile button &mdash;** The Compile button compiles the SQL code from the active File Editor, irrespective of its save status, and outputs it to the Compiled Code tab.

3. **Build button &mdash;** The build button allows users to quickly access dbt commands related to the active model in the File Editor. The available commands include dbt build, dbt test, and dbt run, with options to include only the current resource, the resource and its upstream dependencies, the resource, and its downstream dependencies, or the resource with all dependencies. This menu is available for all executable nodes.

3. **Format button &mdash;** The editor has a **Format** button that can reformat the contents of your files. For SQL files, it uses either `sqlfmt` or `sqlfluff`, and for Python files, it uses `black`.

5. **Results tab &mdash;** The Results console tab displays the most recent Preview results in tabular format. 
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/results-console-tab.jpg" width="100%" title="Preview results show up in the Results console tab"/>

6. **Compiled Code tab &mdash;** The Compile button triggers a compile invocation that generates compiled code, which is displayed in the Compiled Code tab.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/compiled-code-console-tab.jpg" width="100%" title="Compile results show up in the Compiled Code tab"/>

7. **Lineage tab &mdash;** The Lineage tab in the File Editor displays the active model's lineage or  <Term id="dag" />. By default, it shows two degrees of lineage in both directions (`2+model_name+2`), however, you can change it to +model+ (full DAG).
    - Double-click a node in the DAG to open that file in a new tab
    - Expand or shrink the DAG using node selection syntax.
    - Note, the `--exclude` flag isn't supported.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/lineage-console-tab.jpg" width="100%" title="View resource lineage in the Lineage tab"/>

## Invocation history

The Invocation History Drawer stores information on dbt invocations in the IDE. When you invoke a command, like executing a dbt command such as `dbt run`, the associated logs are displayed in the Invocation History Drawer. 

You can open the drawer in multiple ways: 
- Clicking the `^` icon next to the Command bar on the lower left of the page
- Typing a dbt command and pressing enter
- Or pressing Control-backtick (or Ctrl + `)

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-inv-history-drawer.jpg" width="100%" title="The Invocation History Drawer returns a log and detail of all your dbt Cloud invocations."/>

1. **Invocation History list &mdash;** The left-hand panel of the Invocation History Drawer displays a list of previous invocations in the IDE, including the command, branch name, command status, and elapsed time.

2. **Invocation Summary &mdash;** The Invocation Summary, located above **System Logs**, displays information about a selected command from the Invocation History list, such as the command, its status (`Running` if it's still running), the git branch that was active during the command, and the time the command was invoked.

3. **System Logs toggle &mdash;** The System Logs toggle, located under the Invocation Summary, allows the user to see the full stdout and debug logs for the entirety of the invoked command. 

4. **Command Control button &mdash;** Use the Command Control button, located on the right side, to control your invocation and cancel or rerun a selected run.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-results.jpg" width="100%" title="The Invocation History list displays a list of previous invocations in the IDE"/>

5. **Node Summary tab &mdash;** Clicking on the Results Status Tabs will filter the Node Status List based on their corresponding status. The available statuses are Pass (successful invocation of a node), Warn (test executed with a warning), Error (database error or test failure), Skip (nodes not run due to upstream error), and Queued (nodes that have not executed yet).

6. **Node result toggle &mdash;** After running a dbt command, information about each executed node can be found in a Node Result toggle, which includes a summary and debug logs. The Node Results List lists every node that was invoked during the command.

7. **Node result list &mdash;** The Node result list shows all the Node Results used in the dbt run, and you can filter it by clicking on a Result Status tab.


## Modals and Menus
Use menus and modals to interact with IDE and access useful options to help your development workflow. 

- **Editor tab menu &mdash;** To interact with open editor tabs, right-click any tab to access the helpful options in the file tab menu.<Lightbox src="/img/docs/dbt-cloud/cloud-ide/editor-tab-menu-with-save.jpg" width="100%" title=" Right-click a tab to view the Editor tab menu options"/>

- **File Search &mdash;** You can easily search for and navigate between files using the File Navigation menu, which can be accessed by pressing Command-O or Control-O or clicking on the 🔍 icon in the File Explorer.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-search-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

- **Global Command Palette&mdash;** The Global Command Palette provides helpful shortcuts to interact with the IDE, such as git actions, specialized dbt commands, and compile, and preview actions, among others. To open the menu, use Command-P or Control-P.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-global-command-palette-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

- **IDE Status modal &mdash;**  The IDE Status modal shows the current error message and debug logs for the server. This also contains an option to restart the IDE. Open this by clicking on the IDE Status button.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-status-modal-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

- **Commit Changes modal &mdash;** The Commit Changes modal is accessible via the Git Actions button to commit all changes or via the Version Control Options menu to commit individual changes. Once you enter a commit message, you can use the modal to commit and sync the selected changes.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-changes-modal.png" width="100%" title="The Commit Changes modal is how users commit changes to their branch."/>

- **Change Branch modal &mdash;** The Change Branch modal allows users to switch git branches in the IDE. It can be accessed through the `Change Branch` link or the Git Actions button in the Version Control menu.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/change-branch-modal.png" width="100%" title="The Commit Changes modal is how users change their branch."/>

- **Revert Uncommitted Changes modal &mdash;** The Revert Uncommitted Changes modal is how users revert changes in the IDE. This is accessible via the `Revert File` option above the Version Control Options menu, or via the Git Actions button when there are saved, uncommitted changes in the IDE.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/revert-uncommitted-changes-with-save.jpg" width="100%" title="The Commit Changes modal is how users change their branch."/>

- **IDE Options menu &mdash;** The IDE Options menu can be accessed by clicking on the three-dot menu located at the bottom right corner of the IDE. This menu contains global options such as:

  * Toggling between dark or light mode for a better viewing experience
  * Restarting the IDE
  * Fully recloning your repository to refresh your git state and view status details
  * Viewing status details, including the IDE Status modal.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.jpg" width="85%" title="Access the IDE Options menu to switch to dark or light mode, restart the IDE, reclone your repo, or view the IDE status"/>
