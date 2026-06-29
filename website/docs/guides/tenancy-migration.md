---
title: 'Migrate between dbt platform tenancy types'
id: tenancy-migration
description: "A self-serve guide for migrating between dbt platform tenancy types, such as moving from multi-tenant to single-tenant."
hoverSnippet: "Self-serve guide for migrating between dbt platform tenancy types."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'Tenancy', 'dbt platform']
keywords: ['tenancy migration', 'multi-tenant', 'single tenant', 'MT to ST', 'migrate tenant', 'cell-based']
level: 'Advanced'
unlisted: true
---

:::warning Contract change required
Migrating between tenancy types requires a contract change.

Make sure you contact your account manager before starting this process to confirm eligibility, timeline, and initiate the necessary contract updates. _Do not_ begin migration steps until a contract change is confirmed.
:::

## Overview

This guide walks you through a self-serve migration between [<Constant name="dbt_platform"/> tenancy types](/docs/platform/about-platform/tenancy) &mdash; for example, moving from multi-tenant to single-tenant.

It's meant for accounts that have been assessed by the dbt Labs team as low complexity. Your dbt Labs contact will provide a migration window before you begin &mdash; do not start until you've received it.

Use the following table to confirm this guide is the right path for your account. If your account crosses the high-complexity threshold for even one signal, we recommend a Professional Services-led migration instead.

<SimpleTable>

| Signal | Low complexity (self-serve) | High complexity (PS-led) |
|--------|----------------------------|--------------------------|
| Active jobs (run in last 30 days) | Fewer than 10 | 10 or more |
| Projects | Fewer than 3 | 3 or more |
| Environments | Fewer than 5 | 5 or more |
| **How to proceed** | If all signals are low complexity, follow this guide or contact  [Professional Services migration](https://www.getdbt.com/services) for help | If one or more signals are high complexity, contact your account manager to scope a [Professional Services migration](https://www.getdbt.com/services) |

</SimpleTable>

The following factors add coordination overhead regardless of account size &mdash; flag these to your account manager if they apply:

- CI or webhook-triggered jobs
- SSO or SCIM provisioning
- Privatelink endpoints
- Multiple warehouse connection types

### Related docs

- [Tenancy](/docs/platform/about-platform/tenancy)
- [Access, regions, and IP addresses](/docs/platform/about-platform/access-regions-ip-addresses)

## What doesn't migrate automatically

The migration tool automates most configuration, but some things require manual setup after you apply the Terraform configuration.

**Credentials and secrets** &mdash; these must be recreated manually:

- SSH keys and repository credentials
- Service account tokens
- Environment variables containing secrets
- Warehouse connections and environment-level credentials
- dbt platform profiles

**Project data** &mdash; not transferred:

- Job run history, artifacts, and logs

**User management** &mdash; requires manual verification:

- Users must already exist in the target account
- Permissions must be manually verified after migration
- SSO, keypairs, and warehouse authentication credentials must be reconfigured

**Unsupported resources:**

- PrivateLink endpoints require assistance from the dbt Labs infrastructure team &mdash; [open a support ticket](https://www.getdbt.com/support)

## Prerequisites

Before starting your migration, confirm the following:

- A contract change has been initiated and confirmed with your account manager
- You have received a migration window from the dbt Labs Support team
- You have admin access to both the source and target <Constant name="dbt_platform"/> accounts
- The target account is provisioned in the new environment
- You have a service token with Account Admin permissions on the source account

## Migration steps

This migration uses two open-source tools:

- [<Constant name="dbt_platform"/> migration tool](https://github.com/dpguthrie/dbt-cloud-migration-tool) &mdash; exports your source account configuration and applies it to the target account via Terraform
- [dbtcloud-terraforming](https://github.com/dbt-labs/dbtcloud-terraforming) &mdash; generates Terraform HCL from an existing <Constant name="dbt_platform"/> account

:::info
Credentials, secrets, and some other items don't migrate automatically &mdash; plan to recreate them manually. Refer to [What doesn't migrate automatically](#what-doesnt-migrate-automatically) for the full list.
:::

<Tabs>
<TabItem value="mac-linux" label="Mac/Linux">

### Step 1: Install prerequisites

You need Python, Terraform, and `dbtcloud-terraforming`. Install them using any method you prefer &mdash; we use Homebrew as an example here.

Create and activate a Python virtual environment:

```shell
python3 -m venv tf_acct_migrator_env
source tf_acct_migrator_env/bin/activate
```

Install Terraform:

```shell
brew tap hashicorp/tap && brew install hashicorp/tap/terraform
```

Install `dbtcloud-terraforming`:

```shell
brew install dbt-labs/dbt-cli/dbtcloud-terraforming
```

### Step 2: Set up the migration tool

Clone the migration tool repo and navigate into it:

```shell
git clone https://github.com/dpguthrie/dbt-cloud-migration-tool
cd dbt-cloud-migration-tool
```

Set environment variables for your source <Constant name="dbt_platform"/> account:

```shell
export DBT_CLOUD_HOST_URL="https://YOUR_SOURCE_REGION.getdbt.com/api"
export DBT_CLOUD_TOKEN="your_source_service_token"
export DBT_CLOUD_ACCOUNT_ID="your_source_account_id"
```

### Step 3: Generate and apply Terraform configuration

Run the migration tool to generate a `resources.tf` file with your source account's resources:

```shell
sh migrate.sh
```

Copy the example vars file and add your target account's details:

```shell
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your target account details
```

Apply the configuration to your target account:

```shell
terraform init
terraform plan
terraform apply
```

Terraform will output the newly created resources and any warnings or errors. You may need to re-run `migrate.sh` multiple times to catch all required resource types.

</TabItem>
<TabItem value="windows" label="Windows">

### Step 1: Install prerequisites

You need Python, Terraform, and `dbtcloud-terraforming`. Install them using any method you prefer &mdash; we use Chocolatey as an example here.

Install Python and Terraform:

```shell
choco install python terraform -y
```

After installation, restart your terminal and verify:

```shell
python --version
terraform --version
```

Install `dbtcloud-terraforming` by adding it to your Terraform installation directory. If you used Chocolatey, the path is typically `C:\ProgramData\chocolatey\bin`.

### Step 2: Set up the migration tool

The following steps should be run in a bash environment (for example, Git Bash). Clone the migration tool repo and navigate into it:

```shell
git clone https://github.com/dpguthrie/dbt-cloud-migration-tool.git
cd dbt-cloud-migration-tool
```

### Step 3: Configure and run the migration

Set environment variables for your source <Constant name="dbt_platform"/> account (these reset when you close the terminal):

```shell
export DBT_CLOUD_HOST_URL="https://YOUR_SOURCE_REGION.getdbt.com/api"
export DBT_CLOUD_TOKEN="your_source_service_token"
export DBT_CLOUD_ACCOUNT_ID="your_source_account_id"
```

Run the migration script:

```shell
sh migrate.sh
```

Copy the example vars file and add your target account's details:

```shell
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your target account details
```

Apply the configuration to your target account:

```shell
terraform init
terraform plan
terraform apply
```

Terraform will output the newly created resources and any warnings or errors. You may need to re-run `migrate.sh` multiple times to catch all required resource types.

</TabItem>
</Tabs>

## Post-migration checklist

- [ ] Verify all connections, permissions, and secrets in the target account
- [ ] Run test jobs to confirm end-to-end functionality
- [ ] Confirm IP allowlist and network settings are updated for the new tenant
- [ ] Update internal bookmarks, SSO configurations, and API integrations to the new account URL
