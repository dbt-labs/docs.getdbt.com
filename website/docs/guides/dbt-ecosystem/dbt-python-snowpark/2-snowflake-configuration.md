---
title: "Configure Snowflake" 
id: "2-snowflake-configuration"
description: "Configure Snowflake"
---


1. Log in to your trial Snowflake account. You can [sign up for a Snowflake Trial Account using this form](https://signup.snowflake.com/) if you don’t have one.
2. Ensure that your account is set up using **AWS** in the **US East (N. Virginia)**. We will be copying the data from a public AWS S3 bucket hosted by dbt Labs in the us-east-1 region. By ensuring our Snowflake environment setup matches our bucket region, we avoid any multi-region data copy and retrieval latency issues.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/1-snowflake-trial-AWS-setup.png" title="Snowflake trial"/>

3. After creating your account and verifying it from your sign-up email, Snowflake will direct you back to the UI called Snowsight.

4. When Snowsight first opens, your window should look like the following, with you logged in as the ACCOUNTADMIN with demo worksheets open:

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/2-new-snowflake-account.png" title="Snowflake trial demo worksheets"/>


5. Navigate to **Admin > Billing & Terms**. Click **Enable > Acknowledge & Continue** to enable Anaconda Python Packages to run in Snowflake.
    
<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/3-accept-anaconda-terms.jpeg" title="Anaconda terms"/>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/4-enable-anaconda.jpeg" title="Enable Anaconda"/>

6. Finally, create a new Worksheet by selecting **+ Worksheet** in the upper right corner.

