---
title: "MaxCompute setup"
description: "Read this guide to learn about the MaxCompute setup in dbt."
meta:
  maintained_by: Alibaba Cloud MaxCompute Team
  authors: "Alibaba Cloud MaxCompute Team"
  github_repo: "aliyun/dbt-maxcompute"
  pypi_package: "dbt-maxcompute"
  min_core_version: "v1.8.0"
  cloud_support: Not Supported
  platform_name: "MaxCompute"
  config_page: "/reference/resource-configs/no-configs"
---

import SetUpPages from '/snippets/\_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to MaxCompute with **dbt-maxcompute**

Check out the dbt profile configuration below for details.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-maxcompute: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: PROJECT_ID
      schema: SCHEMA_NAME
      endpoint: ENDPOINT
      auth_type: access_key
      access_key_id: ACCESS_KEY_ID
      access_key_secret: ACCESS_KEY_SECRET
```

</File>

Currently it supports the following parameters:

| **Field**           | **Description**                                                                                                              | Required? | **Example**                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------ |
| `type`              | Specifies the type of database connection; must be set to "maxcompute" for MaxCompute connections.                           | Required  | `maxcompute`                                           |
| `project`           | The name of your MaxCompute project.                                                                                         | Required  | `dbt-project`                                          |
| `endpoint`          | The endpoint URL for connecting to MaxCompute.                                                                               | Required  | `http://service.cn-shanghai.maxcompute.aliyun.com/api` |
| `schema`            | The namespace schema that the models will use in MaxCompute.                                                                 | Required  | `default`                                              |
| `auth_type`         | Authentication type for accessing MaxCompute                                                                                 | Required  | `access_key`                                           |
| `access_key_id`     | The Access ID for authentication with MaxCompute.                                                                            | Required  | `XXX`                                                  |
| `access_key_secret` | The Access Key for authentication with MaxCompute.                                                                           | Required  | `XXX`                                                  |

See the section below for other authentication type.

## Authentication Configuration

`dbt-maxcompute` is a dbt adapter that allows you to seamlessly integrate with Alibaba Cloud's MaxCompute service, enabling you to build and manage your data transformations using dbt. To ensure secure and flexible access to MaxCompute, `dbt-maxcompute` leverages the [credentials-python](https://github.com/aliyun/credentials-python) library, which provides comprehensive support for various authentication methods supported by Alibaba Cloud.

With `dbt-maxcompute`, you can utilize all the authentication mechanisms provided by `credentials-python`, ensuring that your credentials are managed securely and efficiently. Whether you're using Access Keys, STS Tokens, RAM Roles, or other advanced authentication methods, `dbt-maxcompute` has got you covered.

### Key Notes on Configuration

To avoid ambiguity in configuration options, some parameter names have been adjusted compared to those used in `credentials-python`. Specifically:

- `type` becomes `auth_type`
- `policy` becomes `auth_policy`
- `host` becomes `auth_host`
- `timeout` becomes `auth_timeout`
- `connect_timeout` becomes `auth_connect_timeout`
- `proxy` becomes `auth_proxy`

These changes ensure clarity and consistency across different authentication methods while maintaining compatibility with the underlying `credentials-python` library.

## Usage

Before you begin, you need to sign up for an Alibaba Cloud account and retrieve your [Credentials](https://usercenter.console.aliyun.com/#/manage/ak).

### Credential Type

#### Access Key

Setup access_key credential through [User Information Management][ak], it have full authority over the account, please keep it safe. Sometimes for security reasons, you cannot hand over a primary account AccessKey with full access to the developer of a project. You may create a sub-account [RAM Sub-account][ram] , grant its [authorization][permissions]，and use the AccessKey of RAM Sub-account.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: access_key # credential type, Optional, default is 'access_key'
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
```

#### STS

Create a temporary security credential by applying Temporary Security Credentials (TSC) through the Security Token Service (STS).

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: sts # credential type
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken  # STS Token
```

#### RAM Role ARN

By specifying [RAM Role][RAM Role], the credential will be able to automatically request maintenance of STS Token. If you want to limit the permissions([How to make a policy][policy]) of STS Token, you can assign value for `Policy`.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: ram_role_arn # credential type
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken  # STS Token
      role_arn: roleArn # Format: acs:ram::USER_ID:role/ROLE_NAME
      role_session_name: roleSessionName # Role Session Name
      auth_policy: policy # Not required, limit the permissions of STS Token
      role_session_expiration: 3600 # Not required, limit the Valid time of STS Token
```

#### OIDC Role ARN

By specifying [OIDC Role][OIDC Role], the credential will be able to automatically request maintenance of STS Token. If you want to limit the permissions([How to make a policy][policy]) of STS Token, you can assign value for `Policy`.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: oidc_role_arn # credential type
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken # STS Token
      role_arn: roleArn # Format: acs:ram::USER_ID:role/ROLE_NAME
      oidc_provider_arn: oidcProviderArn # Format: acs:ram::USER_Id:oidc-provider/OIDC Providers
      oidc_token_file_path: /Users/xxx/xxx # oidc_token_file_path can be replaced by setting environment variable: ALIBABA_CLOUD_OIDC_TOKEN_FILE
      role_session_name: roleSessionName # Role Session Name
      auth_policy: policy # Not required, limit the permissions of STS Token
      role_session_expiration: 3600 # Not required, limit the Valid time of STS Token
```

#### ECS RAM Role

Both ECS and ECI instances support binding instance RAM roles. When the Credentials tool is used in an instance, the RAM role bound to the instance will be automatically obtained, and the STS Token of the RAM role will be obtained by accessing the metadata service to complete the initialization of the credential client.

The instance metadata server supports two access modes: hardened mode and normal mode. The Credentials tool uses hardened mode (IMDSv2) by default to obtain access credentials. If an exception occurs when using hardened mode, you can set disable_imds_v1 to perform different exception handling logic:

- When the value is false (default value), the normal mode will continue to be used to obtain access credentials.

- When the value is true, it means that only hardened mode can be used to obtain access credentials, and an exception will be thrown.

Whether the server supports IMDSv2 depends on your configuration on the server.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: ecs_ram_role # credential type
      role_name: roleName # `role_name` is optional. It will be retrieved automatically if not set. It is highly recommended to set it up to reduce requests.
      disable_imds_v1: True # Optional, whether to forcibly disable IMDSv1, that is, to use IMDSv2 hardening mode, which can be set by the environment variable ALIBABA_CLOUD_IMDSV1_DISABLED
```

#### Credentials URI

By specifying a credentials uri, get credential from the local or remote uri, the credential will be able to automatically request maintenance to keep it update.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: credentials_uri # credential type
      credentials_uri: http://local_or_remote_uri/ # Credentials URI
```

#### Bearer

If credential is required by the Cloud Call Centre (CCC), please apply for Bearer Token maintenance by yourself.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: bearer # credential type
      bearer_token: bearerToken # BearerToken
```

### Use the credential provider chain

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Replace this with your project name
      schema: default # Replace this with schema name, e.g. dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Replace this with your maxcompute endpoint
      auth_type: chain
```

The default credential provider chain looks for available credentials, with following order:

1. Environment Credentials

    Look for environment credentials in environment variable. If the `ALIBABA_CLOUD_ACCESS_KEY_ID` and `ALIBABA_CLOUD_ACCESS_KEY_SECRET` environment variables are defined and are not empty, the program will use them to create default credentials. If the `ALIBABA_CLOUD_ACCESS_KEY_ID`, `ALIBABA_CLOUD_ACCESS_KEY_SECRET` and `ALIBABA_CLOUD_SECURITY_TOKEN` environment variables are defined and are not empty, the program will use them to create temporary security credentials(STS). Note: This token has an expiration time, it is recommended to use it in a temporary environment.

2. Credentials File

    If there is `~/.alibabacloud/credentials.ini default file (Windows shows C:\Users\USER_NAME\.alibabacloud\credentials.ini)`, the program automatically creates credentials with the specified type and name. The default file is not necessarily exist, but a parse error will throw an exception. The name of configuration item is lowercase.This configuration file can be shared between different projects and between different tools. Because it is outside of the project and will not be accidentally committed to the version control. The path to the default file can be modified by defining the `ALIBABA_CLOUD_CREDENTIALS_FILE` environment variable. If not configured, use the default configuration `default`. You can also set the environment variables `ALIBABA_CLOUD_PROFILE` to use the configuration.

    ```ini
    [default]                          # default setting
    enable = true                      # Enable，Enabled by default if this option is not present
    type = access_key                  # Certification type: access_key
    access_key_id = foo                # Key
    access_key_secret = bar            # Secret

    [client1]                          # configuration that is named as `client1`
    type = ecs_ram_role                # Certification type: ecs_ram_role
    role_name = EcsRamRoleTest         # Role Name

    [client2]                          # configuration that is named as `client2`
    enable = false                     # Disable
    type = ram_role_arn                # Certification type: ram_role_arn
    region_id = cn-test
    policy = test                      # optional Specify permissions
    access_key_id = foo
    access_key_secret = bar
    role_arn = role_arn
    role_session_name = session_name   # optional

    [client3]                          # configuration that is named as `client3`
    enable = false                     # Disable
    type = oidc_role_arn               # Certification type: oidc_role_arn
    region_id = cn-test
    policy = test                      # optional Specify permissions
    access_key_id = foo                # optional
    access_key_secret = bar            # optional
    role_arn = role_arn
    oidc_provider_arn = oidc_provider_arn
    oidc_token_file_path = /xxx/xxx    # can be replaced by setting environment variable: ALIBABA_CLOUD_OIDC_TOKEN_FILE
    role_session_name = session_name   # optional
    ```

3. Instance RAM Role

   If there is no credential information with a higher priority, the Credentials tool will obtain the value of ALIBABA_CLOUD_ECS_METADATA (ECS instance RAM role name) through the environment variable. If the value of this variable exists, the program will use the hardened mode (IMDSv2) to access the metadata service (Meta Data Server) of ECS to obtain the STS Token of the ECS instance RAM role as the default credential information. If an exception occurs when using the hardened mode, the normal mode will be used as a fallback to obtain access credentials. You can also set the environment variable ALIBABA_CLOUD_IMDSV1_DISABLED to perform different exception handling logic:

   - When the value is false, the normal mode will continue to obtain access credentials.

   - When the value is true, it means that only the hardened mode can be used to obtain access credentials, and an exception will be thrown.

   Whether the server supports IMDSv2 depends on your configuration on the server.

4. Credentials URI

    If the environment variable `ALIBABA_CLOUD_CREDENTIALS_URI` is defined and not empty, the program will take the value of the environment variable as credentials uri to get the temporary Security credentials.

## References

- [Credentials Python](https://github.com/aliyun/credentials-python)
