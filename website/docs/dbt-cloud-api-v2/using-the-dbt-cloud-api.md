---
title: "Using the dbt Cloud API"
id: "using-the-dbt-cloud-api"
---

# The dbt Cloud API

The dbt Cloud API makes it possible to fetch data from your dbt Cloud account as well as programmatically queue and monitor running jobs.

# Authentication

To authenticate an application with the dbt Cloud API, navigate to the [API Settings page](https://cloud.getdbt.com/#/profile/api/) in your dbt Cloud profile. If you cannot access this page, confirm that your dbt Cloud account has access to the API.

Once you've received a token, use it in the Authorization header of your request. The following example will list the Accounts that your token is authorized to access. Be sure to replace the `abc123` token shown here with your actual API token.

<File name='list_accounts.sh'>

```shell
curl --request GET \
  --url https://cloud.getdbt.com/api/v2/accounts/ \
  --header 'accept: application/json' \
  --header 'authorization: Token abc123'
```

</File>
