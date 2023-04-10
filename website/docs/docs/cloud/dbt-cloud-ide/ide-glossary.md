---
title: "IDE glossary"
id: ide-glossary
description: "Develop, test, run, and build in the Cloud IDE. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: IDE glossary
tags: [IDE]
---

The [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) is an interface tool for developers to effortlessly build, test, run, and version-control their dbt projects - all from the convenience of your browser. Use the Cloud IDE to compile dbt code into SQL and run it against your database directly -- no command line required!

## Landing page

The IDE is designed to streamline your workflow, and features a popular user interface and layout with all files and folders on the left and the editor on the right. 

The basic layout of the IDE landing page is divided into the following areas:

A &mdash; [Git repository link](#git-repository-link)<br />
B &mdash; [Documentation site button](#documentation-site-button)<br />
C &mdash; [Version Control Menu](#version-control-menu)<br />
D &mdash; [File Explorer](#file-explorer)<br />
E &mdash; [Command bar](#command-bar)<br />
F &mdash; [IDE Status button](#ide-status-button)<br />
G &mdash; [Create New File button](#create-new-file-button)<br />

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-landing.jpg" width="100%" title="The Cloud IDE landing page"/>


#### Git Repository link 
The Git Repository Link displays the name of the active branch. Clicking this element will hyperlink to your repository, pinned to that same branch. Available for Github or Gitlab repos on multi-tenant dbt Cloud. 

#### Documentation site button
The Documentation Site button links to the static dbt Documentation site powered by the most recently generated dbt artifacts in the IDE. This button is clickable once a `dbt docs generate` command is successfully invoked in the Command Bar.  

#### Version Control menu
The Version Control menu contains all git-related elements in the IDE. The Git Actions Button will dynamically update with the relevant action for the state of your editor, including prompt to pull remote changes, commit and sync when reverted commit changes are in the editor, or create a merge/pull request when appropriate. The dropdown menu on the Git Actions Button allows users to revert all changes, refresh git state, create merge/pull requests, and change branches. Refer to [Version control basics](/docs/collaborate/git/version-control-basics#the-git-button-in-the-cloud-ide) for more info. 

Below the Git Actions Button, all changes to files since the last commit will be listed in the **Changes** section. Clicking on any change will open the Git Diff View of the selected file, allowing the user to see the inline changes.

#### File Explorer 

The File Explorer shows the filetree of your repository. You can:
* Click on any file in the filetree to open the file in the File Editor. 
* Click and drag files between directories to move files. 
* Right click a file to access the sub-menu options like copy file name, copy as `ref`, rename, delete, and more.

These actions require that the user is not in `read-only` mode, which generally happens when the user is viewing the default branch. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-explorer-menu.jpg" width="30%" title="Right click files to access sub-menu options"/>

#### Command bar
The Command bar is where [dbt commands](/reference/dbt-commands) are invoked in the IDE. Invoking a command will open the Invocation History Drawer to show the associated logs.

#### IDE Status button
The IDE Status Button reports the current status of the IDE. Anytime there is a status error, or if there is a dbt code error that prevents the project from parsing, this button will turn red and say Error. Clicking on this button brings up the [IDE Status Modal](#IDE-Status-Modal)


#### Create New File button
This button allows the user to create a new file in their project. 

## Editing 

The layout of the IDE editing page is divided into the following areas, and more features.

A &mdash; [File Editor](#file-editor)<br />
B &mdash; [Format Button](#format-button)<br />
C &mdash; [Save Button](#save-button)<br />
D &mdash; [Console](#console)<br />
E &mdash; [Preview console button](#preview-console-button)<br />
F &mdash; [Compile console button](#compile-console-button)<br />
G &mdash; [Build console button](#build-console-button)<br />
H &mdash; [Results console tab](#results-console-tab)<br />
I &mdash; [Compiled console tab](#compiled-code-console-tab)<br />
J &mdash; [Lineage console tab](#lineage-console-tab)<br />

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/editing-components-with-save.jpg" width="100%" title="The Cloud IDE editing components"/>

#### File Editor
The File Editor is the region where users edit code. This region is broken out by tabs for all files that have been opened. Unsaved Files are marked with a blue dot icon in the tab view. 

#### Format Button

The editor has a **Format** button enabled in this area for `{{  filetypes  }}` files, and will use your selected formatter (`sqlfmt` or `sqlfluff` for sql, `black` for python) to reformat the file contents.

#### Save button

The editor has a `Save` button for all editable files. Clicking this button (or using the shortcut `CMD/CTRL + S` will save the file contents. While saving is not necessary to preview the results of the code in the Console section, saving is required before changes are reflected in a dbt invocation. Unsaved changes are marked by a blue icon on the File Editor tab. 

#### Console
This console section sits below the File editor and contains all the sub-tabs and buttons that help you preview, compile, build, view the DAG, and more. 

[Refer to](#editing) bullets E to J above for more details on the console tabs and buttons. 

#### Preview console button 
The Preview Button executes the SQL in the active file editor (regardless of save status) against your warehouse, and returns the results to the Results subtab. Queries executed via the Preview Button will automatically have a limit 500 appended to the end to prevent returning excessive data to the IDE and causing browser issues. 

#### Compile console button
The Compile Button takes the contents of the active File Editor (regardless of save status) and returns the compiled SQL to the Compiled Code Subtab

#### Build console button 
The build button is a shortcut for the user to invoke dbt commands anchored by the active model in the File Editor. The available commands are `dbt build`, `dbt test`, and `dbt run` with options to include only the current resource, the resource and its upstream dependencies, the resource and its downstream dependencies, or the resource with all dependencies. This menu is enabled for all executable nodes.

#### Results console tab
The Results subtab displays the most recent Preview results in tabular format. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/results-console-tab.jpg" width="100%" title="Preview results show up in the Results console tab"/>

#### Compiled code console tab
The Compiled Code Tab shows the compiled code generated by the most recent compile invocation triggered by the Compile button.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/compiled-code-console-tab.jpg" width="100%" title="Compile results show up in the Compiled code console tab"/>

#### Lineage console tab
The Lineage subtab shows the lineage for the active model in the File Editor. By default, this menu will display 2 degrees of lineage in both directions (`2+model_name+2`). This can be edited to display any desired selection syntax. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/lineage-console-tab.jpg" width="100%" title="View resource lineage in the Lineage console tab"/>

#### Minimap
A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is displayed on the upper-right side of the editor. To quickly jump to different sections of your file, click the shaded area.

#### Editor Command Palette
The Editor Command Palette contains text editing actions, and lists the associated keyboard shortcut for each action where applicable. This menu can be accessed using `F1` or by right-clicking in the text editing area and selecting Command Palette.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editor-command-palette-with-save.jpg" width="100%" title="Click F1 to access the Editor Command Palette menu for editor shortcuts"/>

#### Editor tab menu
The file tab menu contains helpful options for interacting with open editor tabs. You can access the menu by right-clicking on any open tab. 
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/editor-tab-menu-with-save.jpg" width="100%" title="Right click a tab to view the Editor tab menu options"/>

#### Git Diff View
After clicking on a file in the **Changes** section in the **Version Control Menu**, the changed file will open with the Git Diff view. The editor will display the previous version on the left, and the highlighted, in-line changes made on the right. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-git-diff-view-with-save.jpg" width="100%" title="The Git Diff View displays the previous version on the left and the changes made on the right of the Editor"/>

#### Markdown Preview subtab
The Markdown Preview subab renders markdown code in a .md file in your repository into a Markdown Preview. This is updated as you make edits to your code! 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-markdown-with-save.jpg" width="100%" title="The Markdown Preview subtab renders markdown code below the Editor tab."/>

#### CSV Preview subtab
The CSV Preview subtab renders csv code in a .csv file in your seed directory into tabular format. This is updated as you make edits to your code! 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-csv.jpg" width="100%" title="View csv code in the CSV Preview subtab below the Editor tab."/>

## Invocation history

The Invocation History Drawer contains all information related to dbt invocations in the IDE. This menu can be accessed by the `^` icon next to the Command Bar, or automatically by invoking a command. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/invocation-components-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

A &mdash; [Invocation History list](#invocation-history-list)<br />
B &mdash; [Invocation Summary](#invocation-summary)<br />
C &mdash; [System Logs toggle](#system-logs-toggle)<br />
D &mdash; [Result Status tabs](#result-status-tabs)<br />
E &mdash; [Node result](#node-result)<br />
F &mdash; [Command Control button](#command-control-button)<br />

### Invocation History list

The Invocation History List in the left hand panel of the Invocation History Drawer shows summary details about previous invocations in the IDE. This includes the command, the branch name, the status of the command, and the total elapsed time. 

### Invocation Summary

The Invocation Summary shows the summary details of the selected invocation from the Command History List. This includes the command invoked, the status of the selected command (`Running` if the command is still in progress), the active git branch at the time of the invocation, and the timestamp of the invocation.

### System Logs toggle
The System Logs Toggle allows the user to see the full stdout and debug logs for entirety of the invoked command. 

### Result Status tabs
The Results Status Tabs group executed nodes from the command by their result. Clicking on these will filter the Node Status List by the corresponding status. Statuses include:

- Pass - successful invocation of a node
- Warn (tests only) - test executed with warning
- Error - database error when executing node or failure in test
- Skip - nodes that did not run due to upstream error
- Queued - nodes that have yet to execute

### Node result
Each node executed during a dbt command invocation will be summarized in a Node Result toggle, that contains the summary (stdout) and debug logs to easily see the details about each node. The Node Results List contains an entry for every invoked node. 

### Node result list

The Node result list contains the full list of each Node Result invoked during the dbt run. This can be filtered by clicking on any of the Result Status tabs. 
### Command Control button
Use the command control button to control your invocation and cancel or rerun a selected run.

## Modals and Menus

### File Search
The File Navigation Menu (`CMD/CTRL + O` or the 🔍 icon in the File Explorer) allows for quick searching files by name, and navigating between then with ease.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-search-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### Global Command Palette
The Global Command Palette contains useful shortcuts for interacting with the IDE, including git actions, specialized dbt commands, as well as compile and preview actions, among others. Use `CMD/CTRL + P` to access the menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-global-command-palette-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### IDE Status modal

The IDE Status modal shows the current error message and debug logs for the server. This also contains an option to restart the IDE. Open this by cicking on the [IDE Status button](#ide-status-button)

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-status-modal-with-save.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### Commit Changes modal

The Commit Changes modal is accessible via the Git Actions button to commit all changes or via the Version Control Options menu to commit individual changes. The modal allows users to commit and sync the selected changes one a commit message is entered.  

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-changes-modal.png" width="100%" title="The Commit Changes modal is how users commit changes to their branch."/>

### Change Branch modal

The Change Branch modal is how users change git branches in the IDE. This is accessible via the `Change Branch` link above the Version Control Menu, or via the Git Actions Button.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/change-branch-modal.png" width="100%" title="The Commit Changes modal is how users change their branch."/>

### Revert Uncommitted Changes modal

The Revert Uncommitted Changes modal is how users revert changes in the IDE. This is accessible via the `Revert File` option above the Version Control Options Menu, or via the Git Actions Button when there are saved, uncommitted changes in the IDE.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/revert-uncommitted-changes-with-save.jpg" width="100%" title="The Commit Changes modal is how users change their branch."/>

### IDE Options menu

The IDE Options menu is accessible via the kebab menu on the bottom right corner of the IDE contains global IDE options:

* Toggle dark or light mode to customize your viewing experience
* Restart the IDE
* Full reclone your repository to refresh your git state
* View status details (i.e. view the [IDE Status Modal](#ide-status-modal))

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.jpg" width="85%" title="Click on the kebab menu to view the options menu"/>

### Version Control Options menu

The Version Control Options menu has file-specific options to control the git state of individually changed files. This is accessed by right clicking any of the files in the **Changes** section. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/version-control-options-menu.png" width="30%" title="Right click changed files to access sub-menu options"/>

<!-- commenting out temporarily, will remove when pr is finalized.

## Header 4

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-command-history.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

**A. Text** &mdash;

**B. Text** &mdash;

**C. Text** &mdash;

**D. Text** &mdash;

**E. Text** &mdash;

**F. Text** &mdash;

**G. Text** &mdash;

**H. Text** &mdash;

-->
