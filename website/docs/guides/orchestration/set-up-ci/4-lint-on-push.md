---
title: "Run linting checks with SQLFluff"
slug: lint-on-push
description: Enforce your organization's SQL style guide with by running SQLFluff in your git workflow whenever new code is pushed.
---

By [linting](/docs/cloud/dbt-cloud-ide/lint-format#lint) your project during CI, you can ensure that code styling standards are consistently enforced, without spending human time nitpicking comma placement.

The steps below create an action/pipeline which uses [SQLFluff](https://docs.sqlfluff.com/en/stable/) to scan your code and look for linting errors. If you don't already have SQLFluff rules defined, check out [our recommended config file](/best-practices/how-we-style/2-how-we-style-our-sql).

### 1. Create a YAML file to define your pipeline

The YAML files defined below are what tell your code hosting platform the steps to run. In this setup, you’re telling the platform to run a SQLFluff lint job every time a commit is pushed.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

GitHub Actions are defined in the `.github/workflows` directory. To define the job for your action, add a new file named `lint_on_push.yml` under the `workflows` folder. Your final folder structure will look like this:

```sql
my_awesome_project
├── .github
│   ├── workflows
│   │   └── lint_on_push.yml
```

**Key pieces:**

- `on:` defines when the pipeline is run. This workflow will run whenever code is pushed to any branch except `main`. For other trigger options, check out [GitHub’s docs](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
- `runs-on: ubuntu-latest` - this defines the operating system we’re using to run the job
- `uses:` - When the Ubuntu server is created, it is completely empty. [`checkout`](https://github.com/actions/checkout#checkout-v3) and [`setup-python`](https://github.com/actions/setup-python#setup-python-v3) are public GitHub Actions which enable the server to access the code in your repo, and set up Python correctly.
- `run:` - these steps are run at the command line, as though you typed them at a prompt yourself. This will install sqlfluff and lint the project. Be sure to set the correct `--dialect` for your project.

For a full breakdown of the properties in a workflow file, see [Understanding the workflow file](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file) on GitHub's website.

```yaml
name: lint dbt project on push

on:
  push:
    branches-ignore:
      - 'main'

jobs:
  # this job runs SQLFluff with a specific set of rules
  # note the dialect is set to Snowflake, so make that specific to your setup
  # details on linter rules: https://docs.sqlfluff.com/en/stable/rules.html
  lint_project:
    name: Run SQLFluff linter
    runs-on: ubuntu-latest
  
    steps:
      - uses: "actions/checkout@v3"
      - uses: "actions/setup-python@v4"
        with:
          python-version: "3.9"
      - name: Install SQLFluff
        run: "pip install sqlfluff"
      - name: Lint project
        run: "sqlfluff lint models --dialect snowflake"

```

</TabItem>
<TabItem value="gitlab">

Create a `.gitlab-ci.yml` file in your **root directory** to define the triggers for when to execute the script below. You’ll put the code below into this file.

```sql
my_awesome_project
├── dbt_project.yml
├── .gitlab-ci.yml
```

**Key pieces:**

- `image: python:3.9` - this defines the virtual image we’re using to run the job
- `rules:` - defines when the pipeline is run. This workflow will run whenever code is pushed to any branch except `main`. For other rules, refer to [GitLab’s documentation](https://docs.gitlab.com/ee/ci/yaml/#rules).
- `script:` - this is how we’re telling the GitLab runner to execute the Python script we defined above.

```yaml
image: python:3.9

stages:
  - pre-build

# this job runs SQLFluff with a specific set of rules
# note the dialect is set to Snowflake, so make that specific to your setup
# details on linter rules: https://docs.sqlfluff.com/en/stable/rules.html
lint-project:
  stage: pre-build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH != 'main'
  script:
    - pip install sqlfluff
    - sqlfluff lint models --dialect snowflake
```

</TabItem>
<TabItem value="bitbucket">

Create a `bitbucket-pipelines.yml` file in your **root directory** to define the triggers for when to execute the script below. You’ll put the code below into this file.

```sql
my_awesome_project
├── bitbucket-pipelines.yml
├── dbt_project.yml
```

**Key pieces:**

- `image: python:3.11.1` - this defines the virtual image we’re using to run the job
- `'**':` - this is used to filter when the pipeline runs. In this case we’re telling it to run on every push event, and you can see at line 12 we're creating a dummy pipeline for `main`. More information on filtering when a pipeline is run can be found in [Bitbucket's documentation](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-triggers/)
- `script:` - this is how we’re telling the Bitbucket runner to execute the Python script we defined above.

```yaml
image: python:3.11.1


pipelines:
  branches:
    '**': # this sets a wildcard to run on every branch
      - step:
          name: Lint dbt project
          script:
            - pip install sqlfluff==0.13.1
            - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022

    'main': # override if your default branch doesn't run on a branch named "main"
      - step:
          script:
            - python --version
```

</TabItem>
</Tabs>

### 2. Commit and push your changes to make sure everything works

After you finish creating the YAML files, commit and push your code to trigger your pipeline for the first time. If everything goes well, you should see the pipeline in your code platform. When you click into the job you’ll get a log showing that SQLFluff was run. If your code failed linting you’ll get an error in the job with a description of what needs to be fixed. If everything passed the lint check, you’ll see a successful job run.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

In your repository, click the *Actions* tab

![Image showing the GitHub action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-github.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitHub for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-github.png)

</TabItem>
<TabItem value="gitlab">

In the menu option go to *CI/CD > Pipelines*

![Image showing the GitLab action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-gitlab.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitLab for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-gitlab.png)

</TabItem>
<TabItem value="bitbucket">

In the left menu pane, click on *Pipelines*

![Image showing the Bitbucket action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-bitbucket.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in Bitbucket for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-bitbucket.png)

</TabItem>
</Tabs>
