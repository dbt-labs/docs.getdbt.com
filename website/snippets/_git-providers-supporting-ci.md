## Availability of features by Git provider

- If your git provider has a [native <Constant name="dbt" /> integration](/docs/platform/git/configure-git), you can seamlessly set up [continuous integration (CI)](/docs/deploy/ci-jobs) jobs directly within <Constant name="dbt" />. 

- For providers without native integration, you can still use the [Git clone method](/docs/platform/git/import-a-project-by-git-url) to import your git URL and leverage the [<Constant name="dbt" /> Administrative API](/docs/dbt-apis/admin-api) to trigger a CI job to run.

The following table outlines the available integration options and their corresponding capabilities.

| **Git provider** | **Native <Constant name="dbt" /> integration** | **Automated CI job**|**Git clone**| **Information**| **Supported plans**|
| -----------------| ---------------------------------| --------------------|-------------|----------------| --------|
|[Azure DevOps](/docs/platform/git/connect-azure-devops)<br /> |  ✅|  ✅ |  ✅  | Organizations on the Starter and Developer plans can connect to Azure DevOps using a deploy key. Note, you won’t be able to configure automated CI jobs but you can still develop.| Enterprise, Enterprise+ |
|[GitHub](/docs/platform/git/connect-github)<br />  | ✅ | ✅ | ✅ |  | All <Constant name="dbt" /> plans |
|[GitLab](/docs/platform/git/connect-gitlab)<br /> | ✅ | ✅ |  ✅  | | All <Constant name="dbt" /> plans |
|All other git providers using [Git clone](/docs/platform/git/import-a-project-by-git-url) ([BitBucket](/docs/platform/git/import-a-project-by-git-url#bitbucket), [AWS CodeCommit](/docs/platform/git/import-a-project-by-git-url#aws-codecommit), and others)| ❌    | ❌    | ✅   | Refer to the [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines?step=1) guide to set up continuous integration and continuous deployment (CI/CD).|
