---
title: "dbt_cloud.yml file"
id: dbt_cloud.yml
sidebar_label: "dbt_cloud.yml"
description: "Reference for the dbt_cloud.yml credentials file used by the dbt CLI and dbt VS Code extension to connect to the dbt platform."
pagination_next: null
---

The `dbt_cloud.yml` file stores the credentials that dbt tools — including the <Constant name="platform_cli" />, the [dbt VS Code extension](/docs/about-dbt-extension), and more — use to authenticate with the <Constant name="dbt_platform" />. You download it from the <Constant name="dbt_platform" /> and save it locally to your `.dbt` directory.

This page covers:

- [Where the file lives and how to set up the `.dbt` directory](#file-location-and-dbt-directory-setup)
- [How to download it](#download-dbt_cloudyml) for the dbt CLI or the VS Code extension
- [The file structure](#file-structure) and field reference
- [The companion `dbt-cloud` block](#the-dbt-cloud-block-in-dbt_projectyml) in `dbt_project.yml`

## File location and `.dbt` directory setup

import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

Save your `dbt_cloud.yml` file in the `.dbt` directory:

- **Mac or Linux**: `~/.dbt/dbt_cloud.yml`
- **Windows**: `C:\Users\yourusername\.dbt\dbt_cloud.yml`

:::warning Keep this file safe
The `dbt_cloud.yml` file contains API keys. Store it securely and do not commit it to version control.
:::

If you don't have a `.dbt` directory yet, or need to move the file after downloading, follow these steps:

<DbtDirectoryFaq />

If your downloaded file has a numerical suffix (for example, `dbt_cloud(2).yml`), rename it to `dbt_cloud.yml` before moving it. The dbt CLI and extension only look for the exact filename.

## Download `dbt_cloud.yml`

How you download the file depends on whether you're configuring the <Constant name="platform_cli" /> or the [dbt VS Code extension](/docs/about-dbt-extension).

### For the dbt CLI

1. In <Constant name="dbt_platform" />, select the project you want to configure with the <Constant name="platform_cli" />. The project must already have a [development environment](/docs/dbt-cloud-environments#create-a-development-environment) set up.
2. From the main menu, go to **CLI**.
3. In the **Configure Cloud authentication** section, click **Download CLI configuration file** to download your `dbt_cloud.yml` credentials file.

    <details>
    <summary>Region URLs to download credentials</summary>

    You can also download the credentials from the links provided based on your region:

    - North America: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a href="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - North American Cell 1: <code>https://ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Single-tenant: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

4. Save the file to your [`.dbt` directory](#file-location).

### For the dbt VS Code extension

1. In <Constant name="dbt_platform" />, go to **Account settings** → **Your profile** → **VS Code Extension**.
2. Click **Download credentials**. The downloaded `dbt_cloud.yml` includes your [Personal access token (PAT)](/docs/dbt-apis/user-tokens).
3. Save the file to your [`.dbt` directory](#file-location). This registers and connects the extension to <Constant name="dbt_platform" /> and enables platform features such as <Constant name="mesh" /> and deferral.
4. Confirm that the `project-id` in your [`dbt_project.yml` `dbt-cloud` block](#the-dbt-cloud-block-in-dbt_projectyml) matches the project you're working on.

## File structure

A `dbt_cloud.yml` file looks like this:

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

### Field reference

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | The schema version of the file. Currently `"1"`. |
| `context.active-project` | Yes | The `project-id` of the project to use by default when running commands. Must match a `project-id` listed under `projects`. |
| `context.active-host` | Yes | The `account-host` to use by default (for example, `cloud.getdbt.com`). |
| `context.defer-env-id` | No | The environment ID to defer to for build artifacts. Optional override of the project's default deferral environment. <Constant name="platform_cli" /> only. Refer to [Configure deferral](/docs/platform/about-cloud-develop-defer#configure-deferral-environment-id). |
| `projects[].project-name` | Yes | A human-readable name for the project. |
| `projects[].project-id` | Yes | The <Constant name="dbt_platform" /> project ID. Find it in the URL when viewing your project (for example, `…/projects/123456`). |
| `projects[].account-name` | Yes | A human-readable name for the account. |
| `projects[].account-id` | Yes | The <Constant name="dbt_platform" /> account ID. |
| `projects[].account-host` | Yes | The host for your account, for example `cloud.getdbt.com`, `emea.dbt.com`, or your single-tenant access URL. |
| `projects[].token-name` | Yes | A name for the [Personal access token (PAT)](/docs/dbt-apis/user-tokens). |
| `projects[].token-value` | Yes | The PAT value. Treat this as a secret. |

## The `dbt-cloud` block in `dbt_project.yml`

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
| `defer-env-id` | No | The environment ID to defer to for build artifacts. Used for <Constant name="fusion" /> [auto-deferral](/docs/platform/about-cloud-develop-defer) and <Constant name="platform_cli" /> deferral overrides. |

