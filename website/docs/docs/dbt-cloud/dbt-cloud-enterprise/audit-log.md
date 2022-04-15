---
title: "Using the Audit Log for dbt Cloud Enterprise"
id: audit-log
description: "You can review actions in your organization, which can help troubleshoot issues and secure organization."
sidebar_label: "Using the Audit log"
---

dbt Cloud’s Audit Log allows you to quickly review the actions performed by members of your organization. It includes details such as who performed the action, what the action was, and when it was performed. These details can be used in various troubleshooting and security scenarios.

## Accessing the Audit Log

To access Audit Log, click **Account Settings** and **Audit Log**

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-menu.png" title="Click Audit log in the Account settings menu."/>

## Exploring the Audit Log

Audit Log lists all the events that occurred in your organization within the last 90 days. Audit Log is only accessible by the Org Owner. Once you get to the Audit Log page, you will see a list of various events and their associated event data. Each of these events have the following information on the main UI:

1. **Event name** - Action that was triggered
2. **Agent** - User that triggered that action/event
3. **Timestamp** - Local timestamp of when the event occurred

### Detailed Event View

Clicking on the event card opens a detailed view of the event. This displays granular information about the event. This view can be helpful in identifying details about the event. For example, if the settings for a job were changed, you can use the detailed event view to understand which job was changed, by whom, and when. This detailed view has the following information:

| Name                 | Description                                   |
| -------------------- | --------------------------------------------- |
| account_id           | Account ID of where the event occurred        |
| actor                | Actor that carried out the event - User or Service    |
| actor_id             | Unique ID of the actor                        |
| actor_ip             | IP address of the actor                       |
| actor_name           | Identifying name of the actor                 |
| created_at_utc       | UTC timestamp on when the event occurred      |
| event_type           | Unique key identifying the event              |
| id                   | Unique ID of the event                        |
| service              | Service that carried out the action           |
| source               | Source of the event - dbt Cloud UI or API     |
| v1.events.event_type | This key will be different for each event and will match the event_type. This data will include all the details about the object(s) that was changed. |

## Events in Audit Log

Currently, the Audit Log supports various events for different objects in dbt Cloud. The following events are currently supported:

### Authentication

| Event Name                 | Event Type                               | Description                                            |
| -------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Auth Provider Changed      | v1.events.auth_provider.Changed         | Authentication provider settings changed               |
| Credential Login Failed    | v1.events.auth.CredentialsLoginFailed    | User login via username and password failed            |
| Credential Login Succeeded | v1.events.auth.CredentialsLoginSucceeded | User successfully logged in with username and password |
| SSO Login Failed           | v1.events.auth.SsoLoginFailed            | User login via SSO failed                              |
| SSO Login Succeeded        | v1.events.auth.SsoLoginSucceeded         | User successfully logged in via SSO  

### Environment

| Event Name          | Event Type                    | Description                          |
| ------------------- | ----------------------------- | ------------------------------------ |
| Environment Added   | v1.events.environment.Added   | New environment successfully created |
| Environment Changed | v1.events.environment.Changed | Environment settings changed         |
| Environment Removed | v1.events.environment.Removed | Environment successfully removed     |

### Jobs

| Event Name  | Event Type                        | Description                  |
| ----------- | --------------------------------- | ---------------------------- |
| Job Added   | v1.events.job_definition.Added   | New Job successfully created |
| Job Changed | v1.events.job_definition.Changed | Job settings changed         |
| Job Removed | v1.events.job_definition.Removed | Job definition removed       |

### Service Token

| Event Name            | Event Type                       | Description                                |
| --------------------- | -------------------------------- | ------------------------------------------ |
| Service Token Created | v1.events.service_token.Created | New Service Token was successfully created |
| Service Token Revoked | v1.events.service_token.Revoked | Service Token was revoked                  |

### Group

| Event Name    | Event Type                    | Description                    |
| ------------- | ----------------------------- | ------------------------------ |
| Group Added   | v1.events.user_group.Added   | New Group successfully created |
| Group Changed | v1.events.user_group.Changed | Group settings changed         |
| Group Removed | v1.events.user_group.Changed | Group successfully removed     |

### User

| Event Name                   | Event Type                          | Description                                     |
| ---------------------------- | ----------------------------------- | ----------------------------------------------- |
| Invite Added                 | v1.events.invite.Added              | User invitation added and sent to the user      |
| Invite Redeemed              | v1.events.invite.Redeemed           | User redeemed invitation                        |
| User Added to Account        | v1.events.account.UserAdded         | New user added to the account                   |
| User Added to Group          | v1.events.user_group_user.Added     | An existing user is added to a group            |
| User Removed from Account    | v1.events.account.UserRemoved       | User removed from the account
| User Removed from Group      | v1.events.user_group_user.Removed   | An existing user is removed from a group        |
| Verification Email Confirmed | v1.events.user.jit.email.Confirmed  | Email verification confirmed by user            |
| Verification Email Sent      | v1.events.user.jit.email.Sent       | Email verification sent to user created via JIT |

### Project

| Event Name      | Event Type                | Description              |
| --------------- | ------------------------- | ------------------------ |
| Project Added   | v1.events.project.Added   | New project added        |
| Project Changed | v1.events.project.Changed | Project settings changed |
| Project Removed | v1.events.project.Removed | Project is removed       |

### Permissions

| Event Name              | Event Type                   | Description                    |
| ----------------------- | ---------------------------- | ------------------------------ |
| User Permission Added   | v1.events.permission.Added   | New user permissions are added |
| User Permission Removed | v1.events.permission.Removed | User permissions are removed   |

### License

| Event Name              | Event Type                     | Description                               |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| License Mapping Added   | v1.events.license\_map.Added   | New user license mapping is added         |
| License Mapping Changed | v1.events.license\_map.Changed | User license mapping settings are changed |
| License Mapping Removed | v1.events.license\_map.Removed | User license mapping is removed           |

### Connection

| Event Name         | Event Type                   | Description                                |
| ------------------ | ---------------------------- | ------------------------------------------ |
| Connection Added   | v1.events.connection.Added   | New Data Warehouse connection added        |
| Connection Changed | v1.events.connection.Changed | Data Warehouse Connection settings changed |
| Connection Removed | v1.events.connection.Removed | Data Warehouse connection removed          |

### Repository

| Event Name         | Event Type                   | Description                 |
| ------------------ | ---------------------------- | --------------------------- |
| Repository Added   | v1.events.repository.Added   | New repository added        |
| Repository Changed | v1.events.repository.Changed | Repository settings changed |
| Repository Removed | v1.events.repository.Removed | Repository removed          |

### Credentials

| Event Name                       | Event Type                    | Description                      |
| -------------------------------- | ----------------------------- | -------------------------------- |
| Credentials Added to Project     | v1.events.credentials.Added   | Project credentials added        |
| Credentials Changed in Project   | v1.events.credentials.Changed | Credentials changed in project   |
| Credentials Removed from Project | v1.events.credentials.Removed | Credentials removed from project |

## Searching the Audit Log

Audit Log also supports search. Currently, search is limited to the events and actors that are listed in the section above. Audit Log successfully lists historical events spanning the last 90 days. To search, search for an actor or event in the search bar and narrow your results based on the time window.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-search.png" title="Find content in the audit log"/>


## Exporting Logs

Audit Log also allows you to export historical audit results for security, compliance, and analysis purposes. You can export data for up to the last 90 days. Clicking on the Export CSV button downloads a CSV file of all the events that occurred in your org over the last two weeks.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-export-csv.png" title="Export the CSV file by clicking the icon."/>
