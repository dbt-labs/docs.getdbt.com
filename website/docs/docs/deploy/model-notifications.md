---
title: "Model notifications"
description: "While a job is running, receive email notifications in real time about any issues with your models and tests. "
---

# Model notifications <Lifecycle status="beta" />

Set up dbt to notify the appropriate model owners through email about issues as soon as they occur, while the job is still running. Model owners can specify which statuses to receive notifications about: 

- `Success` and `Fails` for models
- `Warning`, `Success`, and `Fails` for tests

With model-level notifications, model owners can be the first ones to know about issues before anyone else (like the stakeholders). 

:::info Beta feature

This feature is currently available in [beta](/docs/dbt-versions/product-lifecycles#dbt-cloud) to a limited group of users and is gradually being rolled out. If you're in the beta, please contact the Support team at support@getdbt.com for assistance or questions.

:::

To be timely and keep the number of notifications to a reasonable amount when multiple models or tests trigger them, dbt observes the following guidelines when notifying the owners:  

- Send a notification to each unique owner/email during a job run about any models (with status of failure/success) or tests (with status of warning/failure/success). Each owner receives only one notification, the initial one.
- Don't send any notifications about subsequent models or tests while a dbt job is still running.
- At the end of a job run, each owner receives a notification, for each of the statuses they specified to be notified about, with a list of models and tests that have that status. 

Create configuration YAML files in your project for dbt to send notifications about the status of your models and tests.

## Prerequisites
- Your dbt Cloud administrator has [enabled the appropriate account setting](#enable-access-to-model-notifications) for you.
- Your environment(s) must be on ["Versionless"](/docs/dbt-versions/versionless-cloud). 


## Configure groups

Add your group configuration in either the `dbt_project.yml` or `groups.yml` file. For example: 

```yml
version: 2

groups:
  - name: finance
    description: "Models related to the finance department"
    owner:
      # 'name' or 'email' is required
      name: "Finance Team"
      email: finance@dbtlabs.com
      slack: finance-data

  - name: marketing
    description: "Models related to the marketing department"
    owner:
      name: "Marketing Team"
      email: marketing@dbtlabs.com
      slack: marketing-data
```

## Set up models

Set up your model configuration in either the `dbt_project.yml` or `groups.yml` file; doing this automatically sets up notifications for tests, too. For example: 

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

## Enable access to model notifications 

Provide dbt Cloud account members the ability to configure and receive alerts about issues with models or tests that are encountered during job runs.  

To use model-level notifications, your dbt Cloud account must have access to the feature. Ask your dbt Cloud administrator to enable this feature for account members by following these steps:

1. Navigate to **Notification settings** from your profile name in the sidebar (lower left-hand side). 
1. From **Email notications**, enable the setting **Enable group/owner notifications on models** under the **Model notifications** section. Then, specify which statuses to receive notifications about (Success, Warning, and/or Fails). 

  <Lightbox src="/img/docs/dbt-cloud/example-enable-model-notifications.png" title="Example of the setting Enable group/owner notifications on models" /> 
