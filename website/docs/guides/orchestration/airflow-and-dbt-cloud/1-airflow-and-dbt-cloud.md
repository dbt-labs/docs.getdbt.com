---
title: Airflow and dbt Cloud
id: 1-airflow-and-dbt-cloud
---

In some cases, [Airflow](https://airflow.apache.org/) may be the preferred orchestrator for your organization over working fully within dbt Cloud. There are a few reasons your team might be considering using Airflow to orchestrate your dbt jobs:

- Your team is already using Airflow to orchestrate other processes
- Your team needs to ensure that a [dbt job](https://docs.getdbt.com/docs/dbt-cloud/cloud-overview#schedule-and-run-dbt-jobs-in-production) kicks off before or after another process outside of dbt Cloud
- Your team needs flexibility to manage more complex scheduling, such as kicking off one dbt job only after another has completed
- Your team wants to own their own orchestration solution
- You need code to work right now without starting from scratch

## How are people using Airflow + dbt today?

### Airflow + dbt Core

There are [so many great examples](https://gitlab.com/gitlab-data/analytics/-/blob/master/dags/transformation/dbt_snowplow_backfill.py) from GitLab through their open source data engineering work. This is especially appropriate if you are well-versed in Kubernetes, CI/CD, and docker task management when building your airflow pipelines. If this is you and your team, you’re in good hands reading through more details [here](https://about.gitlab.com/handbook/business-technology/data-team/platform/infrastructure/#airflow) and [here](https://about.gitlab.com/handbook/business-technology/data-team/platform/dbt-guide/).

### Airflow + dbt Cloud API w/Custom Scripts

This has served as a bridge until the fabled Astronomer + dbt Labs-built dbt Cloud provider became generally available [here](https://registry.astronomer.io/providers/dbt-cloud?type=Sensors&utm_campaign=Monthly%20Product%20Updates&utm_medium=email&_hsmi=208603877&utm_content=208603877&utm_source=hs_email).

There are many different permutations of this over time:

- [Custom Python Scripts](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/archive/dbt_cloud_example.py): This is an airflow DAG based on [custom python API utilities](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/archive/dbt_cloud_utils.py)
- [Make API requests directly through the BashOperator based on the docs](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#operation/triggerRun): You can make cURL requests to invoke dbt Cloud to do what you want
- For more options, check out the [official dbt Docs](/docs/deploy/deployments#airflow) on the various ways teams are running dbt in airflow

## This guide's process

These solutions are great, but can be difficult to trust as your team grows and management for things like: testing, job definitions, secrets, and pipelines increase past your team’s capacity. Roles become blurry (or were never clearly defined at the start!). Both data and analytics engineers start digging through custom logging within each other’s workflows to make heads or tails of where and what the issue really is. Not to mention that when the issue is found, it can be even harder to decide on the best path forward for safely implementing fixes. This complex workflow and unclear delineation on process management results in a lot of misunderstandings and wasted time just trying to get the process to work smoothly!

### A better way

After today’s walkthrough, you’ll get hands-on experience:

1. Creating a working local Airflow environment
2. Invoking a dbt Cloud job with Airflow (with proof!)
3. Reusing tested and trusted Airflow code for your specific use cases

While you’re learning the ropes, you’ll also gain a better understanding of how this helps to:

- Reduce the cognitive load when building and maintaining pipelines
- Avoid dependency hell (think: `pip install` conflicts)
- Implement better recoveries from failures
- Define clearer workflows so that data and analytics engineers work better, together ♥️

### Prerequisites

- [dbt Cloud Teams or Enterprise account](https://www.getdbt.com/pricing/) (with [admin access](https://docs.getdbt.com/docs/cloud/manage-access/enterprise-permissions)) in order to create a service token. Permissions for service tokens can be found [here](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- A [free Docker account](https://hub.docker.com/signup) in order to sign in to Docker Desktop, which will be installed in the initial setup.
- A local digital scratchpad for temporarily copy-pasting API keys and URLs

🙌 Let’s get started! 🙌
