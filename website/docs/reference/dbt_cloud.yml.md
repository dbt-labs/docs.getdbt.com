---
title: "dbt_cloud.yml file"
id: dbt_cloud.yml
sidebar_label: "dbt_cloud.yml"
description: "Reference for the dbt_cloud.yml credentials file used by the dbt CLI and dbt VS Code extension to connect to the dbt platform."
pagination_next: null
---

The `dbt_cloud.yml` file stores the credentials that dbt tools &mdash; like the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation), the [dbt VS Code extension](/docs/about-dbt-extension), and more &mdash; use to authenticate with <Constant name="dbt_platform" />. You can download it from <Constant name="dbt_platform" /> and save it locally to your `.dbt` directory.

This page covers:

- [How to download it and set up the `.dbt` directory](#download-dbt_cloudyml) for the <Constant name="platform_cli" /> or the VS Code extension
- [The file structure](#file-structure) and field reference
- [The companion `dbt-cloud` block](#the-dbt-cloud-block-in-dbt_projectyml) in `dbt_project.yml`

:::tip Keep this file safe
The `dbt_cloud.yml` file contains API keys. Store it securely and make sure you _do not_ commit it to version control.
:::

## Download dbt_cloud.yml
import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

How you download the file depends on whether you're configuring the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) or the [dbt VS Code extension](/docs/about-dbt-extension).

1. In <Constant name="dbt_platform" />, select the project you want to work on. The project must already have a [development environment](/docs/dbt-platform-environments#create-a-development-environment) set up.
2. Go to **Account settings** → **Your profile**, then follow the steps for your tool:
  - <Constant name="platform_cli" />: Navigate to **CLI** → **Configure Cloud authentication** and click **Download CLI configuration file**.
  - dbt VS Code extension: Navigate to **VS Code Extension** → **Set up your credentials** and click **Download credentials**.
    The downloaded `dbt_cloud.yml` includes your [Personal access token (PAT)](/docs/dbt-apis/user-tokens).
3. Move the file to your `.dbt` directory. If you don't have one yet, try one of these quick setup (one command) options:
    <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">

    ```bash
    mkdir -p ~/.dbt && mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
    ```

    </TabItem>
    <TabItem value="windows" label="Windows">

    ```powershell
    mkdir %USERPROFILE%\.dbt 2>nul & move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
    ```

    </TabItem>
    </Tabs>

   <Expandable alt_header="Manually create and move your .dbt directory">

   <DbtDirectoryFaq />
    
   </Expandable>

    If your downloaded file has a numerical suffix (for example, `dbt_cloud(2).yml`), rename it to `dbt_cloud.yml` before moving it. The dbt CLI and extension only look for the exact filename.

4. Confirm that the `project-id` in your [`dbt_project.yml` `dbt-cloud` block](#the-dbt-cloud-block-in-dbt_projectyml) matches the project you're working on. This registers and connects your tool to <Constant name="dbt_platform" /> and enables platform features such as <Constant name="mesh" /> and deferral.

## File structure

Your `dbt_cloud.yml` file has the following structure:

<File name="dbt_cloud.yml">

```yaml
version: "1"
context:
  active-host: your_active_host       # for example, "abc123.us1.dbt.com"
  active-project: your_project_id     # for example, "123456"
projects:
  - project-name: your_project_name
    project-id: your_project_id
    account-name: your_account_name
    account-id: your_account_id
    account-host: your_account_host   # for example, "abc123.us1.dbt.com"
    token-name: your_token_name       # for example, "cloud-cli-1234"
    token-value: your_token_value

  - project-name: your_project_name
    project-id: your_project_id
    account-name: your_account_name
    account-id: your_account_id
    account-host: your_account_host
    token-name: your_token_name
    token-value: your_token_value
```

</File>

For example, if I had a Jaffle and wizard shop account, here's what my `dbt_cloud.yml` file would look like:

<File name="dbt_cloud.yml">

```yaml
version: "1"
context:
  active-host: "abc123.us1.dbt.com"
  active-project: "123456"
projects:
  - project-name: "Project 1"
    project-id: "123"
    account-name: "Jaffle and wizard shop" 
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"            # this would be a longer token value
  - project-name: "Project 2"
    project-id: "456"
    account-name: "Jaffle and wizard shop"
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"
  - project-name: "Project 3"
    project-id: "789"
    account-name: "Jaffle and wizard shop"
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"
```
</File>

### Field reference

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | The schema version of the file. Currently `"1"`. |
| `context.active-host` | Yes | The `account-host` to use by default. You can find it in the **Account settings** page. |
| `context.active-project` | Yes | The `project-id` of the project to use by default when running commands. Must match a `project-id` listed under `projects`. |
| `context.defer-env-id` | No | The environment ID to defer to for build artifacts. Optional override of the project's default deferral environment. <Constant name="platform_cli" /> only. Refer to [Configure deferral](/docs/platform/about-defer#configure-deferral-environment-id). |
| `projects.project-name` | Yes | A human-readable name for the project. |
| `projects.project-id` | Yes | The <Constant name="dbt_platform" /> project ID. Find it in the URL when viewing your project (for example, `…/projects/123456`). |
| `projects.account-name` | Yes | A human-readable name for the account. |
| `projects.account-id` | Yes | The <Constant name="dbt_platform" /> account ID. |
| `projects.account-host` | Yes | The host for your account, for example `cloud.getdbt.com`, `emea.dbt.com`, or your single-tenant access URL. |
| `projects.token-name` | Yes | A name for the [Personal access token (PAT)](/docs/dbt-apis/user-tokens). |
| `projects.token-value` | Yes | The PAT value. Treat this as a secret. |

## The dbt-cloud block in dbt_project.yml

The `dbt-cloud` block is a companion config that lives in your project's `dbt_project.yml` file (not in `dbt_cloud.yml`). It tells the <Constant name="platform_cli" />, the <Constant name="studio_ide" />, and <Constant name="fusion" /> which <Constant name="dbt_platform" /> project your local project corresponds to.

<File name="dbt_project.yml">

```yaml
name:
version:
# Your project configs...

dbt-cloud:
  project-id: your_project_id
  defer-env-id: '123456'  # optional
```

</File>

| Field | Required | Description |
|-------|----------|-------------|
| `project-id` | Yes | The <Constant name="dbt_platform" /> project ID this local project maps to. Find it in the URL when viewing your project (for example, `https://YOUR_ACCESS_URL/develop/26228/projects/123456` → `123456`). |
| `defer-env-id` | No | The environment ID to defer to for build artifacts. Used for <Constant name="fusion" /> [auto-deferral](/docs/platform/about-defer) and <Constant name="platform_cli" /> deferral overrides. |

## Related docs
- [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation)
- [dbt VS Code extension](/docs/about-dbt-extension)
- [`dbt_project.yml`](/reference/dbt_project.yml)
