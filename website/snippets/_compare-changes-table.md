| Aspect | In development <small>VS Code or Cursor</small> | In Advanced CI (deployment) |
|---|---|---|
| Trigger | On-demand in editor | PR open/update and CI job |
| Scope | Your working copy and local target | Branch head versus prod state in CI |
| Output location | Compare panel in VS Code/Cursor (no PR comment) | Deployment job cpmpare tab and PR comment |
| Data caching | Editor-side | dbt platform caches limited samples (see below) |
| Governance | Local development credentials | Podcution credentia
