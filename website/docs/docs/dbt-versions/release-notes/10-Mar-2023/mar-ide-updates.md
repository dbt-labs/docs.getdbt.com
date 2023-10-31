---
title: "March IDE updates and fixes"
id: "mar-ide-updates"
description: "Mar 2023 release note: We've enhanced the IDE by adding add common dbt commands to the command palette, creating PRs even if you have uncommitted changes, autocompleting suggestions when editing a yml file, editing directly in the git diff view, improved the DAG selector, upgraded sqlfmt, improved syntax error messaging, and more."
sidebar_label: "Update and fixes: IDE"
tags: [Mar-2023, IDE]
---

To continue improving your [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) development experience, the dbt Labs team continue to work on adding new features, fixing bugs, and increasing reliability ✨.

Read more about the [upcoming improvements to the Cloud IDE](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/) and stay up-to-date with [IDE-related changes](https://docs.getdbt.com/tags/ide).


## New features 

- Commit and revert individual files under **Version Control**.
- Use the [command palette](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#cloud-ide-features) to invoke common complex dbt commands, such as resuming from the last failure.
- Create PRs even when there are uncommitted changes (under the **git** dropdown).
- The IDE will display more autocomplete suggestions when editing a YML file, powered by [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema).
- The file tree now has additional options in the right-click menu, such as Copy model as ref or Copy file path.
- The DAG view has been adjusted to a default of `2+model+2`.
- A lineage selector has been implemented in the DAG/lineage sub-tab.
- Edit directly in the git diff view located in the right pane.
- A warning message will now appear when users press Command-W/Control-W when there are unsaved changes.
- A new onboarding flow guide is now available.

## Product refinements 

- The DAG selector now uses `name` instead of `file_uri` to build selectors.
- The DAG is now vertically centered under the new Selector Input element 
- sqlfmt has been upgraded to v0.17.0.
- When the Format button fails, a toast notification will display a syntax error.
- The editor now has the option to toggle minimap/word-wrap via right-click.
- The history drawer displays elapsed time in real-time and s/m/h increments.
- When deleting development environments, the delete modal will now warn users that any uncommitted changes will be lost.
- The context for the Git button has been adjusted to show that it will link to an external site (such as GitHub or GitLab) when users create a pull request.

## Bug fixes

- The IDE now displays an error message when the git repository is not reachable. Previously, it failed silently.
- The kebab menu is now visible when the invocation history drawer is open. Previously, it wasn't showing.
- DAGs are now updated/populated consistently. Previously, it occasionally failed.
- The purple highlight for DAG selection is now consistent across files. Previously, it was inconsistent.
- Users can now rename files back to their original name. Previously, this wasn't possible.
- The link to the IDE from the project setup page has been corrected.
- The IDE no longer has issues with single-space file names.
- Adding invalid characters in the sub-directory config no longer causes the IDE to fail.
- YML autocomplete triggers consistently now. Previously, it occasionally didn't trigger.
- Reverting single files now reloads the file contents in the tab. Previously, it didn't reload.
- The file tree no longer collapses on the first click when there is a project subdirectory defined.
