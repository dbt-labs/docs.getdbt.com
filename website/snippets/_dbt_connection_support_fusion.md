
| Integration   | User credentials/token| Service account credentials | Warehouse OAuth for users | External OAuth for users | Service-to-service OAuth | Key/Pair | MFA | SSH | Private connectivity support** |
| ------------- |:---------------------:|:---------------------------:|:-------------------------:|:------------------------:|:------------------------:|:--------:|:---:|:---:|:------------------------------:|
| Snowflake     | ✅                    | ✅                          | ✅                         | ✅                       | ❌                        |    ✅    |  ✅ | ❌  | ✅              |
| BigQuery      | ✅                    | ✅                          | ✅                         | ✅                       | ❌                        |    ❌    |  ❌ | ❌  | ✅              |
| Databricks    | ✅                    | ✅                          | ✅                         | ❌                       | ❌                        |    ❌    |  ❌ | ❌  | ✅              |    
| Redshift      | ✅                    | ❌                          | ❌                         | ❌                       | ❌                        |    ❌    |  ❌ | ❌  | ✅              |

** Private connectivity is only supported for certain cloud providers and deployment types. See [Private connectivity documentation](/docs/cloud/secure/about-private-connectivity) for details.