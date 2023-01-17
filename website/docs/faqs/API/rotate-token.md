---
title: How can I rotate my user API token?
description: "Instructions on how to rotate API token"
sidebar_label: 'How to rotate your user API token'
id: rotate-token
---


To rotate your [User API token](/docs/dbt-cloud-apis/user-tokens):

1. Send the following request: 

```
curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/<your-user-id>/apikey/' \
--header 'Authorization: Token <your-current-token>'
```

2. You will need to replace your **user_id** and **existing token** for authentication. 

    - To find your `user_id`, refer to [Where can I find my user id](/faqs/Accounts/find-user-id) for more info. 
    - To find your `existing token`:
        * Go to **Account Settings** and then **API Access** and copy the API key.


3. Find the new key in the API response or in dbt Cloud by going to **Account Settings** and then **API Access**.


**dbt Cloud deployment**

If your [dbt Cloud deployment](/docs/deploy/regions-ip-addresses) uses a different access URL, replace `cloud.getdbt.com` with the URL of your instance. For example:

- For Virtual Private dbt &mdash; Use `http://cloud.customizedurl.getdbt.com/`, not `http://cloud.getdbt.com/`<br />
- For EMEA region &mdash; Use `https://emea.dbt.com/`, not `http://cloud.getdbt.com/`, and so on. 

