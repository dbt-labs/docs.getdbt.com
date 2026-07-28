
Permissions:

* **Account-level permissions** &mdash; Permissions related to the management of the <Constant name="dbt" /> account. For example, billing and account settings.
* **Project-level permissions** &mdash; Permissions related to the projects in <Constant name="dbt" />. For example, repos and access to the <Constant name="studio_ide" /> or <Constant name="platform_cli" />.

:::note

Some permissions sets have read-only access to environment settings that can be overriden with more privileged access if the user is assigned to a group with [Environment write access](/docs/platform/manage-access/about-user-access#environment-write-access) configured.

:::

### Account permissions

Account permission sets enable you to manage the <Constant name="dbt" /> account and manage the account settings (for example, generating service tokens, inviting users, and configuring SSO). They also provide project-level permissions. The **Account Admin** permission set is the highest level of access you can assign.

Key:

* **(W)rite** &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* **(R)ead** &mdash; Can view but cannot create or change any fields.

#### Account access for account permissions

<FilterableTable>

| Account-level permission | Account Admin | Billing admin | Cost Insights Admin | Cost Insights Viewer | Manage marketplace apps | Notification Manager | Project creator | Security admin | Account Viewer |
|:-------------------------|:-------------:|:-------------:|:-------------------:|:--------------------:|:-----------------------:|:--------------------:|:---------------:|:--------------:|:------:|
| Account settings<sup>*</sup>        | W             | -             | -                   | -                    | -                       | -                    | R               | R              | R      |
| Audit logs               | R             | -             | -                   | -                    | -                       | -                    | -               | R              | R      |
| Auth provider            | W             | -             | -                   | -                    | -                       | -                    | -               | W              | R      |
| Billing                  | W             | W             | -                   | -                    | -                       | -                    | -               | -              | R      |
| Connections              | W             | -             | R<sup>**</sup>       | R                    | -                       | R                    | W               | -              | -      |
| Cost Insights            | R             | -             | R                   | R                    | -                       | -                    | R               | -              | R      |
| Groups                   | W             | -             | -                   | -                    | -                       | -                    | R               | W              | R      |
| Invitations              | W             | -             | -                   | -                    | -                       | -                    | W               | W              | R      |
| IP restrictions          | W             | -             | -                   | -                    | -                       | -                    | -               | W              | R      |
| Job notifications        | W             | -             | -                   | -                    | -                       | W                    | -               | -              | R      |
| Licenses                 | W             | -             | -                   | -                    | -                       | -                    | W               | W              | R      |
| Marketplace app          | -             | -             | -                   | -                    | W                       | -                    | -               | -              | -      |
| Members                  | W             | -             | -                   | -                    | -                       | R                    | W               | W              | R      |
| Project (create)         | W             | -             | -                   | -                    | -                       | -                    | W               | -              | -      |
| Public models            | R             | R             | -                   | -                    | -                       | -                    | R               | R              | R      |
| Service tokens           | W             | -             | -                   | -                    | -                       | -                    | -               | R              | R      |
| Webhooks                 | W             | -             | -                   | -                    | -                       | -                    | -               | -              | -      |
</FilterableTable>

<sup>*</sup>Permission sets with write (**W**) access to Account settings can modify account-level settings. The **Notification Manager** permission set has dedicated write access to **Job notifications** (Slack, Microsoft Teams, and email) without requiring full Account settings access.

<sup>**</sup>**Cost Insights Admin** can edit [platform metadata credentials](/docs/explore/set-up-cost-insights#configure-platform-metadata-credentials) and [Cost Insights](/docs/explore/set-up-cost-insights) settings in **Connection settings**, even though **Connections** is read-only (**R**) for this permission set.

::::note Credentials access
Users can access the **Credentials** page under **Your profile** when they have `develop_access` or `user_credential_write` on at least one project.

An admin can grant `user_credential_write` to any group, regardless of which permission set the group is assigned. Users with only `user_credential_write` can configure warehouse and Git credentials on that page; environment variable and dbt version overrides still require `develop_access`.
::::


#### Project access for account permissions

<FilterableTable>
| Project-level permission     | Account Admin | Billing admin | Cost Insights Admin | Cost Insights Viewer | Notification Manager | Project creator | Security admin | Account Viewer |
|:-----------------------------|:-------------:|:-------------:|:-------------------:|:--------------------:|:--------------------:|:---------------:|:--------------:|:------:|
| Environment credentials      | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Custom env. variables        | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Cost Insights                | R             | -             | R                   | R                    | -                    | R               | -              | R      |
| Data platform configurations | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Develop (IDE or CLI)         | W             | -             | -                   | -                    | -                    | W               | -              | -      |
| Environments                 | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Jobs                         | W             | -             | R                   | R                    | -                    | W               | -              | R      |
| Metadata GraphQL API access  | R             | -             | R                   | R                    | -                    | R               | -              | R      |
| Permissions                  | W             | -             | -                   | -                    | -                    | W               | W              | R      |
| Projects                     | W             | -             | R                   | R                    | -                    | W               | R              | R      |
| Repositories                 | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Runs                         | W             | -             | -                   | -                    | -                    | W               | -              | R      |
| Semantic Layer config        | W             | -             | -                   | -                    | -                    | W               | -              | R      |
</FilterableTable>

### Project permissions

The project permission sets enable you to work within the projects in various capacities. They primarily provide access to project-level permissions such as repos and the <Constant name="studio_ide" /> or <Constant name="platform_cli" />, but may also provide some account-level permissions.

Key:

* **(W)rite** &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* **(R)ead** &mdash; Can view but cannot create or change any fields.

#### Account access for project permissions

<FilterableTable>
| Account-level permission | Admin | Analyst | Analyst read | Cost Insights Admin | Cost Insights Viewer | Database admin | Developer | Git Admin | Job admin | Job creator | Job runner | Job viewer | Metadata (Discovery API only) | Semantic Layer | Stakeholder/Read-Only | Team admin |
|--------------------------|:-----:|:-------:|:------------:|:-------------------:|:--------------------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:----------:|:----------:|:-----------------------------:|:--------------:|:---------------------:|:----------:|
| Account settings         |   R   |    -    |      R       |          -          |          -           |       R        |     -     |     R     |     -     |      -      |     -      |     -      |               -               |       -        |           R           |     R      |
| Auth provider            |   -   |    -    |      -       |          -          |          -           |       -        |     -     |     -     |     -     |      -      |     -      |     -      |               -               |       -        |           -           |     -      |
| Billing                  |   -   |    -    |      -       |          -          |          -           |       -        |     -     |     -     |     -     |      -      |     -      |     -      |               -               |       -        |           -           |     -      |
| Connections              |   R   |    R    |      R       |    R<sup>*</sup>    |          R           |       R        |     R     |     R     |     R     |      R      |     -      |     -      |               -               |       R        |           R           |     R      |
| Cost Insights            |   -   |    -    |      R       |          R          |          R           |       R        |     -     |     R     |     R     |      -      |     -      |     -      |               -               |       -        |           R           |     R      |
| Groups                   |   R   |    -    |      R       |          -          |          -           |       R        |     R     |     R     |     -     |      -      |     -      |     -      |               -               |       R        |           R           |     R      |
| Invitations              |   W   |    R    |      R       |          -          |          -           |       R        |     R     |     R     |     R     |      -      |     R      |     -      |               -               |       R        |           R           |     R      |
| Licenses                 |   W   |    R    |      R       |          -          |          -           |       R        |     R     |     R     |     R     |      -      |     R      |     -      |               -               |       -        |           R           |     R      |
| Members                  |   W   |    -    |      R       |          -          |          -           |       R        |     R     |     R     |     -     |      -      |     -      |     -      |               -               |       R        |           R           |     R      |
| Project (create)         |   -   |    -    |      -       |          -          |          -           |       -        |     -     |     -     |     -     |      -      |     -      |     -      |               -               |       -        |           -           |     -      |
| Public models            |   R   |    R    |      R       |          -          |          -           |       R        |     R     |     R     |     R     |      R      |     R      |     R      |               R               |       R        |           R           |     R      |
| Service tokens           |   -   |    -    |      -       |          -          |          -           |       -        |     -     |     -     |     -     |      -      |     -      |     -      |               -               |       -        |           -           |     -      |
| Webhooks                 |   W   |    -    |      -       |          -          |          -           |       -        |     W     |     -     |     -     |      -      |     -      |     -      |               -               |       -        |           -           |     -      |
</FilterableTable>

<sup>*</sup>**Cost Insights Admin** can edit [platform metadata credentials](/docs/explore/set-up-cost-insights#configure-platform-metadata-credentials) and [Cost Insights](/docs/explore/set-up-cost-insights) settings in **Connection settings**, even though **Connections** is read-only (**R**) for this permission set.

#### Project access for project permissions

<FilterableTable>
|Project-level permission  | Admin | Analyst | Analyst read<sup>***</sup> | Cost Insights Admin | Cost Insights Viewer | Database admin | Developer | Fusion admin | Git Admin | Job admin | Job creator | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder/Read-Only | Team admin |
|--------------------------|:-----:|:-------:|:------------:|:-------------------:|:--------------------:|:--------------:|:---------:|:------------:|:---------:|:---------:|:-----------:|:-----------:|:-----------:|:---------------------------------------:|:--------------:|:-----------:|:----------:|
| Environment credentials  |   W   |    R    |      R       |         -           |          -           |       W        |     R     |      -       |     R     |     W     |      R      |    -        |      -      |                  -                      |        -       |     R       |     R      |
| Custom env. variables    |   W   |    W<sup>**</sup>  |      R       |         -           |          -           |       W        |     W<sup>**</sup>    |      -       |     W     |     W     |      R      |     -       |      R      |                  -                      |        -       |     R       |     W      |
| Cost Insights            |   -   |    -    |      -       |         R           |          R           |       R        |     -     |      -       |     R     |     R     |      -      |      -      |      -      |                  -                      |       -        |     -       |     R      |
| Data platform configs    |   W   |    W    |      R       |         -           |          -           |       W        |     W     |      -       |     R     |     W     |      R      |     -       |      -      |                  -                      |       -        |     R       |     R      |
| Develop (IDE or CLI)     |   W   |    W    |      -       |         -           |          -           |       -        |     W     |      -       |     -     |     -     |      -      |     -       |      -      |                  -                      |       -        |     -       |      -     |
| Environments             |   W   |    R    |      R       |         -           |          -           |       R        |     R     |      -       |     R     |     W     |      R      |      -      |      R      |                  -                      |       -        |     R       |     R      |
| Fusion upgrade           |   -   |    -    |      -       |         -           |          -           |       -        |     -     |      W       |     -     |     -     |      -      |     -       |      -      |                  -                      |        -       |      -      |     -      |
| Jobs                     |   W   |    R<sup>*</sup>   |      -       |         R           |          R           |       R<sup>*</sup>       |     R<sup>*</sup>    |      -       |     R<sup>*</sup>    |     W     |      W      |      R      |      R      |                  -                      |       -        |     R       |     R<sup>*</sup>     |
| Metadata GraphQL API access| R   |    R    |      R       |         R           |          R           |       R        |     R     |      -       |     R     |     R     |      R      |      -      |      R      |                  R                      |       -        |     R       |     R      |
| Permissions              |   W   |    -    |      -       |         -           |          -           |       R        |     R     |      -       |     R     |     -     |      -      |      -      |      -      |                  -                      |       -        |     -       |     R      |
| Projects                 |   W   |    R    |      R       |         R           |          R           |       W        |     R     |      -       |     W     |     R     |      R      |      -      |      R      |                  -                      |       -        |     R       |     W      |
| Repositories             |   W   |    R    |      R       |         -           |          -           |       R        |     R     |      -       |     W     |     -     |      R      |      -      |      -      |                  -                      |       -        |     R       |     R      |
| Runs                     |   W   |    R<sup>*</sup>   |      -       |         -           |          -           |       R<sup>*</sup>       |     R<sup>*</sup>    |      -       |     R<sup>*</sup>    |     W     |      W      |      W      |      R      |                  -                      |       -        |     R       |     R<sup>*</sup>     |
| Semantic Layer config    |   W   |    R    |      R       |         -           |          -           |       W        |     R     |      -       |     R     |     R     |      R      |      -      |      -      |                  -                      |        W       |     R       |     R      |

</FilterableTable>

<sup>*</sup>These permissions are `R`ead-only by default, but may be changed to `W`rite with [environment permissions](/docs/platform/manage-access/environment-permissions#environments-and-roles).

<sup>**</sup>Custom env. variables for the `Developer` and `Analyst` roles are set in the **Credentials** section of **Account settings**.

<sup>***</sup>The **Analyst read** permission set also includes `user_credential_write`, letting users manage their own credentials on the **Credentials** page (under **Your profile**).
