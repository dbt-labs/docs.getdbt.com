The following table outlines which <Constant name="dbt" /> features are supported on the different SaaS options available today. For more information about feature availability, please [contact us](https://www.getdbt.com/contact/).

Cell-based (multi-cell) accounts are still multi-tenant SaaS: they use the same multi-tenant column for their cloud (for example, the AWS Multi-tenant column). Feature availability is not split out by cell in this table—see [Multi-cell hosting](/docs/platform/about-platform/tenancy#multi-cell-hosting) for how hosting and access URLs differ from single tenant.

| Feature                       | AWS Multi-tenant | AWS single tenant     |Azure multi-tenant   | Azure single tenant | GCP multi-tenant |
|-------------------------------|------------------|-----------------------|---------------------|---------------------|------------------|
| Audit logs                    | ✅               | ✅                    | ✅                  | ✅                  | ✅               | 
| Continuous integration jobs   | ✅               | ✅                    | ✅                  | ✅                  | ✅               | 
| <Constant name="platform_cli" /> | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="studio_ide" /> | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="wizard" />   | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="catalog" />  | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="mesh" />      | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="semantic_layer" />| ✅           | ✅                    | ✅                  | ✅                  | ✅               |
| Discovery API                 | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| IP restrictions               | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| <Constant name="orchestrator" />  | ✅           | ✅                    | ✅                  | ✅                  | ✅               |
| PrivateLink egress            | ✅               | ✅                    | ✅                  | ✅                  | ✅               |
| PrivateLink ingress           | ❌               | ✅                    | ❌                  | ✅                  | ❌               |
| Webhooks (Outbound)           | ✅               | ✅                    | ✅                  | ❌                  | ❌               |
