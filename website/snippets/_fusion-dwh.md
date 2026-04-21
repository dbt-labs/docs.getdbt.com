   <Expandable alt_header="BigQuery" lifecycle="preview" size="80%">  
    - Service Account / User Token
    - Native OAuth
    - External OAuth
    - [Required permissions](/docs/local/connect-data-platform/bigquery-setup#required-permissions)
  </Expandable>

  <Expandable alt_header="Databricks" lifecycle="private_preview" size="80%">
    - Service Account / User Token
    - Native OAuth
  </Expandable>

  <Expandable alt_header="Redshift" lifecycle="preview" size="80%">
    - Username / Password
    - IAM profile
  </Expandable>
  
  <Expandable alt_header="Snowflake" lifecycle="preview" size="80%">
    - Username / Password
    - Native OAuth
    - External OAuth
    - Key pair using a modern PKCS#8 method
    - MFA
  </Expandable>

  <Expandable alt_header="Apache Spark (Fusion CLI only)" lifecycle="preview" size="80%">
    - Thrift
      - Simple Authentication and Security Layer (SASL) PLAIN
      - No SASL (NOSASL) 
    - Livy
      - Basic authentication (username and password)
      - When deployed on Amazon Web Services (AWS): AWS Signature Version 4
        - Supports authentication using single sign-on, service accounts, or user tokens
  </Expandable>

  <Expandable alt_header="DuckDB (Fusion CLI only)">
    DuckDB does not require authentication &mdash; it runs locally on your machine.
  </Expandable>

<!-- <Expandable alt_header="Supported data platforms"> -->
