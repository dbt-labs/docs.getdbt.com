---
title: Deploy your project
---
CC Notes:
* Should we title this "Run dbt in production"?
* Should we mention that this is not the only way to deploy a dbt project?

Now that you've built your project, you'll need to run it regularly on a
schedule. This is because your source data will be constantly updating as your
Jaffle Shop has more orders and more customers. If you're building any of your
models as tables, the data will go stale unless you run your project.

## Commit your changes

### dbt Cloud
1. Click the `commit` button, with a message like "Add customers model"

### dbt CLI
1. Add all your changes to git: `git add -a`
2. Commit your changes: `git commit -m "Add customers models"`
3. Push your changes to your repo: `git push`

> ℹ️ We just pushed straight to master 😬! We **always** use a git flow when
working on dbt projects, and recommend you do too!

## Connect dbt Cloud to your repo
> ℹ️ This step only applies to folks who use the dbt CLI to develop their
project. If you developed your project in dbt Cloud, you can skip this step!

1. Create a dbt Cloud account [here](https://cloud.getdbt.com/signup/). If your
organization already has a dbt Cloud account, ask an admin to add you as a
Developer.
2. If you created a new account, a new project should automatically be created.
If you were added to an existing account:
  * Click the hamburger menu, then `Account Settings`, then `Projects`.
  * Name your project "dbt Tutorial", and click `Save`. There's no need to fill
  in the other details.
  * Click the hamburger menu, and then `Home`.
  * Switch the project in the header bar to your new "dbt Tutorial" project.
3. Complete the onboarding flow:
  * Connect to BQ
  * Add a repository -- choose the GitHub integration, and connect to your
  `dbt-tutorial` repo.


## Create a deployment environment
Deployment environments are ...
1. Click the hamburger menu, and then `Home`
2. Under "Deployment Environments" select "create a new one"
3. Name your deployment environment (e.g. "Production")
4. Add a target dataset (e.g. "analytics") -- this is the dataset that dbt will
build into. For other warehouses this is usually named "schema"

## Create & run a job
Jobs are ...
1. After creating your deployment environment, you should be directed to the
page for new environment. If not, select the hamburger menu, and then `Jobs`.
2. Click `New Job` giving it a name (e.g. "Production run"), and linking it
to the Environment you just created.
3. Check the box for "Generate docs".
4. Ensure you have the following commands as part of your job:
    * `dbt run`
    * `dbt test`
5. **Do not** set a schedule for your project to run -- while your organization's
project **should** run regularly, there's no need to run this project on a schedule,
and doing so could result in using up your BigQuery credit.
6. Select `Save`, and then `Run now` to run your job.
7. Click into the run to see the progress -- once the run is complete, click
"View Documentation" to see the docs for your project.
