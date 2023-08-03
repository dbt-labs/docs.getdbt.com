---
title: "Update: Cloud IDE v1.2 with dbt-server"
description: "August 2023: Cloud IDE now uses dbt-server to provide more reliable service and dbt Core feature parity, including support for commands like `dbt list`."
sidebar_label: "Update: Cloud IDE v1.2"
tags: [Aug-2023, IDE]
date: 2023-08-03
sidebar_position: 8
---

We're excited to announce that we replaced the backend service that powers the Cloud IDE with a more reliable server, dbt-server. This significant update follows the rebuild of the IDE frontend last year. We're committed to improving our IDE to provide you with a better experience.

The Cloud IDE previously used dbt-rpc, an outdated service that was unable to keep up with the changes from dbt-core. The dbt-rpc integration used legacy dbt-core entry points and logging systems, causing it to be sluggish, brittle, and not well tested. At a high cost of maintenance, the Core team has been working around this outdated technology to avoid breaking it, preventing them from developing with velocity and confidence.

## New features

- **Better dbt-core parity:** The Cloud IDE will have better command parity with dbt-core, including support for commands like `dbt list` and improved treatment of flags like `--vars`, `--fail-fast`, etc. 
- **Improved maintainability:** With the new dbt-server, it will be easier for our development team to fix bugs and improve the overall quality of the product. One of the biggest advantages of the new backend service is the ability to fix bugs easier. With dbt-rpc, fixing bugs was a time-consuming and challenging process that required extensive testing. With the new service, we'll be able to identify and fix bugs more quickly, which will ultimately result in a more stable and reliable IDE.
- **A more reliable service:** Simplified architecture that will less prone to failure.

### Product refinements

- Improved `Preview` capabilities with Core v1.6 + IDE v1.2 ([loom](https://www.loom.com/share/12838feb77bf463c8585fc1fc6aa161b))


### Bug Fixes

- [global page] can become "inert" and stop handling clicks
- Switching back and forth between files in the git diff view can cause overwrite
- Browser gets stuck during markdown preview for doc with large table
- editor right click menu has a weird offset
- Unable to Cancel on the Save New File component when Closing All Files in the IDE
- Difficult to select folder to save new file into due to mouse flicker in the modal's file tree
- Snapshots not showing in Lineage when inside a subfolder and is mixed cased named
- tooltips not working for Format and Save
- When a dbt invocation is in progress or if parsing is ongoing, attempting to switch branches will cause the `Git Branch` dropdown to close automatically

### Known Issues

- `{{this}}` function does not display properly in preview/compile with dbt-server
