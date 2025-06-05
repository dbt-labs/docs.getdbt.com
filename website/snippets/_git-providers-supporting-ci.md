## Availability of features by Git provider

- If your git provider has a [native <Constant name="cloud" /> integration](/docs/cloud/git/git-configuration-in-dbt-cloud), you can seamlessly set up [continuous integration (CI)](/docs/deploy/ci-jobs) jobs directly within <Constant name="cloud" />. 

- For providers without native integration, you can still use the [Git clone method](/docs/cloud/git/import-a-project-by-git-url) to import your git URL and leverage the [<Constant name="cloud" /> Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) to trigger a CI job to run.

The following table outlines the available integration options and their corresponding capabilities.

| **Git provider** | **Native <Constant name="cloud" /> integration** | **Automated CI job**|**Git clone**| **Information**| **Supported plans**|
| -----------------| ---------------------------------| --------------------|-------------|----------------| --------|
|[Azure DevOps](/docs/cloud/git/connect-azure-devops)<br /> |  ✅|  ✅ |  ✅  | Organizations on the Starter and Developer plans can connect to Azure DevOps using a deploy key. Note, you won’t be able to configure automated CI jobs but you can still develop.| Enterprise, Enterprise+ |
|[GitHub](/docs/cloud/git/connect-github)<br />  | ✅ | ✅ |  |  | All <Constant name="cloud" /> plans |
|[GitLab](/docs/cloud/git/connect-gitlab)<br /> | ✅ | ✅ |  ✅  | | All <Constant name="cloud" /> plans |
|All other git providers using [Git clone](/docs/cloud/git/import-a-project-by-git-url) ([BitBucket](/docs/cloud/git/import-a-project-by-git-url#bitbucket), [AWS CodeCommit](/docs/cloud/git/import-a-project-by-git-url#aws-codecommit), and others)| ❌    | ❌    | ✅   | Refer to the [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines?step=1) guide to set up continuous integration and continuous deployment (CI/CD).|

