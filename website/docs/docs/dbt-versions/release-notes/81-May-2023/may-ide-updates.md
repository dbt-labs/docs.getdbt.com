---
title: "May IDE updates and fixes"
id: "may-ide-updates"
description: "May 2023 release note: We've launched SQLFluff in beta, released an IDE UI page, significantly improved IDE performance, improved error messages, fixed bugs, and more."
sidebar_label: "Update and fixes: IDE"
sidebar_position: 2
tags: [May-2023, IDE]
---

To continue improving your [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) development experience, the dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability ✨.

Stay up-to-date with [IDE-related changes](/tags/ide).

## New features 
- Lint via SQL Fluff is now available in beta (GA over the next 2-3 weeks)
- Format markdown files with prettier
- Leverage developer experience shortcuts, including ``Ctrl + ` `` (toggle history drawer), `CMD + Option + /` (toggle block comment), `CMD + Shift + P` (open command palette), `Option + W` (close editor tab)
- Display parent folder name for files with same name in Changes section
- Navigate the new IDE features quickly using [the IDE User Interface](/docs/cloud/dbt-cloud-ide/ide-user-interface) help page
- Use `top X` in SQL when previewing in the IDE
- Opt into the new IDE backend layer over the past month (still with dbt-rpc). Ready for beta later in June!


## Product refinements 

- Performance-related upgrades:
    - Reduced cold start time by 60+%
    - Improved render time of modals in the IDE by 98%
    - Improved IDE performance with dbt Core v1.5+ (faster and snappier – highly encourage you to [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud)!)
- Upgraded sqlfmt (which powers the Format button) to 0.18.0
- Updated Build button to change menu options based on file/model type (snapshot, macro, etc.)
- Display message to disable adblocker for file contents error
- Moved Format button to console bar
- Made many security enhancements in the IDE
## Bug fixes

- File icon sizes no longer get wonky in small screen
- Toast notifications no longer take over command bar menu
- Hover info inside the text editor no longer gets cut off
- Transition between a file and a recently modified scratchpad no longer triggers a console error
- dbt v1.5+ now can access the IDE
- Confirm button on the Unsaved Changes modal now closes after clicking it
- Long node names no longer overflow in the parsed logs section in history drawer
- Status pill in history drawer no longer scales with longer command
- Tooltip for tab name with a long file name is no longer cut off
- Lint button should no longer available in main branch
