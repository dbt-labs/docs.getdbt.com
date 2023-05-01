---
title: "April IDE updates and fixes"
id: "apr-ide-updates"
description: "Apr 2023 release note: We've enhanced the IDE by ..., and more."
sidebar_label: "Update and fixes: IDE"
sidebar_position: 7
tags: [Apr-30-2023, IDE]
---

To continue improving your [Cloud IDE](https://docs.getdbt.com/docs/cloud/develop-in-the-cloud) development experience, the dbt Labs team continue to work on adding new features, fixing bugs, and increasing reliability ✨.

Read more about the [upcoming improvements to the Cloud IDE](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/) and stay up-to-date with [IDE-related changes](https://docs.getdbt.com/tags/ide).

## New features 

* Suggest you invoke `dbt deps` when needed (as informed by `dbt-score`) by using a warning message
* Provide warning when you select models but do not save them before clicking **Build** button or dbt invocation (dbt build/run/test) 
* Show live previews of Markdown and CSV files in the IDE console
* Provide a Duplicate File option in the File Tree menu
* Display loading time when previewing a model

## Product refinements 

* Enhance autocomplete experience which has been laggy in the past for users with large projects and implement a limit to max `manifest.json` for this feature
* Introduce pagination for invocation node summary view (displaying 100 nodes at a time)
* Improve rendering for the Changes / Version Control section of the IDE
* Update icons to be consistent in dbt Cloud
* Add table support to markdown preview
* Add lineage tab back to seed resources in the IDE
* Implement modal priority when you see multiple warning modals
* Adjust the description for a complex command in the command palette

## Bug fixes

* File tree no longer collapses on first click when there's a project subdirectory defined
* **Revert all** button now works as expected
* CSV preview no longer fails with only one column
* Cursor and scroll bar location are now persistent with their positions
* `git diff` view now shows just change diffs and no longer shows full diff (as if file is new) until page refreshes
* ToggleMinimap Command no longer runs another Command at the same time
* `git diff` view no longer shows infinite spins in specific scenarios (new file, etc.)
* File contents no longer get mixed up when using diff view and one file has unsaved changes
* YML lineage now renders model without tests (in core v1.5+)
* Radio buttons for "Summary" and "Details" in the logs section now consistently update to show the accurate tab selection
* IDE no longer throws the console error: `Error: Illegal argument` and redirects to the `Something went wrong` page
