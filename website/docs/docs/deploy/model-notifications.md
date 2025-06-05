---
title: "Model notifications"
description: "While a job is running, receive email notifications in real time about any issues with your models and tests. "
intro_text: "Set up dbt to notify model owners through email about issues in your deployment environments."
---

Configure dbt to send email notifications to model owners about issues in deployment [environments](/docs/dbt-cloud-environments#types-of-environments) as soon as they happen &mdash; while the job is still running. Model owners can specify which statuses to receive notifications about:

- `Success` and `Fails` for models
- `Warning`, `Success`, and `Fails` for tests

With model-level notifications, model owners can be the first ones to know about issues before anyone else (like the stakeholders). 

To be timely and keep the number of notifications to a reasonable amount when multiple models or tests trigger them, dbt observes the following guidelines when notifying the owners:  

- Send a notification to each unique owner/email during a job run about any models (with status of failure/success) or tests (with status of warning/failure/success). Each owner receives only one notification, the initial one.
- No notifications sent about subsequent models or tests while a dbt job is still running.
- Each owner/user who subscribes to notifications for one or more statuses (like failure, success, warning) will receive only _one_ email notification at the end of the job run.
- The email includes a consolidated list of all models or tests that match the statuses the user subscribed to, instead of sending separate emails for each status.

Create configuration YAML files in your project for dbt to send notifications about the status of your models and tests in your deployment environments.

## Prerequisites
- Your <Constant name="cloud" /> administrator has [enabled the appropriate account setting](#enable-access-to-model-notifications) for you.
- Your deployment environment(s) must be on a [release track](/docs/dbt-versions/cloud-release-tracks) instead of a legacy <Constant name="core" /> version.

## Configure groups

Define your [groups](/docs/build/groups) in any `.yml` file in your [models directory](/reference/project-configs/model-paths). Each group's owner can now specify one or multiple email addresses to receive model-level notifications.

The `email` field supports a single email address as a string or a list of multiple email addresses.

The following example shows how to define groups in a `groups.yml` file.

<File name='models/groups.yml'>

```yml
version: 2

groups:
  - name: finance
    owner:
      # Email is required to receive model-level notifications, additional properties are also allowed.
      name: "Finance team"
      email: finance@dbtlabs.com
      favorite_food: donuts

  - name: marketing
    owner:
      name: "Marketing team"
      email: marketing@dbtlabs.com
      favorite_food: jaffles

# Example of multiple emails supported
  - name: docs
    owner:
      name: "Documentation team"
      email: 
        - docs@dbtlabs.com
        - community@dbtlabs.com
        - product@dbtlabs.com
      favorite_food: pizza

```

</File>

:::tip
The `owner` key is flexible and accepts arbitrary inputs in addition to the required `email` field. For example, you could include a custom field like `favorite_food` to add context about the team.
:::

## Attach groups to models

Attach groups to models as you would any other config, in either the `dbt_project.yml` or `whatever.yml` files. For example: 

<File name='models/marts.yml'>

```yml
version: 2

models:
  - name: sales
    description: "Sales data model"
    config:
      group: finance

  - name: campaigns
    description: "Campaigns data model"
    config:
      group: marketing

```
</File>

By assigning groups in the `dbt_project.yml` file, you can capture all models in a subdirectory at once. 

In this example, model notifications related to staging models go to the data engineering group, `marts/sales` models to the finance team, and `marts/campaigns` models to the marketing team.

<File name='dbt_project.yml'>

```yml
config-version: 2
name: "jaffle_shop"

[...]

models:
  jaffle_shop:
    staging:
      +group: data_engineering
    marts:
      sales:
        +group: finance
      campaigns:
        +group: marketing
    
```

</File>
Attaching a group to a model also encompasses its tests, so you will also receive notifications for a model's test failures. 

## Enable access to model notifications 

Provide <Constant name="cloud" /> account members the ability to configure and receive alerts about issues with models or tests that are encountered during job runs.  

To use model-level notifications, your <Constant name="cloud" /> account must have access to the feature. Ask your <Constant name="cloud" /> administrator to enable this feature for account members by following these steps:

1. Navigate to **Notification settings** from your profile name in the sidebar (lower left-hand side). 
1. From **Email notifications**, enable the setting **Enable group/owner notifications on models** under the **Model notifications** section. Then, specify which statuses to receive notifications about (Success, Warning, and/or Fails). 

  <Lightbox src="/img/docs/dbt-cloud/example-enable-model-notifications.png" title="Example of the setting Enable group/owner notifications on models" /> 
