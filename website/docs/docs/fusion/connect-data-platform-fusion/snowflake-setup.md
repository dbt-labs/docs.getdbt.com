---
title: "Snowflake setup"
description: "Read this guide to learn about the Snowflake warehouse setup in dbt Fusion."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-snowflake'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-snowflake'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Snowflake'
  config_page: '/reference/resource-configs/snowflake-configs'
---

# Snowflake setup <Lifecycle status='preview' />

You can configure the Snowflake adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The Snowflake adapter for Fusion supports the following [authentication methods](#supported-authentication-types):
- Password 
- Key pair
- Single sign-on (SSO)
- Password with MFA

:::note
[Snowflake is deprecating single-access password login](https://docs.snowflake.com/en/user-guide/security-mfa-rollout). Individual developers should use MFA or SSO instead of password authentication. Password-based login remains supported for service users (Snowflake user type: `LEGACY_SERVICE`).
:::

## Snowflake configuration details

The information required for configuring the Snowflake adapter can be found conveniently in your Snowflake account menu:
1. Click on your name from the Snowflake sidebar. 
2. Hover over the **Account** field.
3. In the field with your account name, click **View account details**.
4. Click **Config file** and select the appropriate **Warehouse** and **Database**. 

<Lightbox src="/img/fusion/connect-adapters/snowflake-account-details.png" width="60%" title="Sample config file in Snowflake." />

## Configure Fusion

Executing `dbt init` in your CLI will prompt for the following fields:

- **Account:** Snowflake account number
- **User:** Your Snowflake username
- **Database:** The database within your Snowflake account to connect to your project
- **Warehouse:** The compute warehouse that will handle the tasks for your project
- **Schema:** The development/staging/deployment schema for the project
- **Role (Optional):** The role dbt should assume when connnecting to the warehouse


Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you are given the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>

<TabItem value="Password">

Password authentication prompts for your Snowflake account password. This is becoming an increasingly less common option as organizations opt for more secure authentication.

Selecting **Password with MFA** redirects you to the Snowflake account login to provide your passkey or authenticator password.

#### Example password configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
      password: THISISMYPASSWORD
```

</File>

#### Example password with MFA configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      authenticator: username_password_mfa
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANFORM
      schema: JANE_SMITH
```

</File>

</TabItem>

<TabItem value="Key pair">

Key pair authentication gives you the option to:
- Define the path to the key. 
- Provide the plain-text PEM format key inline.

In either case, we recommend using PKCS#8 format with AES-256 encryption for key pair authentication with Fusion. Fusion doesn't support legacy 3DES encryption or headerless key formats. Using older key formats may cause authentication failures.

If you encounter the `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8` error, then your private key is in the wrong format. You have two options:

- (Recommended fix) Re-export your key with modern encryption:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8
  ```

- (Temporary workaround) Add the `BEGIN` header and `END` footer to your PEM body:

  ```
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < Your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```

  Once the key is configuted, you will be given the option to provide a passphrase, if required. 

#### Example key pair configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
      private_key: '<Your existing encrypted private key contents>'
      private_key_passphrase: YOURPASSPHRASEHERE
```

</File>

</TabItem>

<TabItem value="Single sign-on">

Single sign-on will leverage your browser to authenticate the Snowflake session.

By default, every connection that dbt opens will require you to re-authenticate in a browser. The Snowflake connector package supports caching your session token, but it [currently only supports Windows and Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Refer to the [Snowflake docs](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) for information on enabling this feature in your account.

#### Example SSO configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      authenticator: externalbrowser
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
```
</File>

</TabItem>

</Tabs>

## More information

Find Snowflake-specific configuration information in the [Snowflake adapter reference guide](/reference/resource-configs/snowflake-configs).
