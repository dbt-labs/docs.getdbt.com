---
title: "IDE user interface"
id: ide-user-interface
description: "Develop, test, run, and build in the Studio IDE. With the Studio IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: User interface
tags: [IDE]
---

The [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) is a tool for developers to effortlessly build, test, run, and version-control their dbt projects, and enhance data governance — all from the convenience of your browser. Use the <Constant name="studio_ide" /> to compile dbt code into SQL and run it against your database directly — no command line required!

This page offers comprehensive definitions and terminology of user interface elements, allowing you to navigate the <Constant name="studio_ide" /> landscape with ease.

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-basic-layout.png" width="90%" title="The Studio IDE layout includes version control on the upper left, files/folders and search on the left, editor on the right, command palette at the top, and command/console at the bottom"/>

## Basic layout

The <Constant name="studio_ide" /> streamlines your workflow, and features a popular user interface layout with files and folders on the left, editor on the right, and command and console information at the bottom. 

#### The side menu

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-side-menu.png" width="30%" title="The Git repo link, documentation site button, Version Control menu, and File Explorer"/>

1. **<Constant name="git" /> repository link:** The <Constant name="git" /> repository link, located on the upper left of the <Constant name="studio_ide" />, takes you to your repository on the same active branch. It also displays the repository name and the active branch name.
    * **Note:** This linking feature is only available for GitHub or GitLab repositories on multi-tenant <Constant name="dbt" /> accounts.

2. **Documentation site button:** Clicking the Documentation site book icon, located next to the Git repository link, leads to the dbt Documentation site. The site is powered by the latest dbt artifacts generated in the IDE using the `dbt docs generate` command from the Command bar.

3. [**Version Control**](#editing-features): The <Constant name="studio_ide" />'s powerful Version Control section contains all git-related elements, including the <Constant name="git" /> actions button and the **Changes** section. 

4. **File explorer:** The File explorer shows the filetree of your repository. You can:
    - Click on any file in the filetree to open the file in the file editor. 
    - Click and drag files between directories to move files. 
    - Right-click a file to access the sub-menu options like duplicate file, copy file name, copy as `ref`, rename, delete.
    - Use file indicators, located to the right of your files or folder name, to see when changes or actions were made:
      * Unsaved (•) — The <Constant name="studio_ide" /> detects unsaved changes to your file/folder
      * Modification (M) — The <Constant name="studio_ide" /> detects a modification of existing files/folders
      * Added (A) — The <Constant name="studio_ide" /> detects added files
      * Deleted (D) — The <Constant name="studio_ide" /> detects deleted files.

#### The command and status bar

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-command-bar.png" width="100%" title="Use the Command bar to write dbt commands, toggle 'Defer', and view the current IDE status"/>

5. **Command bar:**  The Command bar, located in the lower left of the <Constant name="studio_ide" />, is used to invoke [dbt commands](/reference/dbt-commands). When a command is invoked, the associated logs are shown in the Invocation History Drawer.

6. **Defer menu:** The **Defer menu** allows developers to configure the deferral environment:
    - **Development environment:** Same as turning defer off. Build all upstream models using only the Development environment. Useful for testing in isolation.
    - **dbt default behavior:** Uses the Staging environment if it's configured, otherwise uses Production. Recommended configuration for most use cases.
    - **Custom environment:** Select the defer environment from any available in the project.

    <Lightbox src="/img/docs/dbt-platform/platform-ide/defer-menu.png" width="60%" title="Set the `defer` environment."/>

Refer to [Using defer in <Constant name="dbt" />](/docs/platform/about-defer#defer-in-the-dbt-ide) for more info.

7. **Status:** The <Constant name="studio_ide" /> Status button, located on the lower right of the <Constant name="studio_ide" />, displays the current connection statuses to both the warehouse and the dbt [language server (LSP)](/docs/about-dbt-lsp) status if you're on <Constant name="fusion" /> or the engine server status if you're on <Constant name="core" />. It includes shortcuts to environment settings and developer credentials.

    <Lightbox src="/img/docs/dbt-platform/platform-ide/server-status.png" width="60%" title="View the connection statuses for your account."/>

8. **dbt version:** The current version of dbt running in your development environment. You can set a **Personal version override** that changes the dbt version for only your development environment. 

     <Lightbox src="/img/docs/dbt-platform/platform-ide/dbt-version.png" width="60%" title="View and set the development environment version."/> 

9. **Additional tools:** Project status and an options menu with additional actions and information about the <Constant name="studio_ide" />:
    - **Project status:** If there are any errors or warnings outstanding in the development runs, the number of them will populate in this area. Clicking on them will take you to the **Problems** tab.
    - **Options menu:** Access the options menu by clicking the three-dot menu located at the bottom right corner of the <Constant name="studio_ide" />. This menu contains global options:
      - **View status details:** View more detailed information about your connection status.
      - **Restart Studio:** You will lose any unsaved information.
      - **Reinstall dependencies:** Overwrites project dependencies with a fresh installation.
      - **Clean dbt project:** Runs the [`dbt clean` command](/reference/commands/clean) for your project.
      - **Autofix deprecation warnings:** Runs the dbt [autofix tool](/docs/platform/studio-ide/autofix-deprecations). Helps prepare for <Constant name="fusion" /> upgrade. 
      
      <Lightbox src="/img/docs/dbt-platform/platform-ide/ide-menu.png" width="60%" title="IDE menu with additional information and actions."/> 

## Search bar and command palette

The <Constant name="studio_ide" /> provides tools to help you quickly navigate your project's files, find information, run commands, and replace syntax with just a few clicks in a layout that's familiar to users of popular IDEs.

<Lightbox src="/img/docs/dbt-platform/platform-ide/search-and-command.png" width="90%" title="Use the search bar and command palette to quickly navigate your file tree and open tabs."/>

1. [Search and replace](#search-and-replace)
2. [Command palette](#command-palette)

### Search and replace

The search feature enables you to quickly find specific terms or phrases and replace them with the click of a button.

<Lightbox src="/img/docs/dbt-platform/platform-ide/search-and-replace.png" width="50%" title="Search files for specific terms and quickly replace them." />

1. Toggle between **file tree** and **search** navigation.
2. Search for words or phrases. Enhance the search to match case and/or whole words. You can also input replacement words or phrases. Click the icon next to the **Replace** field to replace all entries.
3. Navigate the search results. Click an entry to open the related file and highlight it on the screen. If you've entered replacement text, you'll see a preview of the new syntax. Click the symbol next to an entry to substitute the text with whatever is in the **Replace** field.

###  Command palette

The command palette enhances navigation of your dbt project, enabling you to search files, content, and symbols, show and run IDE commands, view recent files, and more. Click the command palette to view the available options. Actions supporting keyboard shortcuts display to the right of the text.

<Lightbox src="/img/docs/dbt-platform/platform-ide/command-palette.png" width="90%" title="The command palette enables you to quickly navigate your project and run commands." />

- **Go to File:** Search for files in your current project and open them in a new tab.
- **Show and Run Commands:** View and run commands related to IDE navigation and settings. 
   Note: dbt commands (such as `run` and `build`) are available only in the [Command bar](#console-section) menu in the console; the command palette doesn't currently support them.
- **Search for Text:** Search for text across your project and either open files from the results or send results to the [search and replace](#search-and-replace) section for bulk changes.
- **Go to Symbol in Editor:** Quickly jump to symbols in the current file.
- **More:** Display advanced features such as **Go to Line/Column**, **Go to Symbol in Workspace**, and search within currently open files only. 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/platform-ide/go-to-file.png" width="90%" title="Go to File." />

<Lightbox src="/img/docs/dbt-platform/platform-ide/show-and-run-commands.png" width="90%" title="Show and Run Commands." />

<Lightbox src="/img/docs/dbt-platform/platform-ide/search-for-text.png" width="90%" title="Search for text." />

<Lightbox src="/img/docs/dbt-platform/platform-ide/go-to-symbol.png" width="90%" title="Go to Symbol in Editor." />

<Lightbox src="/img/docs/dbt-platform/platform-ide/more.png" width="90%" title="More." />


</DocCarousel>

## Editing features

The <Constant name="studio_ide" /> features some delightful tools and layouts to make it easier for you to write dbt code and collaborate with teammates. 

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-editing.png" width="90%" title="Use the file editor, version control section, and save button during your development workflow"/>

1. **File editor &mdash;** The file editor is where you edit code. Tabs break out the region for each opened file, and unsaved files are marked with a blue dot icon in the tab view. You can edit, format, or lint files and execute dbt commands in your protected primary git branch. Since the <Constant name="studio_ide" /> prevents commits to the protected branch, it prompts you to commit those changes to a new branch.

    * Use intuitive [keyboard shortcuts](/docs/platform/studio-ide/keyboard-shortcuts) to make development easier for you and your team.

2. **Save button &mdash;** The editor has a **Save** button that saves editable files. Pressing the button or using the Command-S or Control-S shortcut saves the file contents. You don't need to save to preview code results in the Console section, but it's necessary before changes appear in a dbt invocation. The file editor tab shows a blue icon for unsaved changes.

3. **Version Control &mdash;** This menu contains all git-related elements, including the <Constant name="git" /> actions button. The button updates relevant actions based on your editor's state, such as prompting to pull remote changes, commit and sync when reverted commit changes are present, creating a merge/pull request when appropriate, or pruning branches deleted from the remote repository.

   - The dropdown menu on the <Constant name="git" /> actions button allows users to revert changes, refresh <Constant name="git" /> state, create merge/pull requests, prune branches, and change branches.
   -  You can also [resolve merge conflicts](/docs/platform/git/merge-conflicts) and for more info on git, refer to [Version control basics](/docs/platform/git/version-control-basics#the-git-button-in-the-cloud-ide).
   -  **Version Control Options menu &mdash;** The **Changes** section, under the <Constant name="git" /> actions button, lists all file changes since the last commit. You can click on a change to open the <Constant name="git" /> Diff View to see the inline changes. You can also right-click any file and use the file-specific options in the Version Control Options menu.

<Lightbox src="/img/docs/dbt-platform/platform-ide/version-control-options-menu.png" width="60%" title="Right-click edited files to access Version Control Options menu"/>


  - Use the **Prune branches** option to remove local branches that have already been deleted from the remote repository. Selecting this triggers a [pop-up modal](#prune-branches-modal), where you can confirm the deletion of the specific local branches, keeping your branch management tidy. Note that this won't delete the branch you're currently on. Pruning branches isn't available for [managed repositories](/docs/platform/git/managed-repository) because they don't have a typical remote setup, which prevents remote branch deletion. 

## Additional editing features

- **Minimap &mdash;** A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is displayed on the upper-right side of the editor. To quickly jump to different sections of your file, click the shaded area.
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-minimap.png" width="90%" title="Use the Minimap for quick navigation and code understanding"/>

- **<Constant name="git" /> Diff View &mdash;** Clicking on a file in the **Changes** section of the **Version Control Menu** will open the changed file with <Constant name="git" /> Diff view. The editor will show the previous version on the left and the in-line changes made on the right.
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-git-diff-view-with-save.png" width="90%" title="The Git Diff View displays the previous version on the left and the changes made on the right of the Editor"/>

- **Markdown Preview console tab &mdash;** The Markdown Preview console tab shows a preview of your .md file's markdown code in your repository and updates it automatically as you edit your code.
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-markdown-with-save.png" width="90%" title="The Markdown Preview console tab renders markdown code below the Editor tab."/>

- **CSV Preview console tab &mdash;** The CSV Preview console tab displays the data from your CSV file in a table, which updates automatically as you edit the file in your seed directory.
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-csv.png" width="90%" title="View CSV code in the CSV Preview console tab below the Editor tab."/>

## Console section

The console section, located below the file editor, includes various console tabs and buttons to help you with tasks such as previewing, compiling, building, and viewing the <Term id="dag" />. Refer to the following sub-bullets for more details on the console tabs and buttons.
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-console-overview.png" width="90%" title="The Console section is located below the file editor and has various tabs and buttons to help execute tasks"/>

1. **Preview button &mdash;** When you click on the **Preview** button, it runs the SQL in the active file editor regardless of whether you have saved it or not and sends the results to the **Results** console tab. You can preview a selected portion of saved or unsaved code by highlighting it and then clicking the **Preview** button.

<details>
<summary>Row limits in IDE</summary>
The <Constant name="studio_ide" /> returns default row limits, however, you can also specify the number of records returned. Refer to the following sub-bullets for more info: <br /><br />
<ul>
<li><b>500-row limit:</b> To prevent the IDE from returning too much data and causing browser problems, dbt automatically sets a 500-row limit when using the <b>Preview Button</b>. You can modify this by adding <code>limit your_number</code> at the end of your SQL statement. For example, <code>SELECT * FROM</code> table <code>limit 100</code> will return up to 100 rows. Remember that you must write the <code>limit your_number</code> explicitly and cannot derive it from a macro.</li>
<li><b>Change row limit default:</b> In dbt version 1.6 or higher, you can change the default limit of 500 rows shown in the <b>Results</b> tab when you run a query. To adjust the setting you can click on <b>Change row display</b> next to the displayed rows. Keep in mind that you can't set it higher than 10,000 rows. If you refresh the page or close your development session, the default limit will go back to 500 rows.</li>
<li><b>Specify records returned:</b> The IDE also supports <code>SELECT TOP #</code>, which specifies the number of records to return.</li>
</ul>
</details>

2. **Compile button &mdash;** The **Compile** button compiles the saved or unsaved SQL code and displays it in the **Compiled code** tab.


Starting from dbt v1.6 or higher, when you save changes to a model, you can compile its code with the model's specific context. This context is similar to what you'd have when building the model and involves useful context variables like `{{ this }} `or `{{ is_incremental() }}`.

3. **Build button &mdash;** The build button allows users to quickly access dbt commands related to the active model in the file editor. The available commands include dbt build, dbt test, and dbt run, with options to include only the current resource, the resource and its upstream dependencies, the resource, and its downstream dependencies, or the resource with all dependencies. This menu is available for all executable nodes.

4. **Lint button** &mdash; The **Lint** button runs the [linter](/docs/platform/studio-ide/lint-format) on the active file in the file editor. The linter checks for syntax errors and style issues in your code and displays the results in the **Code quality** tab.

5. **dbt Copilot** &mdash; [dbt Copilot](/docs/platform/dbt-copilot) is an AI assistant integrated into the <Constant name="studio_ide" />. Use the quick-action buttons to generate documentation, tests, semantic models, and metrics with a single click. The Copilot panel also provides access to the [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent), which applies natural language prompts to generate or refactor models, semantic models, tests, and documentation autonomously. Select **Ask** or **Code** mode in the bottom toolbar to activate the <Constant name="dev_agent" />. <Lifecycle status="self_service,managed,managed_plus" />

6. **Commands tab** &mdash; View the most recently run [dbt commands](/reference/dbt-commands) from your current IDE session, their results, and relevant system logs.

7. **Problems tab** &mdash; You must be running the <Constant name="fusion_engine" /> to utilize the problems tab. Gain insights into problems with your dbt project that may prevent it from running properly in <Constant name="fusion" /> as you edit and before you execute runs. 
<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-problems-tab.png" width="90%" title="Preview results show up in the Results console tab"/>

8. **Results tab** &mdash; The Results console tab displays the most recent Preview results in tabular format. 
<Lightbox src="/img/docs/dbt-platform/platform-ide/results-console-tab.png" width="90%" title="Preview results show up in the Results console tab"/>

9. **Code quality tab** &mdash; The Code quality tab displays the results of the linter on the active file in the File editor. It allows you to view code errors, provides code quality visibility and management, and displays the SQLFluff version used.

10. **Compiled code tab &mdash;** The Compile generates the compiled code when the Compile button is executed. The Compiled code tab displays the compiled SQL code for the active file in the file editor.
<Lightbox src="/img/docs/dbt-platform/platform-ide/compiled-code-console-tab.png" width="90%" title="Compile results show up in the Compiled Code tab"/>

11. **Lineage tab &mdash;** The Lineage tab in the file editor displays the active model's lineage or  <Term id="dag" />. By default, it shows two degrees of lineage in both directions (`2+model_name+2`), however, you can change it to +model+ (full DAG). To use the lineage:
    - Double-click a node in the DAG to open that file in a new tab
    - Expand or shrink the DAG using node selection syntax.
    - Note, the `--exclude` flag isn't supported.

<Lightbox src="/img/docs/dbt-platform/platform-ide/lineage-console-tab.png" width="90%" title="View resource lineage in the Lineage tab"/>

## Invocation history

The Invocation History Drawer stores information on dbt invocations in the IDE. When you invoke a command, like executing a dbt command such as `dbt run`, the associated logs are displayed in the Invocation History Drawer. 

You can open the drawer in multiple ways: 
- Clicking the `^` icon next to the Command bar on the lower left of the page
- Typing a dbt command and pressing enter
- Or pressing Control-backtick (or Ctrl + `)

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-inv-history-drawer.png" width="90%" title="The Invocation History Drawer returns a log and detail of all your dbt invocations."/>

1. **Invocation History list &mdash;** The left-hand panel of the Invocation History Drawer displays a list of previous invocations in the <Constant name="studio_ide" />, including the command, branch name, command status, and elapsed time.

2. **Invocation Summary &mdash;** The Invocation Summary, located above **System Logs**, displays information about a selected command from the Invocation History list, such as the command, its status (`Running` if it's still running), the git branch that was active during the command, and the time the command was invoked.

3. **System Logs toggle &mdash;** The System Logs toggle, located under the Invocation Summary, allows the user to see the full stdout and debug logs for the entirety of the invoked command. 

4. **Command Control button &mdash;** Use the Command Control button, located on the right side, to control your invocation and cancel or rerun a selected run.

<Lightbox src="/img/docs/dbt-platform/platform-ide/ide-results.png" width="90%" title="The Invocation History list displays a list of previous invocations in the IDE"/>

5. **Node Summary tab &mdash;** Clicking on the Results Status Tabs will filter the Node Status List based on their corresponding status. The available statuses are Pass (successful invocation of a node), Warn (test executed with a warning), Error (database error or test failure), Skip (nodes not run due to upstream error), and Queued (nodes that have not executed yet).

6. **Node result toggle &mdash;** After running a dbt command, information about each executed node can be found in a Node Result toggle, which includes a summary and debug logs. The Node Results List lists every node that was invoked during the command.

7. **Node result list &mdash;** The Node result list shows all the Node Results used in the dbt run, and you can filter it by clicking on a Result Status tab.

## Modals and Menus

Use menus and modals to interact with <Constant name="studio_ide" /> and access useful options to help your development workflow. 

#### Editor tab menu
  To interact with open editor tabs, right-click any tab to access the helpful options in the file tab menu.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/editor-tab-menu-with-save.png" width="90%" title=" Right-click a tab to view the Editor tab menu options"/>

#### Global command shortcut
  The global command shortcut provides helpful shortcuts to interact with the <Constant name="studio_ide" />, such as git actions, specialized dbt commands, and compile, and preview actions, among others. To open the menu, use Command-P or Control-P.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/ide-global-command-palette-with-save.png" width="100%" title="The Command History returns a log and detail of all your dbt invocations."/>

#### <Constant name="studio_ide" /> Status modal
  The <Constant name="studio_ide" /> Status modal shows the current error message and debug logs for the server. This also contains an option to restart the <Constant name="studio_ide" />. Open this by clicking on the <Constant name="studio_ide" /> Status button.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/ide-status-modal-with-save.png" width="60%" title="The Command History returns a log and detail of all your dbt invocations."/>

#### Commit to a new branch
  Edit directly on your protected primary git branch and commit those changes to a new branch when ready.
  <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/create-new-branch.png" width="70%" title="Commit changes to a new branch"/>

#### Commit Changes modal
  The Commit Changes modal is accessible via the <Constant name="git" /> Actions button to commit all changes or via the Version Control Options menu to commit individual changes. Once you enter a commit message, you can use the modal to commit and sync the selected changes.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/commit-changes-modal.png" width="90%" title="The Commit Changes modal is how users commit changes to their branch."/>

#### Change Branch modal
  The Change Branch modal allows users to switch git branches in the <Constant name="studio_ide" />. It can be accessed through the **Change Branch** link or the **<Constant name="git" /> actions** button under the **Version control** menu.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/change-branch-modal.png" width="90%" title="The Commit Changes modal is how users change their branch."/>

#### Prune branches modal
  The Prune branches modal allows users to delete local branches that have been deleted from the remote repository, keeping your branch management tidy. This is accessible through the **<Constant name="git" /> actions** button under the [**Version control** menu](#editing-features). Note that this won't delete the branch you're currently on. Pruning branches isn't available for managed repositories because they don't have a typical remote setup, which prevents remote branch deletion.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/prune-branch-modal.png" width="60%" title="The Prune branches modal allows users to delete local branches that have already been deleted from the remote repository."/>

#### Revert Uncommitted Changes modal
  The Revert Uncommitted Changes modal is how users revert changes in the IDE. This is accessible via the `Revert File` option above the Version Control Options menu, or via the Git Actions button when there are saved, uncommitted changes in the IDE.
  <Lightbox src="/img/docs/dbt-platform/platform-ide/revert-uncommitted-changes-with-save.png" width="90%" title="The Commit Changes modal is how users change their branch."/>
