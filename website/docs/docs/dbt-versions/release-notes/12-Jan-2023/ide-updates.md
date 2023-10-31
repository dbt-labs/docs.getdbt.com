---
title: "Jan IDE updates and fixes"
id: "ide-updates"
description: "Jan 2023 release note: We've enhanced the IDE with improved syntax highlighting, faster and snappier IDE, improved error messaging, view repo status, added an easter egg, and more."
sidebar_label: "Update and fixes: IDE"
tags: [Jan-2023, IDE]
---

In the spirit of continuing to improve our [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) experience, the dbt Labs team worked on fixing bugs, increasing reliability, and adding new features ✨.

Learn more about the [January changes](https://getdbt.slack.com/archives/C03SAHKKG2Z/p1675272600286119) and what's coming soon.

## New features 

- Improved syntax highlighting within the IDE for better Jinja-SQL combination (double quotes now show proper syntax highlight!)
- Adjusted the routing URL for the IDE page and removed the `next` from the URL
- Added a *new* easter egg within the IDE 🐶🦆

## Product refinements 

- Performance improvements and reduced IDE slowness. The IDE should feel faster and snappier.
- Reliability improvements – Improved error handling that previously put IDE in a bad state
- Corrected the list of dropdown options for the Build button
- Adjusted startup page duration
- Added code snippets for `unique` and `not_null` tests for yml files
- Added code snippets for metrics based on environment dbt versions
- Changed “commit and push” to “commit and sync” to better reflect the action
- Improved error message when saving or renaming files to duplicate names

## Bug fixes

- You no longer arbitrarily encounter an `RPC server got an unknown async ID` message
- You can now see the build button dropdown, which had been hidden behind the placeholder DAG screen
- You can now close toast notifications for command failure when the history drawer is open
- You no longer encounter a `Something went wrong` message when previewing a model
- You can now see repository status in the IDE, and the IDE finds the SSH folder
- Scroll bars and download CSV no longer flicker within the preview pane

## Coming soon 

- dbt Labs will roll out a series of features that should improve the quality of life within the IDE over the next several months, such as autosave, the ability to revert individual files, and user experience improvements, like right-clicking.

- dbt Labs is researching ways to include Linting/SQL Fluff in the IDE. If anyone is interested in sharing how you're using SQL Fluff today, please reach out to [dbt Labs IDE team](mailto:cloud-ide-feedback@dbtlabs.com).
