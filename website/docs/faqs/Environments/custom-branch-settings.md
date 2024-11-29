---
title: How do I use the 'Custom Branch' settings in a dbt Cloud Environment?
description: "Use custom code from your repository"
sidebar_label: 'Custom branch settings'
id: custom-branch-settings
---

In dbt Cloud environments, you can change your git settings to use a different branch in your dbt project repositories besides the default branch. When you make this change, you run dbt on a custom branch. When specified, dbt Cloud executes models using the custom branch setting for that environment. Development and deployment environments have slightly different effects.

To specify a custom branch:
1. Edit an existing environment or create a new one
2. Select **Only run on a custom branch** under General Settings
3. Specify the **branch name or tag**

## Development

In a development environment, the primary branch (usually named `main`) is protected in your connected repositories. You can directly edit, format, or lint files and execute dbt commands in your protected default git branch. Since the dbt Cloud IDE prevents commits to the protected branch, you can commit those changes to a new branch when you're ready.

Specifying a **Custom branch** overrides the default behavior. It makes the custom branch protected and enables you to create new development branches from it. You can directly edit, format, or lint files and execute dbt commands in your custom branch, but you cannot make commits to it. dbt Cloud prompts you to commit those changes to a new branch.

Only one branch can be protected. If you specify a custom branch, the primary branch is no longer protected.  If you want to protect the primary branch and prevent any commits on it, you need to set up branch protection rules in your git provider settings. This ensures your primary branch remains secure and no new commits can be made to it.

For example, if you want to use the `develop` branch of a connected repository:

- Go to an environment and select **Settings** to edit it
- Select  **Only run on a custom branch** in **General settings**
- Enter **develop** as the name of your custom branch
- Click **Save**

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dev-environment-custom-branch.png" width="100%" title="Configuring a custom base repository branch"/>

## Deployment

When running jobs in a deployment environment, dbt will clone your project from your connected repository before executing your models. By default, dbt uses the default branch of your repository (commonly the `main` branch). To specify a different version of your project for dbt to execute during job runs in a particular environment, you can edit the Custom Branch setting as shown in the previous steps. 
