| Aspect | In development | In deployment (Advanced CI) |
|---|---|---|
| Affects | Development for one modified model at a time | Deployment for all modified models in a project |
| Trigger | On-demand in editor | PR open/update and CI job |
| Scope | Your working copy and local target | Branch head versus prod state in CI |
| Output location | Compare panel in VS Code/Cursor. Does not create a PR comment in Git provider | Deployment job compare tab and PR summary comment in Git provider |
| Data caching | Editor-side | dbt platform [caches](/docs/deploy/advanced-ci#about-the-cached-data) limited samples |
| Governance | Local development credentials | Production credentials |
