---
title: "Feb IDE updates and fixes"
id: "feb-ide-updates"
description: "Feb 2023 release note: We've enhanced the IDE by adding custom node colors in the DAG, ref autocomplete, double-click files to rename them, add link to repo from the branch name, enabled syntax highlighting for jinja, improve file tree render time, and more."
sidebar_label: "Update and fixes: IDE"
tags: [Feb-2023, IDE]
---

To continue improving our [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) experience, the dbt Labs team worked on fixing bugs, increasing reliability, and adding new features ✨.

Learn more about the [February changes](https://getdbt.slack.com/archives/C03SAHKKG2Z/p1677605383451109). 

## New features 

- Support for custom node colors in the IDE DAG visualization
- Ref autocomplete includes models from seeds and snapshots
- Prevent menus from getting cropped (git controls dropdown, file tree dropdown, build button, editor tab options)
- Additional option to access the file menu by right-clicking on the files and folders in the file tree
- Rename files by double-clicking on files in the file tree and the editor tabs
- Right-clicking on file tabs has new options and will now open at your cursor instead of in the middle of the tab
- The git branch name above **Version Control** links to the repo for specific git providers
    * Currently available for all [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses) instances using GitHub or GitLab providers 

## Product refinements 

- Added an error modal for RPC parsing errors when users attempt to invoke dbt commands (preview, compile, or general dbt invocations) 
- Enabled syntax highlighting for Jinja expression and statement delimiters
- Clarified and renamed the options under the **Build** button 
- Changed the term for RPC status from `Compiling` to `Parsing` to match dbt-core construct
- Implemented a new File Tree component to improve render time by 60%
- Disabled the Local Storage of File Tree to prevent users from running into max LocalStorage issue for large projects
- Changed snapshot snippet template (`__snapshot`) to a select from source

## Bug fixes

- You no longer have file contents carrying over when you switch to a different project that has the same file name
- The preview max limit no longer allows you to override the maximum 
- You no longer encounter node statuses failing to update in the history drawer for those on version 1.4 core. (This is a partial fix that may be fully addressed by core version 1.5)
- You can now use the **Copy File Name** option to copy up to the last dot, rather than the first dot

