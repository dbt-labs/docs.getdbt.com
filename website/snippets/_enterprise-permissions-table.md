
Permissions: 

* **Account-level permissions** &mdash; Permissions related to the management of the <Constant name="cloud" /> account. For example, billing and account settings.
* **Project-level permissions** &mdash; Permissions related to the projects in <Constant name="cloud" />. For example, repos and access to the <Constant name="cloud_ide" /> or <Constant name="cloud_cli" />. 

### Account permissions

Account permission sets enable you to manage the <Constant name="cloud" /> account and manage the account settings (for example, generating service tokens, inviting users, and configuring SSO). They also provide project-level permissions. The **Account Admin** permission set is the highest level of access you can assign.  

Key:

* **(W)rite** &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* **(R)ead** &mdash; Can view but cannot create or change any fields.

#### Account access for account permissions

<SortableTable>

{`
| Account-level permission| Account Admin | Billing admin |  Manage marketplace apps | Project creator | Security admin | Viewer | 
|:-------------------------|:-------------:|:------------:|:-------------------------:|:---------------:|:--------------:|:------:| 
| Account settings*       |     W         |      -        |            -              |        R        |       R        |   R    |
| Audit logs              |     R         |      -        |            -              |        -        |       R        |   R    |
| Auth provider           |     W         |      -        |            -              |        -        |       W        |   R    |
| Billing                 |     W         |       W       |            -              |        -        |       -        |   R    |
| Connections             |     W         |      -        |            -              |        W        |       -        |   -    |
| Groups                  |     W         |      -        |            -              |        R        |       W        |   R    |
| Invitations             |     W         |      -        |            -              |        W        |       W        |   R    |
| IP restrictions         |     W         |      -        |            -              |        -        |       W        |   R    |
| Licenses                |     W         |      -        |            -              |        W        |       W        |   R    |
| Marketplace app         |     -         |      -        |            W              |        -        |       -        |   -    |
| Members                 |     W         |      -        |            -              |        W        |       W        |   R    |
| Project (create)        |     W         |      -        |            -              |        W        |       -        |   -    |
| Public models           |     R         |       R       |            -              |        R        |       R        |   R    |
| Service tokens          |     W         |      -        |            -              |        -        |       R        |   R    |
| Webhooks                |     W         |      -        |            -              |        -        |       -        |   -    |
`}

</SortableTable>

\* Permission sets with write (**W**) access to Account settings can modify account-level settings, including [setting up Slack notifications](/docs/deploy/job-notifications#slack-notifications).


#### Project access for account permissions
 
 <SortableTable>

{`
|Project-level permission | Account Admin | Billing admin | Project creator | Security admin | Viewer | 
|:-------------------------|:-------------:|:-------------:|:---------------:|:--------------:|:------:| 
| Environment credentials |       W       |      -        |       W         |       -        |   R    |
| Custom env. variables   |       W       |      -        |       W         |       -        |   R    |
| Data platform configurations|   W       |      -        |       W         |       -        |   R    |
| Develop (IDE or CLI)       | W       |      -        |       W         |       -        |   -    |
| Environments            |       W       |      -        |       W         |       -        |   R    |
| Jobs                    |       W       |      -        |       W         |       -        |   R    |
| Metadata GraphQL API access |   R       |      -        |       R         |       -        |   R    |
| Permissions             |       W       |      -        |       W         |       W        |   R    |
| Projects                |       W       |      -        |       W         |       R        |   R    |
| Repositories            |       W       |      -        |       W         |       -        |   R    |
| Runs                    |       W       |      -        |       W         |       -        |   R    |
| Semantic Layer config   |       W       |      -        |       W         |       v        |   R    |
`}

</SortableTable>

### Project permissions
 
The project permission sets enable you to work within the projects in various capacities. They primarily provide access to project-level permissions such as repos and the <Constant name="cloud_ide" /> or <Constant name="cloud_cli" />, but may also provide some account-level permissions.

Key:

* **(W)rite** &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* **(R)ead** &mdash; Can view but can not create or change any fields.

#### Account access for project permissions
 
<SortableTable>

{`
| Account-level permission | Admin | Analyst | Database admin | Developer | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder | Team admin |
|--------------------------|:-----:|:-------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:-----------:|:--------:|:--------------:|:-----------:|:----------:| 
| Account settings         |   R   |    -    |      R         |     -     |     R     |     -     |     -       |      -      |    -     |        -       |      -      |     R      |
| Auth provider            |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Billing                  |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Connections              |   R   |    R    |      W         |     R     |     R     |     R     |     -       |      -      |    -     |        -       |      R      |     R      |
| Groups                   |   R   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |
| Invitations              |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      R      |     R      |
| Licenses                 |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      -      |     R      |
| Members                  |   W   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |
| Project (create)         |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Public models            |   R   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |     R    |        R       |      R      |     R      |
| Service tokens           |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Webhooks                 |   W   |    -    |      -         |     W     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
`}

</SortableTable>

#### Project access for project permissions

<SortableTable> 

{`
|Project-level permission  | Admin | Analyst | Database admin | Developer | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder | Team admin |
|--------------------------|:-----:|:-------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:-----------:|:---------------------------------------:|:--------------:|:-----------:|:----------:| 
| Environment credentials  |   W   |    W    |       W        |     R     |     R     |     W     |    -        |      -      |                  -                      |        -       |     R       |     R      |
| Custom env. variables    |   W   |    W#  |       W         |     W#   |     W     |     W     |     -       |      R      |                  -                      |        -       |     R       |     W      |
| Data platform configs    |   W   |    W    |       W        |     W     |     R     |     W     |     -       |      -      |                  -                      |       -        |     R       |     R      |
| Develop (IDE or CLI)     |   W   |    W    |       -        |     W     |     -     |     -     |     -       |      -      |                  -                      |       -        |     -       |      -     |
| Environments             |   W   |    R    |       R        |     R     |     R     |     W     |      -      |      R      |                  -                      |       -        |     R       |     R      |
| Jobs                     |   W   |    R*   |       R*       |     R*    |     R*    |     W     |      R      |      R      |                  -                      |       -        |     R       |     R*     |
| Metadata GraphQL API access| R   |    R    |       R        |     R     |     R     |     R     |      -      |      R      |                  R                      |       -        |     R       |     R      |
| Permissions              |   W   |    -    |       R        |     R     |     R     |     -     |      -      |      -      |                  -                      |       -        |     -       |     R      |
| Projects                 |   W   |    R    |       W        |     R     |     W     |     R     |      -      |      R      |                  -                      |       -        |     R       |     W      |
| Repositories             |   W   |   -     |       R        |     R     |     W     |     -     |      -      |      -      |                  -                      |       -        |     R       |     R      |
| Runs                     |   W   |    R*   |       R*       |     R*    |     R*    |     W     |      W      |      R      |                  -                      |       -        |     R       |     R*     |
| Semantic Layer config    |   W   |    R    |       W        |     R     |     R     |     R     |      -      |      -      |                  -                      |        W       |     R       |     R      |

`}

</SortableTable>

\* These permissions are `R`ead-only by default, but may be changed to `W`rite with [environment permissions](/docs/cloud/manage-access/environment-permissions#environments-and-roles).

\# Custom env. variables for the `Developer` and `Analyst` roles are set in the **Credentials** section of **Account settings**.
