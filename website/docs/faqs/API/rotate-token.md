---
title: How can I rotate my user API token?
description: "Instructions on how to rotate API token"
sidebar_label: 'Rotate your user API token'
id: rotate-token
---

For security reasons and best practices, you should aim to rotate API keys every so often.

### Steps to rotate API keys

1. To rotate your [User API token](/docs/dbt-cloud-apis/user-tokens), send the following request, replacing `YOUR_USER_ID`, `YOUR_CURRENT_TOKEN`, and `YOUR_ACCESS_URL` with your information:

* Find your `YOUR_USER_ID` by referring to [How to find your user ID](/faqs/Accounts/find-user-id).
* Find your `YOUR_CURRENT_TOKEN`, go to **Account Settings** -> **API Access** and copy the API key.
* Find [`YOUR_ACCESS_URL`](/docs/deploy/regions-ip-addresses) for your region and plan.

```
curl --location --request POST 'https://YOUR_ACCESS_URL/api/v2/users/your_user_id/apikey/' \
--header 'Authorization: Token YOUR_CURRENT_TOKEN'
```

> 📌 **Example**: If YOUR_USER_ID is `123`, YOUR_CURRENT_TOKEN is `abcf9g`, and your ACCESS_URL is `cloud.getdbt.com`, your curl request will be:

>```
>curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/123/apikey/' \
>--header 'Authorization: Token abcf9g'
>```


3. You can find the new key in the API response or in dbt Cloud. To find the new key in dbt Cloud, go to **Account Settings** -> **API Access**.


### dbt Cloud deployments

If your [dbt Cloud deployment](/docs/deploy/regions-ip-addresses) uses a different access URL, replace `cloud.getdbt.com` with the URL of your instance.

For example, if your deployment is Virtual Private dbt: 

✅ `http://cloud.customizedurl.getdbt.com/` <br />
❌ `http://cloud.getdbt.com/`<br />
