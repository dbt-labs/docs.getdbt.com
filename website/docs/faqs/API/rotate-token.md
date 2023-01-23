---
title: How can I rotate my user API token?
description: "Instructions on how to rotate API token"
sidebar_label: 'Rotate your user API token'
id: rotate-token
---

For security reasons and best practices, you should aim to rotate API keys every so often.

### Steps to rotate API keys

1. To rotate your [User API token](/docs/dbt-cloud-apis/user-tokens), send the following request: 

```
curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/your_user_id/apikey/' \
--header 'Authorization: Token your_current_token'
```

2. Replace the fields `your_user_id` and `your_current_token` with your information.  

    - Learn [how to find your](/faqs/Accounts/find-user-id) `your_user_id`. 
    - To find your `your_current_token`, go to **Account Settings** -> **API Access** and copy the API key.

:::infoExample
If your_user_id is `123` and your_current_token is `abcf9g`, your curl request will be:
    
```
curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/123/apikey/' \
--header 'Authorization: Token abcf9g'
```
:::


3. You can find the new key in the API response or in dbt Cloud. To find the new key in dbt Cloud, go to **Account Settings** -> **API Access**.



### dbt Cloud deployments

If your [dbt Cloud deployment](/docs/deploy/regions-ip-addresses) uses a different access URL, replace `cloud.getdbt.com` with the URL of your instance. 

For example, if your deployment is Virtual Private dbt: 

✅ `http://cloud.customizedurl.getdbt.com/` <br />
❌ `http://cloud.getdbt.com/`<br />
