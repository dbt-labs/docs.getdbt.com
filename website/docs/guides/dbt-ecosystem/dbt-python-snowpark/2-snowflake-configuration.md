1. Log into the Trial Snowflake account. You can [sign up for a Snowflake Trial Account using this form](https://signup.snowflake.com/) if you don’t have one.
2. Ensure that your account is set up using **AWS** in the **US East (N. Virginia) us-east-1** because we will be copying from a public AWS s3 bucket in us-east-1. By ensuring our Snowflake environment setup matches will help avoid multi-region data copy and retrieval latency issues.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/1-snowflake-trial-AWS-setup.png" title="snowflake trial"/>

3. After creating your account and verifying via your sign up email, Snowflake will direct you back to the UI, which is called Snowsight.
4. When Snowsight first opens, your window should look like the following: you are logged in as the ACCOUNTADMIN with demo worksheets.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/2-new-snowflake-account.png" title="snowflake trial demo worksheets"/>


5. Navigate to **Admin** **> Billing & Terms**. Select **Enable** to allow Anaconda Python Packages to run.
    
<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/3-accept-anaconda-terms.jpeg" title="anaconda terms"/>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/4-enable-anaconda.jpeg" title="enable anaconda"/>

6. Open a new Worksheet using the blue button in the upper right corner.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/5-initial-worksheet.png" title="initial worksheet"/>
