---
title: How can I rotate my user API token?
description: "Instructions on how to swap API token"
sidebar_label: 'How to rotate your user API token'
id: rotate-token
---


If you want to change your account's credit card details, select the gear menu in the upper right corner of dbt Cloud. Go to Account Settings  &#8594; Billing  &#8594; Payment Information. In the upper right corner of Payment Information, click **Edit** to enter the new credit card details. Only the _account owner_ can make this change. 

To change your billing name or location address, send our Support team a message at support@getdbt.com with the newly updated information, and we can make that change for you! 

```
curl --location --request POST 'https://cloud.getdbt.com/api/v2/users/<your-user-id>/apikey/' \
--header 'Authorization: Token <your-current-token>'
```

They will need to swap in their **user_id** and **existing token** for authentication, and they can then grab the new key from the response or the cloud UI.

Note, for single tenant users they will also need to modify the URL to point to their specific instance (ex: `http://cloud.mycompany.getdbt.com/...` rather than `http://cloud.getdbt.com/...`)