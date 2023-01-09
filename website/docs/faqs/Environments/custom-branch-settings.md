---
title: How do I use the `Custom Branch` settings in a dbt Cloud Environment?
description: "Use custom code from your repository"
sidebar_label: 'Custom Branch settings'
id: custom-branch-settings
---
dbt Cloud environments allow users to specify custom git settings to use different versions of their dbt project repositories other than their default branch. After checking off the `Only run on a custom branch` checkbox in the `General Settings` section of the environment settings page, users can specify the particular **branch name or tag** in the`Custom Branch` setting that dbt will use when executing in that environment. Depending on the type of environment, this setting will have slightly different effects.

## In development

In a development environment, dbt Cloud will reference the default branch in connected repositories (most commonly the `main` branch) in the IDE as the read only brnach that developers will create development branches from. The `Custom Branch` setting overrides that behavior if there is another branch that should be used. Users will not be able to make commits to the branch specified by this setting.  

For example, you can use the `develop` branch of a connected repository. Edit an environment, then in "General settings" select  **Only run on a custom branch** , and in "Custom branch" type **develop** or the name of your custom branch.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dev-environment-custom-branch.png" title="Configuring a custom base repository branch"/>

## In deployment

When running jobs in a deployment environment, dbt will clone your project from your connected repository before executing your models. By default, dbt will pull from the default branch of your repository (most commonly the `main` branch). To control which version of your project is executed during job runs for a particular environment you can edit the `Custom Branch` setting as above to specify a different version of the project. Accepted values for this setting are **a branch name or a tag name.**