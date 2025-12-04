The following packages are verified and supported on the <Constant name="fusion_engine" />:

| Package | Repository | Notes |
|---------|------------|-------|
| AxelThevenot/dbt_assertions | [GitHub](https://github.com/AxelThevenot/dbt-assertions) | |
| Datavault-UK/automate_dv | [GitHub](https://github.com/Datavault-UK/dbtvault.git) | |
| dbt-labs/audit_helper | [GitHub](https://github.com/dbt-labs/dbt-audit-helper.git) | |
| dbt-labs/codegen | [GitHub](https://github.com/dbt-labs/dbt-codegen.git) | |
| dbt-labs/dbt_project_evaluator | [GitHub](https://github.com/dbt-labs/dbt-project-evaluator.git) | Versions 1.1.1 and above |
| dbt-labs/dbt_utils | [GitHub](https://github.com/dbt-labs/dbt-utils.git) | |
| elementary-data/elementary | [GitHub](https://github.com/elementary-data/dbt-data-reliability.git) | |
| entechlog/dbt_snow_mask | [GitHub](https://github.com/entechlog/dbt-snow-mask.git) | |
| fivetran/ad_reporting | [GitHub](https://github.com/fivetran/dbt_ad_reporting.git) | |
| fivetran/facebook_ads | [GitHub](https://github.com/fivetran/dbt_facebook_ads.git) | |
| fivetran/fivetran_log | [GitHub](https://github.com/fivetran/dbt_fivetran_log.git) | |
| fivetran/fivetran_utils | [GitHub](https://github.com/fivetran/dbt_fivetran_utils.git) | |
| fivetran/google_ads | [GitHub](https://github.com/fivetran/dbt_google_ads.git) | |
| fivetran/hubspot | [GitHub](https://github.com/fivetran/dbt_hubspot.git) | |
| fivetran/jira | [GitHub](https://github.com/fivetran/dbt_jira.git) | |
| fivetran/linkedin | [GitHub](https://github.com/dbt-labs/dbt-project-evaluator.git) | |
| fivetran/microsoft_ads | [GitHub](https://github.com/fivetran/dbt_microsoft_ads.git) | |
| fivetran/pendo | [GitHub](https://github.com/fivetran/dbt_pendo.git) | |
| fivetran/qualtrics | [GitHub](https://github.com/fivetran/dbt_qualtrics.git) | |
| fivetran/salesforce | [GitHub](https://github.com/fivetran/dbt_salesforce.git) | |
| fivetran/salesforce_formula_utils | [GitHub](https://github.com/fivetran/dbt_salesforce_formula_utils.git) | |
| fivetran/social_media_reporting | [GitHub](https://github.com/fivetran/dbt_social_media_reporting.git) | |
| fivetran/zendesk | [GitHub](https://github.com/fivetran/dbt_zendesk.git) | |
| GJMcClintock/dbt_tld | [GitHub](https://github.com/GJMcClintock/dbt_tld.git) | |
| godatadriven/dbt_date | [GitHub](https://github.com/godatadriven/dbt-date.git) | |
| kristeligt-dagblad/dbt_ml | [GitHub](https://github.com/kristeligt-dagblad/dbt_ml.git) | |
| LewisDavies/upstream_prod | [GitHub](https://github.com/LewisDavies/upstream-prod.git) | Versions 0.9.6 and above |
| metaplane/dbt_expectations | [GitHub](https://github.com/metaplane/dbt-expectations.git) | |
| Montreal-Analytics/snowflake_utils | [GitHub](https://github.com/Montreal-Analytics/dbt-snowflake-utils.git) | |
| Snowflake-Labs/dbt_semantic_view | [GitHub](https://github.com/Snowflake-Labs/dbt_semantic_view) | |

Additionally, the Fivetran `source` and `transformation` packages have been combined into a single package. If you manually installed source packages like `fivetran/github_source`, you need to ensure `fivetran/github` is installed and deactivate the transformation models.

Package maintainers that would like make their package compatible with <Constant name="fusion"/> can refer to the [Fusion package upgrade guide](/guides/fusion-package-compat) for instructions.
