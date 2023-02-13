---
title: "Introducing the dbt Cloud API Postman Collection: a tool to help you scale your account management"
description: "Discover powerful dbt Cloud endpoints with this postman collection put together by Solution Architect Matt Winkler."
slug: dbt-cloud-api-postman-collection-announcement

authors: [matt_winkler]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-05-10
is_featured: true
---
>:question: Who is this for:
>This is for advanced users of dbt Cloud that are interested in expanding their knowledge of the dbt API via an interactive Postman Collection. We only suggest diving into this once you have a strong knowledge of dbt + dbt Cloud. You have a couple of options to review the collection:
>
>* get a live version of the collection via [![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/14183654-892ae7dc-e6a2-4165-8b57-1545dd69e4aa?action=collection%2Ffork&collection-url=entityId%3D14183654-892ae7dc-e6a2-4165-8b57-1545dd69e4aa%26entityType%3Dcollection%26workspaceId%3D048d09df-b9b5-4794-ad11-d0453ec3ecc4).
>* check out the [collection documentation](https://documenter.getpostman.com/view/14183654/UyxohieD#93c57cbf-3cb9-4c14-8c9a-278c19c5d6f1) to learn how to use it.

The dbt Cloud API has well-documented endpoints for creating, triggering and managing dbt Cloud jobs. But there are other endpoints that aren’t well documented yet, and they’re extremely useful for end-users. These endpoints exposed by the API enable organizations not only to orchestrate jobs, but to manage their dbt Cloud accounts programmatically. This creates some really interesting capabilities for organizations to scale their dbt Cloud implementations.

The main goal of this article is to spread awareness of these endpoints as the docs are being built & show you how to use them. 

<!--truncate-->

You can use this blog post as an entry point to this [postman collection](https://documenter.getpostman.com/view/14183654/UVsSNiXC#auth-info-7ad22661-8807-406b-aec0-34a46b671aac) to help you automate previously manual tasks, such as managing dbt Cloud account infrastructure, creating dbt Cloud projects, database connections, and managing users.

Please keep in mind that the collection is not an evergreen doc. We are actively developing and updating the API endpoints used to interact with dbt Cloud, so endpoint urls and / or expected request formats may change. Each endpoint in the collection provides comment capabilities, so please notify us there if something looks amiss.

With all of that being said, why should dbt users care about automating dbt Cloud account management?

## What problems does programmatic dbt Cloud account management solve?

When first learning dbt Cloud and operating at a smaller scale, most end users tend to favor manual, GUI based workflows for creating and managing their account infrastructure. Many of our customers start off this way, but they usually end up running into these bottlenecks as the number of jobs and projects multiplies. Here are some examples of the kind of bottlenecks I hear our growing customers talk about.

- “I find myself wasting time manually clicking through the UI to manage infrastructure, especially after deploying more than a handful of projects and environments.”
- “I don’t have peace of mind that my production environment is configured exactly as intended. If a new team member deletes or changes something, I have to run a fire drill to fix it.”
- “My organization requires me to run any environmental configuration changes through code review and version control.”

We usually advise our customers to leverage API requests to automate these typically manual tasks, and you should, too!

## Closing Thoughts

Beyond the day-to-day process of managing their dbt Cloud accounts, many organizations benefit from being able to quickly replicate environments as they experiment with new dbt features and development patterns. Governance is another benefit of managing infrastructure in code, as resource definitions can be version controlled and inspected by the relevant teams before changes go live. These concepts are high on our minds as we look to provide additional capabilities to our customers in their use of dbt Cloud. Happy APIing!

*Below this you’ll find a series of example requests - use these to guide you or [check out the Postman Collection](https://dbtlabs.postman.co/workspace/Team-Workspace~520c7ac4-3895-4779-8bc3-9a11b5287c1c/request/12491709-23cd2368-aa58-4c9a-8f2d-e8d56abb6b1dlinklink) to try it out yourself.*

## Appendix 

### Examples of how to use the Postman Collection

Let’s run through some examples on how to make good use of this Postman Collection.

#### Migrating dbt Cloud Projects

One common question we hear from customers is “How can we migrate resources from one dbt Cloud project to another?” Often, they’ll create a development project, in which users have access to the UI and can manually make changes, and then migrate selected resources from the development project to a production project once things are ready.

There are several reasons one might want to do this, including: 

- Probably the most common is separating dev/test/prod environments across dbt Cloud projects to enable teams to build manually in a development project, and then automatically migrate those environments & jobs to a production project.
- Building “starter projects” they can deploy as templates for new teams onboarding to dbt from a learning standpoint.
- Some particularly security conscious customers may require version control and governance processes to run before any change to infrastructure, including their dbt Cloud accounts.

Below, we show an example of migrating an environment and a job definition from a development project to a production project. Note that this assumes you already have both projects set up. You could take this automation process even further by creating new projects with repository and database connections via the API as well. Please refer to the collection for additional details.

**Before you start**: Make sure to [get your API key](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/user-tokens) and add it to the Authentication Header of your requests.

Our example contains the following elements:

![This diagram depicts how an API request works. The diagram depicts a Dev project and a Prod project. The Dev project contains two environments: a development and deployment environment. The deployment project contains a job. The diagram shows the deployment environment that contains the job being copied over to the Prod Project via API request.](/img/blog/2022-04-19-dbt-cloud-postman-collection/example-cloud-environment.png)

### Setup

Create a “development” and a “production” project in dbt Cloud using the UI
Set up a [data warehouse connection](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database) and [repository connection](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-configuring-repositories)

#### Pull the environment from the development project

All of this information is obtainable from the API (see the postman collection), but you can also identify the correct IDs to use from the URL when logged in to dbt Cloud:

![A screenshot of the dbt Cloud browser, with the URL highlighted as an example of where to find the correct ID number](/img/blog/2022-04-19-dbt-cloud-postman-collection/dbt-cloud-api-ID.png)

- Account ID: 28885
- Project ID: 86704
- Environment ID: 75286

We’ll send a GET request to

https://cloud.getdbt.com/api/v3/accounts/28885/projects/86704/environments/75286/

#### Push the environment to the production project

We take the response from the GET request above, and then to the following: 

1. Adjust some of the variables for the new environment:
    - Change the the value of the “project_id” field from 86704 to 86711
    - Change the value of the “name” field from “dev-staging” to “production–api-generated”
    - Set the “custom_branch” field to “main”

2. Send the POST request shown below to: https://cloud.getdbt.com/api/v3/accounts/28885/projects/86711/environments/

**Request body**:

```
{
   "id": null,
   "account_id": 28885,
   "project_id": 86711,
   "credentials_id": 108731,
   "name": "production–api-generated",
   "dbt_version": "1.0.0",
   "type": "deployment",
   "state": 1,
   "use_custom_branch": true,
   "custom_branch": "main"
}
```

3. Note the environment ID returned in the response, as we’ll use to create a dbt Cloud job in the next step 

#### Pull the job definition from the dev project

We send a GET request to:

https://cloud.getdbt.com/api/v2/accounts/28885/jobs/72025/

#### Push the job definition to the prod project
1. Adjust some of the variables for the new job:
    - Remove the “created_at”, “updated_at”, and “is_deferrable” fields. [Defer](https://docs.getdbt.com/reference/node-selection/defer) logic is out of scope for this post.
    - Change the value of the “name” field to “production-run–api-generated”
2. Sent the POST request shown below to https://cloud.getdbt.com/api/v2/accounts/28885/jobs/

**Request body**:

```
{
       "execution": {
           "timeout_seconds": 600
       },
       "generate_docs": false,
       "run_generate_sources": false,
       "id": null,
       "account_id": {{account_id}},
       "project_id": 86711,
       "environment_id": 75296,
       "name": "production-run--api-generated",
       "dbt_version": null,
       "execute_steps": [
           "dbt build"
       ],
       "state": 1,
       "deactivated": false,
       "run_failure_count": 0,
       "deferring_job_definition_id": null,
       "lifecycle_webhooks": false,
       "lifecycle_webhooks_url": null,
       "triggers": {
           "github_webhook": false,
           "git_provider_webhook": false,
           "custom_branch_only": true,
           "schedule": false
       },
       "settings": {
           "threads": 4,
           "target_name": "default"
       },
       "schedule": {
           "cron": "0 * * * *",
           "date": {
               "type": "every_day"
           },
           "time": {
               "type": "every_hour",
               "interval": 1
           }
       },
       "generate_sources": false,
       "cron_humanized": "Every hour",
       "next_run": null,
       "next_run_humanized": null
   }
```

And we’re done! We now have the basic mechanics in place for migrating dbt Cloud Objects.
