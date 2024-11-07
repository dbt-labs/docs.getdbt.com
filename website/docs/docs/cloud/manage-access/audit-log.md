---
title: "The audit log for dbt Cloud Enterprise"
id: audit-log
description: "You can troubleshoot possible issues and provide security audits by reviewing event activity in your organization."
sidebar_label: "Audit log"
pagination_next: null
pagination_prev: "docs/cloud/manage-access/about-user-access"
---

To review actions performed by people in your organization, dbt provides logs of audited user and system events in real time. The audit log appears as events happen and includes details such as who performed the action, what the action was, and when it was performed. You can use these details to troubleshoot access issues, perform security audits, or analyze specific events. 

You must be an **Account Admin** or an **Account Viewer** to access the audit log and this feature is only available on Enterprise plans.

The dbt Cloud audit log stores all the events that occurred in your organization in real-time, including:

- For events within 90 days, the dbt Cloud audit log has a selectable date range that lists events triggered.
- For events beyond 90 days, **Account Admins** and **Account Viewers** can [export all events](#exporting-logs) by using **Export All**.

## Accessing the audit log

To access the audit log, click the gear icon in the top right, then click **Audit Log**.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-menu.png" width="30%" title="Audit log menu"/>

## Understanding the audit log

On the audit log page, you will see a list of various events and their associated event data. Each of these events show the following information in dbt:

* **Event name**: Action that was triggered
* **Agent**: User who triggered that action/event
* **Timestamp**: Local timestamp of when the event occurred

### Event details

Click the event card to see the details about the activity that triggered the event. This view provides important details, including when it happened and what type of event was triggered. For example, if someone changes the settings for a job, you can use the event details to see which job was changed (type of event: `job_definition.Changed`), by whom (person who triggered the event: `actor`), and when (time it was triggered: `created_at_utc`). For types of events and their descriptions, see [Events in audit log](#audit-log-events).

The event details provide the key factors of an event:

| Name                 | Description                                   |
| -------------------- | --------------------------------------------- |
| account_id           | Account ID of where the event occurred        |
| actor                | Actor that carried out the event - User or Service    |
| actor_id             | Unique ID of the actor                        |
| actor_ip             | IP address of the actor                       |
| actor_name           | Identifying name of the actor                 |
| actor_type           | Whether the action was done by a user or an API request |
| created_at           | UTC timestamp of when the event occurred      |
| event_type           | Unique key identifying the event              |
| event_context        | This key will be different for each event and will match the event_type. This data will include all the details about the object(s) that was changed. |
| id                   | Unique ID of the event                        |
| service              | Service that carried out the action           |
| source               | Source of the event - dbt Cloud UI or API     |

## Audit log events

The audit log supports various events for different objects in dbt Cloud. You will find events for authentication, environment, jobs, service tokens, groups, user, project, permissions, license, connection, repository, and credentials.

### Authentication

| Event Name                 | Event Type                               | Description                                            |
| -------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Auth Provider Changed      | auth_provider.Changed          | Authentication provider settings changed               |
| Credential Login Succeeded | auth.CredentialsLoginSucceeded | User successfully logged in with username and password |
| SSO Login Failed           | auth.SsoLoginFailed            | User login via SSO failed                              |
| SSO Login Succeeded        | auth.SsoLoginSucceeded         | User successfully logged in via SSO                    |

### Environment

| Event Name          | Event Type                    | Description                          |
| ------------------- | ----------------------------- | ------------------------------------ |
| Environment Added   | environment.Added   | New environment successfully created |
| Environment Changed | environment.Changed | Environment settings changed         |
| Environment Removed | environment.Removed | Environment successfully removed     |

### Jobs

| Event Name  | Event Type                        | Description                  |
| ----------- | --------------------------------- | ---------------------------- |
| Job Added   | job_definition.Added   | New Job successfully created |
| Job Changed | job_definition.Changed | Job settings changed         |
| Job Removed | job_definition.Removed | Job definition removed       |

### Service Token

| Event Name            | Event Type                       | Description                                |
| --------------------- | -------------------------------- | ------------------------------------------ |
| Service Token Created | service_token.Created | New Service Token was successfully created |
| Service Token Revoked | service_token.Revoked | Service Token was revoked                  |

### Group

| Event Name    | Event Type                    | Description                    |
| ------------- | ----------------------------- | ------------------------------ |
| Group Added   | user_group.Added   | New Group successfully created |
| Group Changed | user_group.Changed | Group settings changed         |
| Group Removed | user_group.Removed | Group successfully removed     |

### User

| Event Name                   | Event Type                          | Description                                     |
| ---------------------------- | ----------------------------------- | ----------------------------------------------- |
| Invite Added                 | invite.Added              | User invitation added and sent to the user      |
| Invite Redeemed              | invite.Redeemed           | User redeemed invitation                        |
| User Added to Account        | account.UserAdded         | New user added to the account                   |
| User Added to Group          | user_group_user.Added     | An existing user is added to a group            |
| User Removed from Account    | account.UserRemoved       | User removed from the account
| User Removed from Group      | user_group_user.Removed   | An existing user is removed from a group        |
| Verification Email Confirmed | user.jit.email.Confirmed  | Email verification confirmed by user            |
| Verification Email Sent      | user.jit.email.Sent       | Email verification sent to user created via JIT |

### Project

| Event Name      | Event Type                | Description              |
| --------------- | ------------------------- | ------------------------ |
| Project Added   | project.Added   | New project added        |
| Project Changed | project.Changed | Project settings changed |
| Project Removed | project.Removed | Project is removed       |

### Permissions

| Event Name              | Event Type                   | Description                    |
| ----------------------- | ---------------------------- | ------------------------------ |
| User Permission Added   | permission.Added   | New user permissions are added |
| User Permission Removed | permission.Removed | User permissions are removed   |

### License

| Event Name              | Event Type                     | Description                               |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| License Mapping Added   | license\_map.Added   | New user license mapping is added         |
| License Mapping Changed | license\_map.Changed | User license mapping settings are changed |
| License Mapping Removed | license\_map.Removed | User license mapping is removed           |

### Connection

| Event Name         | Event Type                   | Description                                |
| ------------------ | ---------------------------- | ------------------------------------------ |
| Connection Added   | connection.Added   | New Data Warehouse connection added        |
| Connection Changed | connection.Changed | Data Warehouse Connection settings changed |
| Connection Removed | connection.Removed | Data Warehouse connection removed          |

### Repository

| Event Name         | Event Type                   | Description                 |
| ------------------ | ---------------------------- | --------------------------- |
| Repository Added   | repository.Added   | New repository added        |
| Repository Changed | repository.Changed | Repository settings changed |
| Repository Removed | repository.Removed | Repository removed          |

### Credentials

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| Credentials Added to Project     | credentials.Added   | Project credentials added        |
| Credentials Changed in Project   | credentials.Changed | Credentials changed in project   |
| Credentials Removed from Project | credentials.Removed | Credentials removed from project |


### Git integration

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| GitLab Application Changed        | gitlab_application.changed    | GitLab configuration in dbt Cloud changed |

### Webhooks

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| Webhook Subscriptions Added      | webhook_subscription.added    | New webhook configured in settings |
| Webhook Subscriptions Changed    | webhook_subscription.changed  | Existing webhook configuration altered |
| Webhook Subscriptions Removed    | webhook_subscription.removed  | Existing webhook deleted  |


### Semantic Layer

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| Semantic Layer Config Added      | semantic_layer_config.added   | Semantic Layer config added |
| Semantic Layer Config Changed      | semantic_layer_config.changed  | Semantic Layer config (not related to credentials) changed |
| Semantic Layer Config Removed    | semantic_layer_config.removed   | Semantic Layer config removed |
| Semantic Layer Credentials Added | semantic_layer_credentials.added   | Semantic Layer credentials added |
| Semantic Layer Credentials Changed| semantic_layer_credentials.changed   | Semantic Layer credentials changed. Does not trigger semantic_layer_config.changed|
| Semantic Layer Credentials Removed| semantic_layer_credentials.removed   | Semantic Layer credentials removed |

### Extended attributes

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| Extended Attribute Added         | extended_attributes.added     | Extended attribute added to a project |
| Extended Attribute Changed       | extended_attributes.changed   | Extended attribute changed or removed |


### Account-scoped personal access token

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| Account Scoped Personal Access Token Created | account_scoped_pat.created | An account-scoped PAT was created |
| Account Scoped Personal Access Token Deleted | account_scoped_pat.deleted | An account-scoped PAT was deleted | 

### IP restrictions

| Event Name                       | Event Type                    | Description            |
| -------------------------------- | ----------------------------- | -----------------------|
| IP Restrictions Toggled          | ip_restrictions.toggled       | IP restrictions feature enabled or disabled |
| IP Restrictions Rule Added       | ip_restrictions.rule.added    | IP restriction rule created |
| IP Restrictions Rule Changed     | ip_restrictions.rule.changed   | IP restriction rule edited |
| IP Restrictions Rule Removed     | ip_restrictions.rule.removed   | IP restriction rule deleted |



## Searching the audit log

You can search the audit log to find a specific event or actor, which is limited to the ones listed in [Events in audit log](#events-in-audit-log). The audit log successfully lists historical events spanning the last 90 days. You can search for an actor or event using the search bar, and then narrow your results using the time window.


<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-search.png" width="95%" title="Use search bar to find content in the audit log"/>


## Exporting logs

You can use the audit log to export all historical audit results for security, compliance, and analysis purposes:

- **For events within 90 days** &mdash; dbt Cloud will automatically display the 90-day selectable date range. Select **Export Selection** to download a CSV file of all the events that occurred in your organization within 90 days.

- **For events beyond 90 days** &mdash; Select **Export All**. The Account Admin or Account Viewer will receive an email link to download a CSV file of all the events that occurred in your organization.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-section.jpg" width="95%" title="View audit log export options"/>
