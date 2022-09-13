---
title: "Configuring repositories"
id: "cloud-configuring-repositories"
---

### Configuring Pull Request (PR) template URLs

When changes are committed on a branch in the IDE, dbt Cloud can prompt users to
open a new Pull Request for the code changes. To enable this functionality, ensure
that a PR Template URL is configured in the Repository details page in your
Account Settings. **Note:** If this template URL is unset, then the IDE will
instead show a prompt to merge the changes directly into the `master` branch.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/configure-template-url.png" title="Open a PR in the IDE"/>

The PR template URL supports two variables which can be used to build a URL string.
These variables, `{{source}}` and `{{destination}}` return branch names based on the
state of the configured Environment and active branch open in the IDE. The `{{source}}`
variable represents the active development branch, and the `{{destination}}` variable
represents the configured base branch for the environment, eg. `master`.

A typical PR build URL looks like:

<Tabs
  defaultValue="template"
  values={[
    { label: 'Template', value: 'template', },
    { label: 'Rendered', value: 'rendered', },
  ]
}>
<TabItem value="template">

```
https://github.com/dbt-labs/jaffle_shop/compare/{{destination}}..{{source}}
```

</TabItem>
<TabItem value="rendered">

```
https://github.com/dbt-labs/jaffle_shop/compare/master..my-branch
```

</TabItem>
</Tabs>

## Configuring Custom Branches on Repositories

By default in Development Environments, dbt Cloud attempts to reference the `main` branch in connected repositories. If you want to use a different default branch name, you can configure dbt Cloud with a custom branch setting. 

For example, the environment below is configured to use the `develop` branch of the connected repository: 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dev-environment-custom-branch.png" title="Configuring a custom base repository branch"/>

## Example templates

Some common URL templates are provided below, but please note that the exact
value may vary depending on your configured git provider. 

### GitHub
```
https://github.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

If you're using Github Enterprise your template may look something like:

```
https://git.<mycompany>.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

### GitLab
```
https://gitlab.com/<org>/<repo>/-/merge_requests/new?merge_request[source_branch]={{source}}&merge_request[target_branch]={{destination}}
```

### BitBucket
```
https://bitbucket.org/<org>/<repo>/pull-requests/new?source={{source}}
```

### AWS CodeCommit
```
https://console.aws.amazon.com/codesuite/codecommit/repositories/<repo>/pull-requests/new/refs/heads/{{destination}}/.../refs/heads/{{source}}
```

### Azure DevOps
```
https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequestcreate?sourceRef={{source}}&targetRef={{destination}}
```
