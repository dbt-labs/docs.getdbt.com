---
title: "dbt Cloud API"
id: "cloud-api"
---

## Overview

Accounts on the _Team_ and _Enterprise_ plans can query the dbt Cloud APIs.

dbt Cloud provides two APIs.  

The [dbt Cloud Administrative API](/dbt-cloud/api) can be used to administrate a dbt Cloud account.

The [dbt Metadata API](https://metadata.cloud.getdbt.com/graphiql) can be used to fetch metadata related to the state and health of your dbt project.  

## How to Access the APIs

dbt Cloud supports two types of API Tokens: user tokens and service account tokens. Requests to the dbt Cloud APIs can be authorized using these tokens.

### dbt Cloud Administrative API
The dbt Cloud Administrative API is enabled by default. It can be used to:

- Download artifacts after a job has completed
- Kick off a job run from an orchestration tool
- Manage your dbt Cloud account
- and more

### dbt Cloud Metadata API

Every time that dbt Cloud runs a dbt project, it generates metadata which pertains to the accuracy, recency, configuration, and structure of the views and tables in the warehouse. dbt Cloud serves a GraphQL API which supports arbitrary queries over this metadata at [https://metadata.cloud.getdbt.com/graphiql](https://metadata.cloud.getdbt.com/graphiql), and this API is an incredibly rich resource for evaluating data health longitudinally or at a point in time.

#### Enabling the Metadata API
To enable the Metadata API, navigate to the Metadata page in Account Settings on dbt Cloud. From this page, you can enable the API. Note that you must have a service account token to access the Metadata API.
