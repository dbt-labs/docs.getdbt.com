The following table outlines which <Constant name="dbt" /> features are supported on the different SaaS options available today. For more information about feature availability, please [contact us](https://www.getdbt.com/contact/).

Cell-based (multi-cell) accounts are still multi-tenant SaaS. Use the multi-tenant column for your cloud provider (for example, the AWS Multi-tenant column). This table does not list features by cell. For differences in hosting and access URLs compared with single tenant, refer to [Multi-cell hosting](/docs/platform/about-platform/tenancy#multi-cell-hosting).

| Feature                       | AWS Multi-tenant | AWS single tenant     |Azure multi-tenant   | Azure single tenant | GCP multi-tenant | GCP single tenant |
|-------------------------------|------------------|-----------------------|---------------------|---------------------|------------------|-------------------|
| Audit logs                    | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| Continuous integration jobs   | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="platform_cli" /> | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="studio_ide" /> | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="wizard" />   | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="catalog" />  | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="mesh" />      | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="semantic_layer" />| ✅           | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| Discovery API                 | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| IP restrictions               | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| <Constant name="orchestrator" />  | ✅           | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| PrivateLink egress            | ✅               | ✅                    | ✅                  | ✅                  | ✅               | ✅                |
| PrivateLink ingress           | ❌               | ✅                    | ❌                  | ✅                  | ❌               | ❌                |
| Webhooks (Outbound)           | ✅               | ✅                    | ✅                  | ❌                  | ❌               | ❌                |
