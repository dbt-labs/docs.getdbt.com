---
title: "Connect Snowflake"
id: connect-snowflake
description: "Configure Snowflake connection."
sidebar_label: "Connect Snowflake"
---

:::note

<Constant name="cloud" /> connections and credentials inherit the permissions of the accounts configured. You can customize roles and associated permissions in Snowflake to fit your company's requirements and fine-tune access to database objects in your account.

Refer to [Snowflake permissions](/reference/database-permissions/snowflake-permissions) for more information about customizing roles in Snowflake.

:::

The following fields are required when creating a Snowflake connection

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Account | The Snowflake account to connect to. Take a look [here](/docs/core/connect-data-platform/snowflake-setup#account) to determine what the account field should look like based on your region.| <Snippet path="snowflake-acct-name" /> |
| Role | A mandatory field indicating what role should be assumed after connecting to Snowflake | `transformer` |
| Database | The logical database to connect to and run queries against. | `analytics` |
| Warehouse | The virtual warehouse to use for running queries. | `transforming` |

## Authentication methods

This section describes the different authentication methods for connecting <Constant name="cloud" /> to Snowflake. Configure Deployment environment (Production, Staging, General) credentials globally in the [**Connections**](/docs/deploy/deploy-environments#deployment-connection) area of **Account settings**. Individual users configure their development credentials in the [**Credentials**](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide) area of their user profile. 

### Username and password with MFA

:::info Snowflake authentication

Starting November 2025, Snowflake will phase out single-factor password authentication, and multi-factor authentication (MFA) will be enforced.

MFA will be required for all `Username / Password` authentication.

To continue using key pair authentication, users should update any deployment environments currently using `Username / Password` by November 2025.

Refer to [Snowflake's blog post](https://www.snowflake.com/en/blog/blocking-single-factor-password-authentification/) for more information.

:::

:::info Snowflake MFA plan availability

Snowflake's MFA is available on all [plan types](https://www.getdbt.com/pricing).

:::

**Available in:** Development environments

The `Username / Password` auth method is the simplest way to authenticate
Development credentials in a dbt project. Simply enter your Snowflake
username (specifically, the `login_name`) and the corresponding user's Snowflake `password`
to authenticate <Constant name="cloud" /> to run queries against Snowflake on behalf of a Snowflake user.

`Username / Password` authentication is not supported for deployment credentials because MFA is required. In deployment environments, use [keypair](/docs/cloud/connect-data-platform/connect-snowflake#key-pair) authentication instead.

**Note**: The *Schema** field in the **Developer Credentials** section is required.
<Lightbox src="/img/docs/dbt-cloud/snowflake-userpass-auth.png" width="70%" title="Snowflake username/password authentication"/>

**Prerequisites:**
- A development environment in a <Constant name="cloud" /> project
- The Duo authentication app
- Admin access to Snowflake (if MFA settings haven't already been applied to the account)
- [Admin (write) access](/docs/cloud/manage-access/seats-and-users) to <Constant name="cloud" /> environments

[MFA](https://docs.snowflake.com/en/user-guide/security-mfa) is required by Snowflake for all `Username / Password` logins. Snowflake's MFA support is powered by the Duo Security service.

- In <Constant name="cloud" />, set the following [extended attribute](/docs/dbt-cloud-environments#extended-attributes) in the development environment **General settings** page, under the **Extended attributes** section:

   ```yaml
  authenticator: username_password_mfa
   ```

- To reduce the number of user prompts when connecting to Snowflake with MFA, [enable token caching](https://docs.snowflake.com/en/user-guide/security-mfa#using-mfa-token-caching-to-minimize-the-number-of-prompts-during-authentication-optional) in Snowflake.
- Optionally, if users miss prompts and their Snowflake accounts get locked, you can prevent automatic retries by adding the following in the same **Extended attributes** section:

  ```yaml
  connect_retries: 0
  ```

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/extended-attributes-mfa.png" width="70%" title="Configure the MFA username and password, and connect_retries in the development environment settings." />

### Key pair





**Available in:** Development environments,  Deployment environments

The `Keypair` auth method uses Snowflake's [Key Pair Authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth) to authenticate Development or Deployment credentials for a <Constant name="cloud" /> project.

1. After [generating an encrypted key pair](https://docs.snowflake.com/en/user-guide/key-pair-auth.html#configuring-key-pair-authentication), be sure to set the `rsa_public_key` for the Snowflake user to authenticate in <Constant name="cloud" />:

   ```sql
   alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';   
   ```

2. Finally, set the **Private Key** and **Private Key Passphrase** fields in the **Credentials** page to finish configuring <Constant name="cloud" /> to authenticate with Snowflake using a key pair.
   - **Note:** Unencrypted private keys are permitted. Use a passphrase only if needed. dbt can specify a `private_key` directly as a string instead of a `private_key_path`. This `private_key` string can be in either Base64-encoded DER format, representing the key bytes, or in plain-text PEM format. Refer to [Snowflake documentation](https://docs.snowflake.com/en/user-guide/key-pair-auth) for more info on how they generate the key.
   - Specifying a private key using an [environment variable](/docs/build/environment-variables) (for example, `{{ env_var('DBT_PRIVATE_KEY') }}`) is not supported. 

3. To successfully fill in the Private Key field, you _must_ include commented lines. If you receive a `Could not deserialize key data` or `JWT token` error, refer to [Troubleshooting](#troubleshooting) for more info. 

**Example:**

```sql
-----BEGIN ENCRYPTED PRIVATE KEY-----
< encrypted private key contents here - line 1 >
< encrypted private key contents here - line 2 >
< ... >
-----END ENCRYPTED PRIVATE KEY-----
```

   <Lightbox src="/img/docs/dbt-cloud/snowflake-keypair-auth.png" width="60%" title="Snowflake keypair authentication"/>

### Snowflake OAuth

**Available in:** Development environments, Enterprise-tier plans only

The OAuth auth method permits <Constant name="cloud" /> to run development queries on behalf of
a Snowflake user without the configuration of Snowflake password in <Constant name="cloud" />. 

For more information on configuring a Snowflake OAuth connection in <Constant name="cloud" />, please see [the docs on setting up Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" width="55%" title="Configuring Snowflake OAuth connection"/>

## Configuration

To learn how to optimize performance with data platform-specific configurations in <Constant name="cloud" />, refer to [Snowflake-specific configuration](/reference/resource-configs/snowflake-configs).

### Custom domain URL

To connect to Snowflake through a custom domain (vanity URL) instead of the account locator, use [extended attributes](/docs/dbt-cloud-environments#extended-attributes) to configure the `host` parameter with the custom domain:

```yaml
host: https://custom_domain_to_snowflake.com
```

This configuration may conflict with Snowflake OAuth when used with PrivateLink. IF users can't reach Snowflake authentication servers from a networking standpoint, please [contact dbt Support](mailto:support@getdbt.com) to find a workaround with this architecture.

## Troubleshooting
<!--might need to turn this into details toggle if more troubleshooting items arise -->

If you're receiving a `Could not deserialize key data` or `JWT token` error, refer to the following causes and solutions:

<DetailsToggle alt_header="Error: `Could not deserialize key data`">

Possible cause and solution for the error "Could not deserialize key data" in <Constant name="cloud" />.
- This could be because of mistakes like not copying correctly, missing dashes, or leaving out commented lines.

**Solution**:
- You can copy the key from its source and paste it into a text editor to verify it before using it in <Constant name="cloud" />.

</DetailsToggle>

<DetailsToggle alt_header="Error: `JWT token`">

Possible cause and solution for the error "JWT token" in <Constant name="cloud" />.
- This could be a transient issue between Snowflake and <Constant name="cloud" />. When connecting to Snowflake, dbt gets a JWT token valid for only 60 seconds. If there's no response from Snowflake within this time, you might see a `JWT token is invalid` error in <Constant name="cloud" />.
- The public key was not entered correctly in Snowflake.

**Solutions**
- dbt needs to retry connections to Snowflake.
- Confirm and enter Snowflake's public key correctly. Additionally, you can reach out to Snowflake for help or refer to this Snowflake doc for more info: [Key-Based Authentication Failed with JWT token is invalid Error](https://community.snowflake.com/s/article/Key-Based-Authentication-Failed-with-JWT-token-is-invalid-Error).

</DetailsToggle>
