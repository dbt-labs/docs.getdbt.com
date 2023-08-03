---
title: "Update: Cloud IDE v1.2 includes a new service"
description: "August 2023: Cloud IDE now uses dbt-server to provide more reliable service and dbt Core feature parity, including support for commands like `dbt list`."
sidebar_label: "Update: Cloud IDE v1.2"
tags: [Aug-2023, IDE]
date: 2023-08-03
sidebar_position: 8
---

We're excited to announce that we replaced the backend service that powers the Cloud IDE with a more reliable server -- dbt-server. Because this release contains foundational changes, IDE v1.2 requires dbt v1.6 or higher. This significant update follows the rebuild of the IDE frontend last year. We're committed to improving the IDE to provide you with a better experience.

Previously, the Cloud IDE used dbt-rpc, an outdated service that was unable to stay up-to-date with changes from dbt-core. The dbt-rpc integration used legacy dbt-core entry points and logging systems, causing it to be sluggish, brittle, and poorly tested. The Core team had been working around this outdated technology to avoid breaking it, which prevented them from developing with velocity and confidence.

## New features

- **Better dbt-core parity:** The Cloud IDE has better command parity with dbt-core, including support for commands like `dbt list` and improved treatment of flags like `--vars`, `--fail-fast`, etc.
- **Improved maintainability:** With the new dbt-server, it's easier to fix bugs and improve the overall quality of the product. With dbt-rpc, fixing bugs was a time-consuming and challenging process that required extensive testing. With the new service, we can identify and fix bugs more quickly, resulting in a more stable and reliable IDE.
- **A more reliable service:** Simplified architecture that's less prone to failure.

### Product refinements

- Improved `Preview` capabilities with Core v1.6 + IDE v1.2. [This Loom](https://www.loom.com/share/12838feb77bf463c8585fc1fc6aa161b) provides more information.

### Bug fixes

- Global page can become "inert" and stop handling clicks
- Switching back and forth between files in the git diff view can cause overwrite
- Browser gets stuck during markdown preview for doc with large table
- Editor right click menu is offset
- Unable to Cancel on the Save New File component when Closing All Files in the IDE
- Mouse flicker in the modal's file tree makes it difficult to select a folder where you want to save a new file  
- Snapshots not showing in Lineage when inside a subfolder and is mixed cased named
- Tooltips do not work for Format and Save
- When a dbt invocation is in progress or if parsing is ongoing, attempting to switch branches will cause the `Git Branch` dropdown to close automatically

### Known issues

- `{{this}}` function does not display properly in preview/compile with dbt-server
