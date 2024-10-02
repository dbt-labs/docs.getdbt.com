---
title: "Model notifications"
description: "Receive notifications about failures with your models. "
---

# Model notifications <Lifecycle status="beta" />

Set up dbt to notify the appropriate owners &mdash; through Slack, email, or both &mdash; about any failures your models have encountered. When models fail, your reports are no longer accurate and the data can no longer be trusted so it's important to resolve these failures quickly.

To be timely and keep the number of notifications to a reasonable amount, dbt observes the following guidelines when notifying the model owners:  

- For the first model that fails, send a notification to each unique model owner. This means that each owner receives only one notification, the initial one.
- Don't send any notifications about subsequent model failures while a dbt job is still running.
- At the end of a job run, send a recap notification that lists all the models that failed where the user is listed as an owner.

Create configuration YAML files in your project for dbt to send notifications about the failures with your models.

## Prerequisites

## Configure groups

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