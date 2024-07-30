
There are 3 roles available for self-service dbt Cloud accounts:

- **Owner** &mdash; Full access to account features.
- **Member** &mdash; Robust access to the account with restrictions on features that can alter billing or security.
- **Read-only** &mdash; Read-only access to features.

Key:

* (W)rite &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `read`.
* (R)ead &mdash; Can view but can not create or change any fields.
* No value &mdash; No access to the feature.

Permissions: 

* Account-level permissions &mdash; Permissions related to management of the dbt Cloud account. For example, billing and account settings.
* Project-level permissions &mdash; Permissions related to the projects in dbt Cloud. For example, repos and access to the IDE or dbt Cloud CLI. 


#### Account permissions for account roles

| Account-level permission| Owner | Member | Read-only |
|:-------------------------|:----:|:------:|:---------:|
| Account settings        |   W   |   W    |           |
| Audit logs              |   R   |        |           |
| Auth provider           |   W   |        |           |
| Billing                 |   W   |        |           |
| Groups                  |   W   |   R    |    R      |
| Invitations             |   W   |   W    |    R      |
| Licenses                |   W   |   R    |           |
| Members                 |   W   |   R    |    R      |
| Project (create)        |   W   |   W    |           |
| Public models           |   R   |   R    |    R      |
| Service tokens          |   W   |        |           |
| Webhooks                |   W   |   W    |           |

#### Project permissions for account roles

|Project-level permission | Owner | Member  | Read-only | 
|:------------------------|:-----:|:-------:|:---------:|
| Adapters                |   W   |    W    |    R      | 
| Connections             |   W   |    W    |    R      |
| Credentials             |   W   |    W    |    R      |
| Custom env. variables   |   W   |    W    |    R      |
| dbt adapters            |   W   |    W    |           |
| Develop (IDE or dbt Cloud CLI)| W |  W    |           |
| Environments            |   W   |    W    |    R      |
| Jobs                    |   W   |    W    |    R      |
| Metadata                |   R   |    R    |    R      |
| Permissions             |   W   |    R    |           |
| Profile                 |   W   |    W    |    R      |
| Projects                |   W   |    W    |    R      |
| Repositories            |   W   |    W    |    R      |
| Runs                    |   W   |    W    |    R      |
| Semantic Layer Config   |   W   |    W    |    R      |


