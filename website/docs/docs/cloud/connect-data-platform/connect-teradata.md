---
title: "Connect Teradata"
id: connect-teradata
description: "Configure the Teradata platform connection in dbt Cloud."
sidebar_label: "Connect Teradata"
---

# Connect Teradata <Lifecycle status="preview" />

Your environment(s) must be on ["Versionless"](/docs/dbt-versions/versionless-cloud) to use the Teradata connection.

| Field                         | Description                                                                                   | Type           | Required? | Example |
| ----------------------------- | --------------------------------------------------------------------------------------------- | -------------- | --------- | ------- |
| Host                          | Host name of your Teradata environment.                                                        | String         | Required  | host-name.env.clearscape.teradata.com |
| Port                          | The database port number. Equivalent to the Teradata JDBC Driver DBS_PORT connection parameter.| Quoted integer | Optional  | 1025 |
| Retries                       | Number of times to retry to connect to database upon error.                                   | Integer        | optional  | 10 |
| Request timeout               | The waiting period between connections attempts in seconds. Default is "1" second.            | Quoted integer | Optional  | 3 |

<Lightbox src="/img/docs/dbt-cloud/teradata-connection.png" title="Example of the Teradata connection fields." />

### Development and deployment credentials

| Field                         | Description                                                                                   | Type           | Required? | Example            |
| ------------------------------|-----------------------------------------------------------------------------------------------|----------------|-----------|--------------------|
| Username                      | The database username. Equivalent to the Teradata JDBC Driver USER connection parameter.      | String         | Required  | database_username |
| Password                      | The database password. Equivalent to the Teradata JDBC Driver PASSWORD connection parameter.  | String         | Required  | DatabasePassword123 |
| Schema                        | Specifies the initial database to use after login, rather than the user's default database.   | String         | Required  | dbtlabsdocstest |

<Lightbox src="/img/docs/dbt-cloud/teradata-deployment.png" title="Example of the developer credential fields." />
