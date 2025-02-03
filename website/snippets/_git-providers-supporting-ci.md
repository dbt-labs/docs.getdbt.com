## Availability of features by Git provider

- If your git provider has a [native dbt Cloud integration](/docs/cloud/git/git-configuration-in-dbt-cloud), you can seamlessly set up [continuous integration (CI)](/docs/deploy/ci-jobs) jobs directly within dbt Cloud. 

- For providers without native integration, you can still use the [Git clone method](/docs/cloud/git/import-a-project-by-git-url) to import your git URL and leverage the [dbt Cloud Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) to trigger a CI job to run.

The following table outlines the available integration options and their corresponding capabilities.

| **Git provider** | **Native dbt Cloud integration** | **Automated CI job**|**Git clone**| **Information**|
| -----------------| ---------------------------------| -------------------------------------------|-----------------------|---------|
|[Azure DevOps](/docs/cloud/git/connect-azure-devops)<br /> <Lifecycle status="enterprise" />|  ✅|  ✅ |  ✅  | Organizations on the Team  and Developer plans can connect to Azure DeveOps using a deploy key. Note, you won’t be able to configure automated CI jobs but you can still develop.|
|[GitHub](/docs/cloud/git/connect-github)<br /> <Lifecycle status="developer,team,enterprise" /> | ✅ | ✅ |  ✅         |                                  
|[GitLab](/docs/cloud/git/connect-gitlab)<br /> <Lifecycle status="developer,team,enterprise" /> | ✅ | ✅ |  ✅         |
|All other git providers using [Git clone](/docs/cloud/git/import-a-project-by-git-url) ([BitBucket](/docs/cloud/git/import-a-project-by-git-url#bitbucket), [AWS CodeCommit](/docs/cloud/git/import-a-project-by-git-url#aws-codecommit), and others)| ❌    | ❌    | ✅   | Refer to the [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines?step=1) guide to set up continuous integration and continuous deployment (CI/CD).|

