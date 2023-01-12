---
title: How do I use the `Custom Branch` settings in a dbt Cloud Environment?
description: "Use custom code from your repository"
sidebar_label: 'Custom Branch settings'
id: custom-branch-settings
---

In dbt Cloud environments, you can change your git settings to use a different branch in your dbt project repositories besides the default branch. When you make this change, you run dbt on a custom branch. When specified, dbt Cloud executes models using the custom branch setting for that environment. Development and deployment environments have slightly different effects.

To specify a custom branch:
1. Edit an existing environment or create a new one
2. Select **Only run on a custom branch** under General Settings
3. Specify the **branch name or tag**


## Development

In a development environment, the default branch (commonly the `main` branch) is a read-only branch found in the IDE's connected repositories, which you can use to create development branches. Identifying a custom branch overrides this default behavior. Instead, your custom branch becomes read-only and can be used to create development branches. You will no longer be able to make commits to the custom branch from within the dbt Cloud IDE.

For example, you can use the `develop` branch of a connected repository. Edit an environment, then in "General settings" select  **Only run on a custom branch** , and in "Custom branch" type **develop** or the name of your custom branch.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dev-environment-custom-branch.png" title="Configuring a custom base repository branch"/>

## Deployment

When running jobs in a deployment environment, dbt will clone your project from your connected repository before executing your models. By default, dbt will pull from the default branch of your repository (most commonly the `main` branch). To control which version of your project is executed during job runs for a particular environment you can edit the `Custom Branch` setting as above to specify a different version of the project. Accepted values for this setting are **a branch name or a tag name.**