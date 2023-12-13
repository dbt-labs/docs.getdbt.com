---
title: "Infer configurations"
description: "Read this guide to understand how to configure Infer with dbt."
id: "infer-configs"
---


## Authentication

To connect to Infer from your dbt instance you need to set up a correct profile in your `profiles.yml`.

The format of this should look like this:

<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: infer
      url: "<infer-api-endpoint>"
      username: "<infer-api-username>"
      apikey: "<infer-apikey>"
      data_config:
        [configuration for your underlying data warehouse]  
```

</File>

### Description of Infer Profile Fields

| Field      | Required | Description                                                                                                                                       |
|------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`     | Yes | Must be set to `infer`. This must be included either in `profiles.yml` or in the `dbt_project.yml` file.                                          |
| `url`      | Yes | The host name of the Infer server to connect to. Typically this is `https://app.getinfer.io`.                                                     |
| `username` | Yes | Your Infer username - the one you use to login.                                                                                                   |
| `apikey`   | Yes | Your Infer api key.                                                                                                                               |
| `data_config` | Yes | The configuration for your underlying data warehouse. The format of this follows the format of the configuration for your data warehouse adapter. |
