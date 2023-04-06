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
The Git Repository Link displays the name of the active branch. Clicking this element will hyperlink to your repository, pinned to that same branch.

#### Documentation site button
The Documentation Site Button links out to the static dbt Documentation site powered by the most recently generated dbt artifacts in the IDE. This button is clickable once a dbt docs generate command is successfully invoked.  

#### Version Control menu
The Version Control menu contains all git-related elements in the IDE. The Git Actions Button will dynamically update with the relevant action for the state of your editor, including prompt to pull remote changes, commit and sync when reverted commit changes are in the editor, or create a merge/pull request when appropriate. The dropdown menu on the Git Actions Button allows users to revert all changes, refresh git stats, create merge/pull requests, and change branches. Refer to [Version control basics](/docs/collaborate/git/version-control-basics#the-git-button-in-the-cloud-ide) for more info. 

Below the Git Actions Button, all changes will be listed in the **Changes** section. Clicking on any change will open the Git DIff View of the selected file, allowing the user to see exactly what changes were introduced since the previous commit.

#### File Explorer 
The File Explorer shows the filetree of your repository. You can:
* Click on any file in the filetree to open the file in the File Editor. 
* Click and drag files between directories to move files. 
* Right click a file to access the sub-menu options like copy file name, copy as `ref`, rename, delete, and more.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-explorer-menu.jpg" width="30%" title="Right click files to access sub-menu options"/>

#### Command bar
The Command bar is where [dbt commands](/reference/dbt-commands) are invoked in the IDE. This will accept any valid dbt command, and invoking a command will open the Command History Drawer to show the associated logs.

#### IDE Status button
The IDE Status Button reports the current status of the IDE. Anytime there is a status error, or if there is a dbt code error that prevents the project from parsing, this button will turn red and say Error. Clicking on this button brings up the IDE options menu, which contains additional IDE options:

- Toggle dark or light mode to customize your viewing experience
- Restart the IDE
- Full reclone your repository to refresh your git state
- View status details, including the current IDE compilation state

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu.jpg" width="85%" title="Click on the IDE status button to view the options menu"/>

#### Create New File button
This button allows the user to create a new file in their project. 

## Editing 

The layout of the IDE editing page is divided into the following areas, and more features.

A &mdash; [File Editor](#file-editor)<br />
B &mdash; [Interaction bar](#interaction-bar)<br />
C &mdash; [Preview button](#preview-button)<br />
D &mdash; [Compile button](#compile-button)<br />
E &mdash; [Build button](#build-button)<br />
F &mdash; [Results button](#results-button)<br />
G &mdash; [Compiled code tab](#compiled-code-tab)<br />
H &mdash; [Lineage tab](#lineage-tab)<br />

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-editing.jpg" width="100%" title="The Cloud IDE editing components"/>

#### File Editor
The File Editor is the region where users enter and edit code. This region is broken out by tabs for all files that have been opened. Unsaved Files are marked with a blue dot icon in the tab view. 

The editor has a **Format** button enabled in this area for `{{  filetypes  }}` files, and will use your selected formatter (sqlfmt or sqlfluff) to edit the file contents. 

#### Interaction bar
This interaction bar section sits below the File editor and contains all the sub-tabs and buttons that help you preview, compile, build, view the DAG, and more. 

Refer to bullets C to H for more details on the sub-tabs and button details. 

#### Preview button 
The Preview Button executes the SQL in the active file editor (regardless of save status) against your warehouse, and returns the results to the Results Tab. Queries executed via the Preview Button will automatically have a limit 500 appended to the end to prevent returning excessive data to the IDE and causing browser issues. 

#### Compile button
The Compile Button takes the contents of the active File Editor (regardless of save status) and returns the compiled SQL to the Compiled Code Tab

#### Build  button 
The build button is a shortcut for the user to invoke dbt commands anchored by the active model in the File Editor. The available commands are dbt build, dbt test, and dbt run with selection options to include the current resource, the resource and upstream dependencies, the resource with all downstream dependencies, or the resource with all dependencies. This menu is enabled for all executable nodes

#### Results button
The Results Tab displays the most recent Preview results in tabular format. 

#### Compiled code tab
The Compiled Code Tab shows the compiled code generated by the most recent compile invocation triggered by the Compile Button  

#### Lineage tab
The Lineage Tab shows the lineage for the active model in the File Editor. By default, this menu will display 2 degrees of lineage in both directions (`2+model_name+2`). This can be edited to display any desired selection syntax. 

#### Minimap
A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is displayed on the upper-right side of the editor. To quickly jump to different sections of your file, click the shaded area.

#### Command Palette
The Editor Shortcuts Menu contains helpful text editing actions, and lists the associated keyboard shortcut for each action where applicable. This menu can be accessed using F1 or by right clicking in the File Editor menu and selecting Command Palette.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-command-palette.jpg" width="100%" title="Click F1 to access the Command Palette menu for editor shortcuts"/>

#### Editor tab menu
The file tab menu contains helpful options for interacting with open editor tabs. You can access the menu by right-clicking on any open tab. 
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-tab-menu.jpg" width="100%" title="Right click a tab to view the Editor tab menu options"/>

#### Git Diff View
After clicking on a file in the **Changes** section in the **Version Control Menu**, the changed file will open with the Git Diff view. The editor will display the previous version on the left, and the highlighted, in-line changes made on the right. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-git-diff-view.jpg" width="100%" title="The Git Diff View displays the previous version on the left and the changes made on the right of the Editor"/>

#### Markdown tab
The Markdown Preview Tab renders markdown code in a .md file in your repository into a Markdown Preview. This is updated as you make edits to your code! 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-markdown.jpg" width="100%" title="The Markdown preview tab renders markdown code below the Editor tab."/>

#### CSV Preview tab
The CSV Preview Tab renders csv code in a .csv file in your seed directory into tabular format. This is updated as you make edits to your code! 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-csv.jpg" width="100%" title="View csv code in the CSV preview tab below the Editor tab."/>

## Command history

The Command History Drawer contains all information related to dbt invocations in the IDE. This menu can be accessed by the `^` icon next to the Command Bar, or automatically by invoking a command. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-command-history.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### A. Command History list
The Invocation History List in the left hand panel of the Invocation History Drawer shows summary details about previous invocations in the IDE. This includes the command, the branch name, the status of the command, and the total elapsed time. 

### B. Command Summary
The Command Summary shows the summary details of the selected invocation from the Command History List. This includes the command invoked, the status of the selected command (Running if the command is still in progress), the active git branch, and the timestamp of the invocation.

### C. System Logs toggle
The System Logs Toggle allows the user to see the full stdout and debug logs for the invoked command. 

### D. Result Status tab
The Results Status Tabs group executed nodes from the command by their results status. Clicking on these will filter the Node Status List by the corresponding status. Statuses:

- Pass (tests only) - successful passing test
- Warn (tests only) - test passed with warning
- Error - database error when executing node or failure in test
- Skip - nodes that did not run due to upstream error
- Queued - nodes that have yet to execute

### E. Node result
Each node executed during a dbt command invocation will be summarized in a Node Result toggle, that contains the summary (stdout) and debug logs to easily see the details about each node. The Node Results List contains an entry for every invoked node. 

### F. Command Control button
Use the command control button to control your invocation and cancel or rerun a selected run.

## Modals

### File Search
The File Navigation Menu (CMD/CTRL + O) allows for quick searching files by name, and navigating between then with ease.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-file-search.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### Global Command Palette
The Global Command Palette contains useful shortcuts for interacting with the IDE, including git actions, specialized dbt commands, as well as compile and preview actions, among others. Use Command - P or Control - P to access the menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-global-command-palette.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

### IDE Status Modal
The IDE Status Modal shows the current error message and debug logs for the server. This also contains an option to restart the IDE. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-status-modal.jpg" width="100%" title="The Command History returns a log and detail of all your dbt Cloud invocations."/>

**Git Commit Modal** &mdash;

**Change Branch Modal** &mdash;

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
