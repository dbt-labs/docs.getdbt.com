---
title: "Autoscaling CI: The intelligent Slim CI"
description: "How to make your dbt Cloud Slim CI process more intelligent and, as a result, enable faster continuous integration workflows."
slug: intelligent-slim-ci

authors: [doug_guthrie]

tags: [analytics craft]
hide_table_of_contents: false

date: 2023-01-25
is_featured: true
---

Before I delve into what makes this particular solution "intelligent", let me back up and introduce CI, or continuous integration. CI is a software development practice that ensures we automatically test our code prior to merging into another branch. The idea being that we can mitigate the times when something bad happens in production, which is something that I'm sure we can all resonate with!

<!--truncate-->

<Lightbox src="/img/blog/2023-01-27-autoscaling-ci/01-yolo-prod.png" title="Don't try this at home kids!" />

The way that we tackle continuous integration in dbt Cloud is something we call [Slim CI](https://docs.getdbt.com/docs/deploy/cloud-ci-job#slim-ci). This feature enables us to automatically run a dbt Cloud job anytime a pull request is opened against our primary branch or when a commit is added to that pull request. The real kicker though? This job will only run and test the code that's been modified within that specific pull request. Why is Slim CI important?

- Ensures developers can work quickly by shortening the CI feedback loop
- Reduce costs in your data warehouse by running only what's been modified

I think we can all agree that increasing developer productivity while simultaneously reducing costs is an outcome that every company strives for.

However, there are a couple things to be aware of when implementing Slim CI:

- Only one Slim CI job can run at a given time. In the event multiple pull requests are opened, each one would trigger the same Slim CI job, but only one can be in a running state while the rest would be queued until prior runs complete.
- A job will continue to run even if another commit is added to the pull request.

Generally speaking, only customers with large data teams or disparate ones working in multiple projects tend to run into this limitation of slim CI. And when they do, the shortened feedback loop disappears as their pull requests start to stack up waiting for each one to finish.

The reason I know this is because I’m a solutions architect at dbt Labs and I speak with both our customers and prospects frequently. I learn about their data stacks, understand the blockers and limitations they’re experiencing, and help them realize and uncover use cases that dbt can solve for. Sometimes, however, my job calls for more than just being a trusted advisor, it calls for creating custom solutions that help address a critical need that our platform doesn’t (yet!) provide. So, like a lot of features and functionality inside of dbt, the impetus for this solution came from you!

Huge shoutout to my teammates [Matt Winkler](https://docs.getdbt.com/author/matt_winkler) and Steve Dowling, both of whom contributed immensely to both the code and ideation for this functionality!

## The solution: Autoscaling CI

As of this writing, autoscaling CI is functionality built only within a python package, [dbtc](https://dbtc.dpguthrie.com); dbtc is an unaffiliated python interface to the dbt Cloud Metadata and Administrative APIs. In addition, it provides a convenient command line interface (CLI) that exposes the same methods available within python.

> A method in Python is simply a function that’s a member of a class

One of those methods is called `trigger_autoscaling_ci_job`, and as you can probably imagine, it’s the method we’ll use to create a more intelligent Slim CI:

**Autoscaling CI enables a team of developers to maintain their fast and iterative CI workflow that Slim CI provides. New commits to an existing pull request will cancel any in progress runs for that pull request. In addition, it can use the same Slim CI job definition to run separate pull requests in parallel.**

### How it works

In the event your CI job is already running, the `trigger_autoscaling_ci_job` method will do the following:

- If this is an entirely new pull request, clone the Slim CI job definition and trigger the clone. It's important to note that the cloned job will be deleted by default after the run (you can change this through an argument to the function). Deleting the cloned job will also force the execution into a polling state (e.g. the function won't return a `Run` until it has encountered a completed state). The reason for this is dbt Cloud will not allow a run to execute without an associated job.
- If a new commit is created for the pull request linked to the existing run, cancel the run and trigger again.
- This will also check to see if your account has met or exceeded the allotted run slots. In the event you have, a cloned job will not be created and the existing job will be triggered and placed in the queue.

### Setup

1. The first step is to create a dbt Cloud job for Slim CI. We’ll follow the [exact steps](https://docs.getdbt.com/docs/deploy/cloud-ci-job#configuring-a-dbt-cloud-ci-job) to create a normal Slim CI job except for one.
    
    
    | Do | Don’t |
    | --- | --- |
    | Defer to a production job | Trigger by pull request* |
    | Commands need to have a `state:modified+` selector |  |
    
    *We’ll use your git provider to trigger the job instead of the dbt Cloud platform.
    
2. Next, create a workflow file in your dbt project for your specific git provider (GitHub, GitLab, or Azure DevOps).

<Tabs
  defaultValue="github"
  values={[
    {label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'ADO', value: 'ado', },
  ]
}>

<TabItem value="github">

In order for GitHub to know that you want to run an action, you need to have a couple specific folders in your project. Add a new folder named `.github`, and within that folder add a new one named `workflows`. Your final folder structure will look like this: 
    
```sql
my_dbt_project
├── .github
│   ├── workflows
│   │   └── autoscaling_ci.yml
```

To define the job for our action, let’s add a new file named `autoscaling_ci.yml` under the `workflows` folder. This file is how we tell the GitHub runner what to execute when the job is triggered.

**Key pieces:**

- `on`: This is how we're telling github to trigger this workflow. Specifically, on pull requests opened against `main` and the type matching one of: `opened`, `reopened`, `synchronize`, and `ready_for_review`. The `types` section, along with the `if` statement below, ensures that we don't trigger this workflow on draft PRs.
- `env`: This is where we can set environment variables that can be used in any of the steps defined in our workflow. The main callout here, though, is that you should be using [secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) for sensitive variables (e.g. your dbt Cloud service token). Additionally, ensure that you're setting the `JOB_ID` to the same job ID of your Slim CI job that you've set up in dbt Cloud.
- `runs-on: ubuntu-latest`: This defines the operating system we’re using to run the job.
- `uses`: The operating system we defined above needs to be setup further to access the code in your repo and also setup Python correctly. These two actions are called from other repos in GitHub to provide those services. For more information on them, checkout their repos: [actions/checkout](https://github.com/actions/checkout#checkout-v3) and [actions/setup-python](https://github.com/actions/setup-python#setup-python-v3).

```yaml
name: Autoscaling dbt Cloud CI
on:
  pull_request:
    branches:
      - main
    types:
      - opened
      - reopened
      - synchronize
      - ready_for_review

jobs:
  autoscaling:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    env:
      DBT_CLOUD_SERVICE_TOKEN: ${{ secrets.DBT_CLOUD_SERVICE_TOKEN }}
      DBT_CLOUD_ACCOUNT_ID: 1
      JOB_ID: 1
      PULL_REQUEST_ID: ${{ github.event.number }}
      GIT_SHA: ${{ github.event.pull_request.head.sha }}

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: "3.9.x"

      - name: Trigger Autoscaling CI Job
        run: |
          pip install dbtc
          SO="dbt_cloud_pr_"$JOB_ID"_"$PULL_REQUEST_ID
          dbtc trigger-autoscaling-ci-job \
            --job-id=$JOB_ID \
            --payload='{"cause": "Autoscaling Slim CI!","git_sha":"'"$GIT_SHA"'","schema_override":"'"$SO"'","github_pull_request_id":'"$PULL_REQUEST_ID"'}' \
            --no-should-poll
```

In order to mimic the native Slim CI behavior within dbt Cloud, it's important to pass the appropriate payload. The payload should consist of the following:

- `cause`: Put whatever you want here (this is a required field though).
- `schema_override`: Match what dbt Cloud does natively - `dbt_cloud_pr_<job_id>_<pull_request_id>`
- `git_sha`: `${{ github.event.pull_request.head.sha }}`
- `github_pull_request_id`: `${{ github.event.number }}`

</TabItem>
<TabItem value="gitlab">

Create a `.gitlab-ci.yml` file in your **root directory**.

```sql
my_dbt_project
├── dbt_project.yml
├── .gitlab-ci.yml
```

**Key pieces:**

- `variables`: Ensure that you keep your `DBT_CLOUD_SERVICE_TOKEN` secret by creating a [variable](https://docs.gitlab.com/ee/ci/variables/#for-a-project). Additionally, we'll use some [predefined variables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) that are provided by Gitlab in every CI/CD pipeline.
- `only`: We want this to be triggered only on `merge_requests`.

```yaml
image: python:latest

variables:
  DBT_CLOUD_SERVICE_TOKEN: $DBT_CLOUD_SERVICE_TOKEN
  DBT_CLOUD_ACCOUNT_ID: 1
  JOB_ID: 1
  MERGE_REQUEST_ID: $CI_MERGE_REQUEST_IID
  GIT_SHA: $CI_COMMIT_SHA

before_script:
  - pip install dbtc

stages:
  - deploy

deploy-autoscaling-ci:
  stage: deploy
  only:
    - merge_requests
  script:
    - export DBT_CLOUD_SERVICE_TOKEN=$DBT_CLOUD_SERVICE_TOKEN
    - SO="dbt_cloud_pr_"${JOB_ID}"_"${MERGE_REQUEST_ID}
    - dbtc trigger-autoscaling-ci-job --job-id "$JOB_ID" --payload='{"cause":"Autoscaling Slim CI!","git_sha":"'"$GIT_SHA"'","schema_override":"'"$SO"'","gitlab_merge_request_id":'"$MERGE_REQUEST_ID"'}' --no-should-poll

```

In order to mimic the native Slim CI behavior within dbt Cloud, it's important to pass the appropriate payload. The payload should consist of the following:

- `cause`: Put whatever you want here (this is a required field though).
- `schema_override`: Match what dbt Cloud does natively - `dbt_cloud_pr_<job_id>_<pull_request_id>`
- `git_sha`: `$CI_COMMIT_SHA`
- `gitlab_merge_request_id`: `$CI_MERGE_REQUEST_IID`

</TabItem>
<TabItem value="ado">

Create a `azure-pipelines.yml` file in your **root directory**.

```sql
my_dbt_project
├── dbt_project.yml
├── azure-pipelines.yml
```

**Key pieces:**

- `pr`: A pull request trigger specifies which branches cause a pull request build to run. In this case, we'll specify our `main` branch.
- `trigger`: Setting to `none` disables CI triggers on every commit.
- `pool`: Specify which agent to use for this pipeline.
- `variables`: Ensure that you keep your `DBT_CLOUD_SERVICE_TOKEN` secret by creating a [variable](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash#secret-variable-in-the-ui). Additionally, we'll use some [predefined variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml) that are provided in every pipeline.

```yaml

name: Autoscaling CI

pr: [ main ]
trigger: none

variables:
    DBT_CLOUD_ACCOUNT_ID: 43786
    JOB_ID: 73797
    GIT_SHA: $(Build.SourceVersion)
    PULL_REQUEST_ID: $(System.PullRequest.PullRequestId)

pool:
  vmImage: ubuntu-latest

steps:
- task: UsePythonVersion@0
  inputs:
   versionSpec: '3.9'
- script: |
    pip install dbtc
  displayName: 'Install dependencies'
- script: |
    SO="dbt_cloud_pr_"$(JOB_ID)"_"$(PULL_REQUEST_ID)
    dbtc trigger-autoscaling-ci-job --job-id $(JOB_ID) --payload '{"cause": "Autoscaling Slim CI!","git_sha":"'"$(GIT_SHA)"'","schema_override":"'"$SO"'","azure_pull_request_id":'"$(PULL_REQUEST_ID)"'}' --no-should-poll
  displayName: Trigger Job
  env:
    DBT_CLOUD_SERVICE_TOKEN: $(DBT_CLOUD_SERVICE_TOKEN)

```

In order to mimic the native Slim CI behavior within dbt Cloud, it's important to pass the appropriate payload. The payload should consist of the following:

- `cause`: Put whatever you want here (this is a required field though).
- `schema_override`: Match what dbt Cloud does natively - `dbt_cloud_pr_<job_id>_<pull_request_id>`
- `git_sha`: `$(Build.SourceVersion)`
- `azure_pull_request_id`: `$(System.PullRequest.PullRequestId)`

</TabItem>

</Tabs>

### Benefits

After adding this file to your repository, your CI jobs will no longer stack up behind one another. A job that’s now irrelevant because of a new commit will be cancelled and triggered again automatically.  Some benefits that I think you'll begin to realize include:

- Lower costs in your data warehouse from cancelling irrelevant (and potentially long-running) CI jobs
- A faster, more efficient, development workflow that ensures a quick feedback loop from your CI process
- Increased ability to open up development work that encourages more cross-team collaboration

### Watch it in action

The video below shows a quick demo of this functionality in action!

<LoomVideo id="5f63e40c356145489a741dac87b47595" />

## Get in touch

If you run into any problems implementing this, please feel free to [open up an issue](https://github.com/dpguthrie/dbtc/issues/new) in the dbtc repository — I may know the maintainer and can get it fast tracked 😉! Also, I’m always looking for both contributors and ideas on how to make this package better. In the future, I’m also thinking about adding:

- Internal data models (probably using [Pydantic](https://docs.pydantic.dev/)) for each of the dbt Cloud objects you can create. This will allow a user to understand the fields and data types an object requires to be created. It will also ensure that appropriate defaults are used in place of missing arguments.
- A `query` method on the `metadata` property. Right now, the interfaces to retrieve data from the Metadata API force a user to return everything. There should be another option that allows a user to write the GraphQL query to return only the data they require.
- Building on top of the bullet point above, each of the metadata methods should also accept a `fields` argument. This argument should limit the data returned from the API in a similar fashion that the `query` method would, but it would be in a more pythonic construct than forcing a user to write a GraphQL query.

If any of that sounds interesting, or you have other ideas, feel free to reach out to me on the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/) — @Doug Guthrie.
