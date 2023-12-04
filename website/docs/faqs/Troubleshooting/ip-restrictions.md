---
title: "I'm receiving a 403 error 'Forbidden: Access denied' when using service tokens"
description: "All service token traffic is now subject to IP restrictions. To resolve 403 errors, add your third-party integration CIDRs (network addresses) to the allowlist."
sidebar_label: 'Service token 403 error: Forbidden: Access denied'
---


All [service token](/docs/dbt-cloud-apis/service-tokens) traffic is subject to IP restrictions.

When using a service token, the following 403 response error indicates the IP is not on the allowlist. To resolve this, you should add your third-party integration CIDRs (network addresses) to your allowlist.

The following is an example of the 403 response error:

```json
        {
            "status": {
                "code": 403,
                "is_success": False,
                "user_message": ("Forbidden: Access denied"),
                "developer_message": None,
            },
            "data": {
                "account_id": <account_id>,
                "user_id": <user_id>,
                "is_service_token": <boolean describing if it's a service token request>,
                "account_access_denied": True,
            },
        }
```
