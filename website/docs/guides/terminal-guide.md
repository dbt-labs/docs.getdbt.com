---
title: "Getting started with the terminal"
id: terminal-guide
description: "A short intro to the terminal for dbt users — learn how to open it, navigate folders, and run your first dbt commands."
displayText: Getting started with the terminal
hoverSnippet: "New to the terminal? Learn the basics you need to work with dbt from the command line."
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt', 'CLI', 'Beginner']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## What is the terminal?

The terminal (also called the command line, shell, or CLI) is a text-based interface for running commands on your computer. Many dbt tools — including <Constant name="fusion" />, <Constant name="core" />, and the <Constant name="wizard" /> CLI &mdash; run from the terminal.

You don't need to be a terminal expert to use dbt. This guide covers the basics.

## Open the terminal

<Tabs>
<TabItem value="mac" label="macOS" default>

**Option 1: Spotlight**
Press `⌘ Space`, type `Terminal`, and press Enter.

**Option 2: Applications folder**
Go to **Applications** → **Utilities** → **Terminal**.

**Option 3: VS Code integrated terminal**
In VS Code, press `` ⌃` `` (Control + backtick) to open a terminal panel directly in your editor.

</TabItem>
<TabItem value="windows" label="Windows">

**Option 1: Command Prompt or PowerShell**
Press `Win + R`, type `cmd` or `powershell`, and press Enter.

**Option 2: Windows Terminal**
Search for "Terminal" in the Start menu. Windows Terminal supports Command Prompt, PowerShell, and WSL side by side.

**Option 3: VS Code integrated terminal**
In VS Code, press `` Ctrl+` `` to open a terminal panel directly in your editor.

:::tip Using dbt on Windows?
<Constant name="core" /> runs natively on Windows via PowerShell. For the best experience, consider using [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install).
:::

</TabItem>
<TabItem value="linux" label="Linux">

Open your distribution's terminal emulator — usually found in the applications menu, or press `Ctrl + Alt + T` on most desktop environments.

</TabItem>
</Tabs>

## Navigate your file system

When the terminal opens, you're in a directory (folder). These commands help you move around:

| Command | What it does | Example |
|---|---|---|
| `pwd` | Print the current directory | `pwd` → `/Users/alice` |
| `ls` | List files and folders (macOS/Linux) | `ls` |
| `dir` | List files and folders (Windows) | `dir` |
| `cd <folder>` | Change into a folder | `cd my-dbt-project` |
| `cd ..` | Go up one folder | `cd ..` |
| `cd ~` | Go to your home directory | `cd ~` |

**Tips:**

- Press **Tab** to autocomplete folder and file names — saves a lot of typing.
- Press **↑ / ↓** to scroll through previous commands.
- Press **Ctrl+C** to cancel a running command.

## Navigate to your dbt project

Your dbt project is a folder on your computer containing a `dbt_project.yml` file. Before running any dbt commands, navigate into that folder:

```bash
cd ~/path/to/your-dbt-project
```

Verify you're in the right place:

```bash
ls          # macOS/Linux — you should see dbt_project.yml
dir         # Windows
```

## Run your first dbt command

<ConfettiTrigger>
After installing dbt, you can run your first dbt command to verify it's installed and working. Make sure you're in your project folder before running any dbt commands:
```bash
cd ~/path/to/your-dbt-project
```
Then run your first dbt command:
```bash
dbt --version
```
You should see output similar to the following:
```bash
dbt-fusion 2.0.0-preview.45
```
</ConfettiTrigger>
.... and that's it! Congrats, you're ready to start using dbt in the terminal! 🎉

## Common issues

**`command not found`**
The tool isn't installed or isn't on your PATH. Double-check the install instructions for [<Constant name="core" />](/docs/local/install-dbt) or [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-quickstart).

**`Permission denied`**
You may need to run the command with elevated permissions, or check that the file is executable.

**Nothing happens after I type**
Make sure you pressed **Enter** after the command.

## Next steps
- [<Constant name="wizard" /> quickstart](/docs/dbt-ai/wizard-quickstart) — use the <Constant name="wizard" /> CLI in your terminal
- [Install dbt](/docs/local/install-dbt) — set up <Constant name="fusion_engine" /> or <Constant name="core" /> locally
- [dbt commands reference](/reference/dbt-commands) — all available dbt CLI commands

</div>
