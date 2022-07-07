---
title: Lint code on push
id: 2-lint-on-push
---

This section shows a very basic example of linting a project every time a commit is pushed to the repo. While it is simple, it shows the power of CI and can be expanded on to meet the needs of your organization. 

The steps below use [SQLFluff](https://docs.sqlfluff.com/en/stable/) to scan your code and look for linting errors. In the example, it's set to use the `snowflake` dialect, and specfically runs the rules L019, L020, L021, and L022. This is purley for demonstration purposes. You should update this to reflect your code base's [dialect](https://docs.sqlfluff.com/en/stable/dialects.html) and the [rules](https://docs.sqlfluff.com/en/stable/rules.html) you've established for your repo.

### 1. Create a yaml file to define your pipeline

The yaml files defined below are what tell your code hosting platform the steps to run. In this setup, you’re telling the platform to run a SQLFluff lint job every time a commit is pushed.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
  ]
}>
<TabItem value="github">

In order for GitHub to know that you want to run an action, you need to have a few specific folders in your project. Add a new folder named `.github`, and within that folder add a new one named `workflows`. Your final folder structure will look like this: 
    
```sql
my_awesome_project
├── .github
│   ├── workflows
│   │   └── lint_on_push.yml
```

To define the job for our action, let’s add a new file named `lint_on_push.yml` under the `workflows` folder. This file is how we tell the GitHub runner what to execute when the job is triggered.

Below I touch on the important pieces for running a dbt Cloud job, but if you want a full run-down of all the components of this yaml file checkout [this GitHub article](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file) on actions.

**Key pieces:**

- `on:` - this is used to filter when the pipeline is run. In this example we’re running it on every push except for pushes to branches named `main`. For more filters, checkout [GitHub’s docs](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
- `runs-on: ubuntu-latest` - this defines the operating system we’re using to run the job
- `uses:` - remember the virtual servers we coved in the background section? They’re just empty operating systems, so there are two pieces of setup that are needed in order to access the code in your repo, and setup Python correctly on the virtual server. These two actions are called from other repos in GitHub to provide those services. For more information on them, checkout their repos: [actions/checkout](https://github.com/actions/checkout#checkout-v3) and [actions/setup-python](https://github.com/actions/setup-python#setup-python-v3).
- `run:` - this is how we’re telling the GitHub runner to execute the Python script we defined above.

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
      - uses: "actions/setup-python@v2"
        with:
          python-version: "3.9"
      - name: Install SQLFluff
        run: "pip install sqlfluff==0.13.1"
      - name: Lint project
        run: "sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022"

```

</TabItem>
<TabItem value="gitlab">

Create a `.gitlab-ci.yml` file in your **root directory** to define the triggers for when to execute the script above. You’ll put the code below into this file.

```sql
my_awesome_project
├── dbt_project.yml
├── .gitlab-ci.yml
```

**Key pieces:**

- `image: python:3.9` - this defines the virtual image we’re using to run the job
- `rules:` - this is used to filter when the pipeline runs. In this case we’re telling it to run on every push event except when the branch is named `main`. Filters are very powerful to run commands on specific events, and you can find a full list in [GitLab’s documentation](https://docs.gitlab.com/ee/ci/yaml/#rules).
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
    - pip install sqlfluff==0.13.1
    - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022
```

</TabItem>
</Tabs>

### 2. Commit and push your changes to make sure everything works

After you finish creating the yaml files, commit and push your code. Doing this will trigger your pipeline for the first time! If everything goes well, you should see the pipeline in your code platform. When you click into the job you’ll get a log showing that SQLFluff was run. If your code failed linting you’ll get an error in the job with a description of what needs to be fixed. If everything passed the lint check, you’ll see a successful job run.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
  ]
}>
<TabItem value="github">

In your repository, click the *Actions* tab

![Image showing the GitHub action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-github.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitHub for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-github.png)

</TabItem>
<TabItem value="gitlab">

In the menu option got to *CI/CD > Pipelines*

![Image showing the GitLab action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-gitlab.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitLab for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-gitlab.png)

</TabItem>
</Tabs>
