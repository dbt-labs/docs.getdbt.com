
Permissions: 

* Account-level permissions &mdash; Permissions related to the management of the dbt Cloud account. For example, billing and account settings.
* Project-level permissions &mdash; Permissions related to the projects in dbt Cloud. For example, repos and access to the dbt Cloud IDE or dbt Cloud CLI. 

### Account roles
Account roles enable you to manage the dbt Cloud account and manage the account settings (for example, generating service tokens, inviting users, and configuring SSO). They also provide project-level permissions. The **Account Admin** role is the highest level of access you can assign.  

Key:

* (W)rite &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* (R)ead &mdash; Can view but can not create or change any fields.

#### Account permissions for account roles

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

\* Roles with write (**W**) access to Account settings can modify account-level settings, including [setting up Slack notifications](/docs/deploy/job-notifications#slack-notifications).


#### Project permissions for account roles
 
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

### Project role permissions
 
The project roles enable you to work within the projects in various capacities. They primarily provide access to project-level permissions such as repos and the IDE or dbt Cloud CLI, but may also provide some account-level permissions.

Key:

* (W)rite &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `develop`.
* (R)ead &mdash; Can view but can not create or change any fields.

#### Account permissions for project roles
 
<SortableTable>

{`
| Account-level permission | Admin | Analyst | Database admin | Developer | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder | Team admin | Webhook |
|--------------------------|:-----:|:-------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:-----------:|:--------:|:--------------:|:-----------:|:----------:|:-------:|  
| Account settings         |   R   |    -    |      R         |     -     |     R     |     -     |     -       |      -      |    -     |        -       |      -      |     R      |    -    |
| Auth provider            |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |    -    |
| Billing                  |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |    -    |
| Connections              |   R   |    R    |      R         |     R     |     R     |     R     |     -       |      -      |    -     |        -       |      R      |     R      |    -    |
| Groups                   |   R   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |    -    |
| Invitations              |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      R      |     R      |    -    |
| Licenses                 |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      -      |     R      |    -    |
| Members                  |   W   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |    -    |
| Project (create)         |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |    -    |
| Public models            |   R   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |     R    |        R       |      R      |     R      |    R    |
| Service tokens           |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |    -    |
| Webhooks                 |   W   |    -    |      -         |     W     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |    W    |
`}

</SortableTable>

#### Project permissions for project roles

<SortableTable> 

{`
|Project-level permission  | Admin | Analyst | Database admin | Developer | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder | Team admin | Webhook |
|--------------------------|:-----:|:-------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:-----------:|:---------------------------------------:|:--------------:|:-----------:|:----------:|:-------:|  
| Environment credentials  |   W  |    W     |       W        |     W     |     R     |     W     |    -        |      -      |                  -                      |        -       |     R       |     R      |   -     |
| Custom env. variables    |   W  |    W     |       W        |     W     |     W     |     W     |     -       |      R      |                  -                      |        -       |     R       |     W      |   -     |
| Data platform configs    |   W   |    W    |       W        |     W     |     R     |     W     |     -       |      -      |                  -                      |       -        |     R       |     R      |    -    |
| Develop (IDE or CLI)     |   W   |    W    |       -        |     W     |     -     |     -     |     -       |      -      |                  -                      |       -        |     -       |      -     |    -    |
| Environments             |   W   |    R    |       R        |     R     |     R     |     W     |      -      |      R      |                  -                      |       -        |     R       |     R      |    -    |
| Jobs                     |   W   |    R*   |       R*       |     R*    |     R*    |     W     |      R      |      R      |                  -                      |       -        |     R       |     R*     |    -    |
| Metadata GraphQL API access| R   |    R    |       R        |     R     |     R     |     R     |      -      |      R      |                  R                      |       -        |     R       |     R      |    -    |
| Permissions              |   W   |    -    |       R        |     R     |     R     |     -     |      -      |      -      |                  -                      |       -        |     -       |     R      |    -    |
| Projects                 |   W   |    W    |       W        |     W     |     W     |     R     |      -      |      R      |                  -                      |       -        |     R       |     W      |    -    |
| Repositories             |   W   |   -     |       R        |     R     |     W     |     -     |      -      |      -      |                  -                      |       -        |     R       |     R      |    -    |
| Runs                     |   W   |    R*   |       R*       |     R*    |     R*    |     W     |      W      |      R      |                  -                      |       -        |     R       |     R*     |    -    |
| Semantic Layer config    |   W   |    R    |       W        |     R     |     R     |     R     |      -      |      -      |                  -                      |        W       |     R       |     R      |    -    |

`}

</SortableTable>

\* These permissions are `R`ead-only by default, but may be changed to `W`rite with [environment permissions](/docs/cloud/manage-access/environment-permissions#environments-and-roles).
