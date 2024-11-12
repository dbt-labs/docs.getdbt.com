---
title: Receiving a `Failed to connect to DB` error when connecting to Snowflake
description: "Edit your OAuth Security integration when you see error"
sidebar_label: 'Receiving `Failed to connect to database` error'
---

1. If you see this error: 

   ```shell
   
   Failed to connect to DB: xxxxxxx.snowflakecomputing.com:443. The role requested in the connection, or the default role if none was requested in the connection ('xxxxx'), is not listed in the Access Token or was filtered. 
   Please specify another role, or contact your OAuth Authorization server administrator.
   
   ```

2. Edit your OAuth Security integration and explicitly specify this scope mapping attribute:

 ```sql
ALTER INTEGRATION <my_int_name> SET EXTERNAL_OAUTH_SCOPE_MAPPING_ATTRIBUTE = 'scp';
```

You can read more about this error in [Snowflake's documentation](https://community.snowflake.com/s/article/external-custom-oauth-error-the-role-requested-in-the-connection-is-not-listed-in-the-access-token).
