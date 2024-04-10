---
title: "Maximum override: Configuring unique connections in dbt Cloud"
description: ""
slug: configuring-unique-connections-in-dbt-cloud

authors: [gwen_windflower]

tags: []
hide_table_of_contents: false

date: 2024-04-10
is_featured: true
---

dbt Cloud has a suite of new features that enable configuring precise and unique connections to data platforms at the Environment and User level. These enable more sophisticated setups, like connecting a project to multiple warehouse accounts, first class support for Staging environments, and User-level overrides for specific dbt versions. These give dbt Cloud developers the features they need to fully support Write-Audit-Publish workflows and safely test upgrading dbt versions. While you still configure a default connection at the Project level and per-developer, you now have tools to get more advanced in a secure way. Soon, dbt Cloud will take this even further allowing multiple connections to be set globally and reused via Global Connections.

The first new feature we’re going to look at is called Extended Attributes.

## Profile pick

Extended Attributes are a tool that brings the flexibility of dbt Core’s `profiles.yml` configuration to dbt Cloud. Before Extended Attributes, you configured a project-level connection, and were mostly stuck with it. You could develop and orchestrate into different schemas to keep development work away from production, or configure a staging layer with manual workarounds, but beyond that things got more challenging. By borrowing the flexibility of `profiles.yml`, which allows configuring as many unique connections as you want, you can now do the same with the security and orchestration tools in dbt Cloud.

## How Extended Attributes Work

Extended Attributes are a textbox on the Environment settings page, where you can input `profiles.yml` type configurations. When developing in the dbt Cloud IDE, dbt Cloud CLI, or orchestrating job runs, dbt Cloud will parse through the provided Extended Attributes YAML and merge it with your base project connection settings. If the attribute exists in another source (at present this would typically be your project connection settings), it will _replace_ its value, including overriding any custom environment variables. If the attribute doesn't exist, it will add the attribute to the connection profile. You can check out the documentation for more specific details, but now that you’ve got the basic idea, let’s dive into some examples to see why this is so cool.

## Multiple accounts for Development and Production environments

The most pressing use case for dbt Cloud users is the ability to use different account connections for different teams or development stages in their pipelines. Let’s consider a team that has a typical dev, staging, production setup: development for active work with small datasets, staging to promote and vet changes against cloned production data, and production for the final deployed code that feeds BI tools. For this team though, these are separate _accounts_ in their data platform with their own sets of RBAC and other settings. This is a perfect use case for extended attributes. Let’s take a look at how they might set this up:

![At the bottom of environments’ Settings you’ll find the Extended Attributes text box.](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/1271fabe-2804-4912-80d1-f03e3950b0ff/Screenshot_2024-04-02_at_10.17.59_AM.png)

At the bottom of environments’ Settings you’ll find the Extended Attributes text box.

### Development

```yaml
account: 123dev
schema: dbt_winnie
# ...auth
threads: 1
```

### Staging

```yaml
account: 123dev
schema: staging
# ...auth
threads: 8
```

### Production

```yaml
account: 456prod
schema: analytics
# ...auth
threads: 8
```

With this setup, we have a separate account for development work, using individual development schemas for each developer (with a single thread so that the development build logs are easier to read), and a shared `staging` schema for the Staging environment. In the database we can then configure RBAC to only allow building into the Staging schema from jobs that use the Staging environment.

Production is then pointed to a completely separate account that is only writable from Production environment builds and readable from the BI tool.

It’s really that simple. This works with PrivateLink connections as well on AWS. So while you have 1 project connection that is the _default_, you can still configure unique connections securely per Environment.

## All the world a Stage

dbt Cloud now also provides first-class support for Staging environments. When you can configure an Environment as a Staging type, you’ll unlock the ability to defer to _that_ Environment for Development work. This fully enables a proper Write-Audit-Publish flow, where Development work is built against and promoted to Staging before being merged into a Production branch when releases have been tested.

All you need to do is configure an Environment as Staging, and toggle the control in the dbt Cloud IDE to “Defer to staging/production”. This will favor a Staging environment over Prod if you have one set up.

![](/img/blog/2024-04-05-extended-attributes/defer-to-staging.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/504c8d57-f3b6-4b96-8144-23fc38f8d1ad/Untitled.png)

## Upgrading on a curve

Lastly let’s consider a more specialized use case. Imagine we have a ‘tiger team’ of developers (consisting of a lone analytics engineer named Dave) tasked with upgrading from dbt version 1.6 to the new ‘Keep on latest version’ setting, to take advantage of added stability and feature access. We want to keep the rest of the data team being productive in dbt 1.6, while enabling Dave to upgrade and do his work in the new versionless mode.

### The Development Environment

![The Development Environment is configured to be 1.6 by default.](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/dae28c71-4087-4714-8936-dc297ce3ce64/Screenshot_2024-04-02_at_10.25.07_AM.png)

The Development Environment is configured to be 1.6 by default.

### Dave’s Development connection settings

![Screenshot 2024-04-02 at 10.32.38 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/0d753fe2-011c-4e65-a464-024fe58e0a96/Screenshot_2024-04-02_at_10.32.38_AM.png)

## Launch Special

Each connection you make from every environment is now unique. You can deploy, develop, and test your data with a setup that molds to your organization, not to what’s available in dbt Cloud. Whether you’re looking to create advanced, layered environments to launch new models safely, or enable greater independence between developers, dbt Cloud extends to support what you need.
