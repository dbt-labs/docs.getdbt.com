---
title: "April IDE updates and fixes"
id: "apr-ide-updates"
description: "Apr 2023 release note: We've enhanced the IDE by displaying load times when previewing models, showing live previews of Markdown and CSV files, adding the ability to duplicate files in the File Tree, and more."
sidebar_label: "Update and fixes: IDE"
sidebar_position: 7
tags: [Apr-2023, IDE]
---

To continue improving your [Cloud IDE](https://docs.getdbt.com/docs/cloud/develop-in-the-cloud) development experience, the dbt Labs team continue to work on adding new features, fixing bugs, and increasing reliability ✨.

Read more about the [upcoming improvements to the Cloud IDE](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/) and stay up-to-date with [IDE-related changes](https://docs.getdbt.com/tags/ide).

## New features 

* New warning message suggests you invoke `dbt deps` when it's needed (as informed by `dbt-score`).
* New warning message appears when you select models but don't save them before clicking **Build** or invoking dbt (like, dbt build/run/test). 
* Previews of Markdown and CSV files are now available in the IDE console.
* The file tree menu now includes a Duplicate File option.
* Display loading time when previewing a model

## Product refinements 

* Enhance autocomplete experience which has performed slowly for people with large projects and who implement a limit to max `manifest.json` for this feature
* Introduce pagination for invocation node summary view (displaying 100 nodes at a time)
* Improve rendering for the Changes / Version Control section of the IDE
* Update icons to be consistent in dbt Cloud
* Add table support to the Markdown preview
* Add the lineage tab back to seed resources in the IDE
* Implement modal priority when there are multiple warning modals
* Improve a complex command's description in the command palette

## Bug fixes

* File tree no longer collapses on first click when there's a project subdirectory defined
* **Revert all** button now works as expected
* CSV preview no longer fails with only one column
* Cursor and scroll bar location are now persistent with their positions
* `git diff` view now shows just change diffs and no longer shows full diff (as if file is new) until page refreshes
* ToggleMinimap Command no longer runs another Command at the same time
* `git diff` view no longer shows infinite spins in specific scenarios (new file, etc.)
* File contents no longer get mixed up when using diff view and one file has unsaved changes
* YML lineage now renders model without tests (in dbt Core v1.5 and above)
* Radio buttons for **Summary** and **Details** in the logs section now consistently update to show the accurate tab selection
* IDE no longer throws the console error `Error: Illegal argument` and redirects to the `Something went wrong` page
