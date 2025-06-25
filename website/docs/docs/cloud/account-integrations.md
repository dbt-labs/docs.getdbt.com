---
title: "Account integrations in dbt"
sidebar_label: "Account integrations" 
description: "Learn how to configure account integrations for your dbt account."
---

The following sections describe the different **Account integrations** available from your <Constant name="cloud" /> account under the account **Settings** section.

<Lightbox src="/img/docs/dbt-cloud/account-integrations.jpg" title="Example of Account integrations from the sidebar" /> 

## Git integrations

Connect your <Constant name="cloud" /> account to your <Constant name="git" /> provider to enable <Constant name="cloud" /> users to authenticate your personal accounts. <Constant name="cloud" /> will perform <Constant name="git" /> actions on behalf of your authenticated self, against repositories to which you have access according to your <Constant name="git" /> provider permissions.

To configure a <Constant name="git" /> account integration:
1. Navigate to **Account settings** in the side menu.
2. Under the **Settings** section, click on **Integrations**.
3. Click on the <Constant name="git" /> provider from the list and select the **Pencil** icon to the right of the provider.
4. <Constant name="cloud" /> [natively connects](/docs/cloud/git/git-configuration-in-dbt-cloud) to the following <Constant name="git" /> providers:

   - [GitHub](/docs/cloud/git/connect-github)
   - [GitLab](/docs/cloud/git/connect-gitlab)
   - [Azure DevOps](/docs/cloud/git/connect-azure-devops) <Lifecycle status="managed,managed_plus" />

You can connect your <Constant name="cloud" /> account to additional <Constant name="git" /> providers by importing a git repository from any valid git URL. Refer to [Import a git repository](/docs/cloud/git/import-a-project-by-git-url) for more information.

<Lightbox src="/img/docs/dbt-cloud/account-integration-git.jpg" width="85%" title="Example of the Git integration page" />

## OAuth integrations

Connect your <Constant name="cloud" /> account to an OAuth provider that are integrated with <Constant name="cloud" />. 

To configure an OAuth account integration:
1. Navigate to **Account settings** in the side menu.
2. Under the **Settings** section, click on **Integrations**.
3. Under **OAuth**, click on **Link** to [connect your Slack account](/docs/deploy/job-notifications#set-up-the-slack-integration).
4. For custom OAuth providers, under **Custom OAuth integrations**, click on **Add integration** and select the [OAuth provider](/docs/cloud/manage-access/sso-overview) from the list. Fill in the required fields and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/account-integration-oauth.jpg" width="85%" title="Example of the OAuth integration page" />

:::info

We’ve moved the AI integrations section to [Enable dbt Copilot](/docs/cloud/enable-dbt-copilot#ai-integrations).

:::
