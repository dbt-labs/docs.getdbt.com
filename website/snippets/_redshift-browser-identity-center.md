Sign in through [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) and set `method` to `browser_identity_center`. dbt opens a browser window for you to authenticate without needing a password or IAM profile in your `profiles.yml`.

:::note Local only
This method works when you run dbt locally from the command line. It isn't supported in the <Constant name="dbt_platform" /> yet.
:::

Before you start, make sure your Redshift cluster or workgroup is set up for [IAM Identity Center integration](https://docs.aws.amazon.com/redshift/latest/mgmt/redshift-iam-access-control-idp-connect.html). You need the following fields:

<SimpleTable>

| Profile field | Required | Default | Description |
| ------------- | -------- | ------- | ----------- |
| `method` | Yes | &mdash; | Set to `browser_identity_center`. |
| `idc_region` | Yes | &mdash; | AWS region where your IAM Identity Center instance lives (for example, `us-east-1`). |
| `issuer_url` | Yes | &mdash; | Issuer URL of your IAM Identity Center instance (for example, `https://identitycenter.amazonaws.com/ssoins-1234567890abcdef`). |
| `idp_listen_port` | No | `7890` | Local port dbt listens on for the browser redirect after you sign in. |
| `idc_client_display_name` | No | `Amazon Redshift driver` | App name shown in the browser consent prompt. |
| `idp_response_timeout` | No | `60` | Seconds dbt waits for you to finish signing in before timing out. |

</SimpleTable>
#### Example IAM Identity Center configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      method: browser_identity_center
      host: hostname.region.redshift.amazonaws.com
      port: 5439
      dbname: analytics
      schema: analytics
      idc_region: us-east-1
      issuer_url: https://identitycenter.amazonaws.com/ssoins-1234567890abcdef

      # Optional
      idp_listen_port: 7890
      idc_client_display_name: Amazon Redshift driver
      idp_response_timeout: 60
      threads: 4
```

</File>
