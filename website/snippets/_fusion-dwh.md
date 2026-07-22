   <Expandable alt_header="BigQuery" lifecycle="preview" lifecycle_size="75">  
    - Service Account / User Token
    - Native OAuth
    - External OAuth 
      - [Workload Identity Federation](/docs/platform/manage-access/set-up-bigquery-oauth#set-up-bigquery-workload-identity-federation) (Microsoft Entra)
    - [Required permissions](/docs/local/connect-data-platform/bigquery-setup#required-permissions)
  </Expandable>

  <Expandable alt_header="Databricks" lifecycle="private_preview" lifecycle_size="75">
    - Service Account / User Token
    - Native OAuth
  </Expandable>

  <Expandable alt_header="Redshift" lifecycle="preview" lifecycle_size="75">
    - Username / Password
    - IAM profile
  </Expandable>
  
  <Expandable alt_header="Snowflake">
    - Username / Password
    - Native OAuth
    - External OAuth
    - Key pair using a modern PKCS#8 method
    - MFA
  </Expandable>

  <Expandable alt_header="Apache Spark (Fusion CLI only)" lifecycle="beta" lifecycle_size="75">
    - Thrift
      - Simple Authentication and Security Layer (SASL) PLAIN
      - No SASL (NOSASL) 
    - Livy
      - Basic authentication (username and password)
      - When deployed on Amazon Web Services (AWS): AWS Signature Version 4
        - Supports authentication using single sign-on, service accounts, or user tokens
    - Spark Connect 
      - Basic authentication (username and password)
  </Expandable>

  <Expandable alt_header="DuckDB (Fusion CLI only)" lifecycle="beta" lifecycle_size="75">
    DuckDB does not require authentication &mdash; it runs locally on your machine.
  </Expandable>

<!-- <Expandable alt_header="Supported data platforms"> -->
