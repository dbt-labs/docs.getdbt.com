---
title: "PR template"
id: "pr-template"
---
## Configure pull request (PR) template URLs

When changes are committed on a branch in the IDE, dbt Cloud can prompt users to
open a new Pull Request for the code changes. To enable this functionality, ensure
that a PR Template URL is configured in the Repository details page in your
Account Settings. If this setting is blank, the IDE will prompt users to merge the changes directly into their default branch.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/configure-template-url-new-ide.png" title="Open a PR in the IDE"/>

### PR Template URL by git provider

The PR Template URL setting will be automatically set for most repositories, depending on the connection method.

- If you connect to your repository via in-app integrations with your git provider or the "Git Clone" method via SSH, this URL setting will be auto-populated and editable.
 - If you connect via a dbt Cloud [Managed repository](/docs/collaborate/git/managed-repository), this URL will not be set, and the IDE will prompt users to merge the changes directly into their default branch.

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
https://bitbucket.org/<org>/<repo>/pull-requests/new?source={{source}}&dest={{destination}}
```

### AWS CodeCommit
```
https://console.aws.amazon.com/codesuite/codecommit/repositories/<repo>/pull-requests/new/refs/heads/{{destination}}/.../refs/heads/{{source}}
```

### Azure DevOps
```
https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequestcreate?sourceRef={{source}}&targetRef={{destination}}
```
