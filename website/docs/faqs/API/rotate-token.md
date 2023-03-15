---
title: How can I rotate my user API token?
description: "Instructions on how to rotate API token"
sidebar_label: 'Rotate your user API token'
id: rotate-token
---

For security reasons and best practices, you should aim to rotate API keys every so often.

1. Rotate your [User API token](/docs/dbt-cloud-apis/user-tokens) by replacing `YOUR_USER_ID`, `YOUR_CURRENT_TOKEN`, and `YOUR_ACCESS_URL `with your information in the following request.

```
curl --location --request POST 'https://YOUR_ACCESS_URL/api/v2/users/YOUR_USER_ID/apikey/' \
--header 'Authorization: Token YOUR_CURRENT_TOKEN'
```

* Find your `YOUR_USER_ID` by reading [How to find your user ID](/faqs/Accounts/find-user-id).
* Find your `YOUR_CURRENT_TOKEN` by going to **Profile Settings** -> **API Access** and copying the API key.
* Find [`YOUR_ACCESS_URL`](/docs/deploy/regions-ip-addresses) for your region and plan.

:::info Example

If `YOUR_USER_ID` = `123`, `YOUR_CURRENT_TOKEN` = `abcf9g`, and your `ACCESS_URL` = `cloud.getdbt.com`, then your curl request will be:

```
curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/123/apikey/' \
--header 'Authorization: Token abcf9g'
```
:::

2. Find the new key in the API response or in dbt Cloud. 

3. To find the new key in dbt Cloud, go to **Profile Settings** -> **API Access**.


### dbt Cloud deployments

If your [dbt Cloud deployment](/docs/deploy/regions-ip-addresses) uses a different access URL, replace `cloud.getdbt.com` with the URL of your instance.

For example, if your deployment is Virtual Private dbt: 

✅ `http://cloud.customizedurl.getdbt.com/` <br />
❌ `http://cloud.getdbt.com/`<br />
