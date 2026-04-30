There are four license types in <Constant name="dbt" />:

- **Analyst**\* &mdash;  Available on [Enterprise and Enterprise+ plans only](https://www.getdbt.com/pricing).
  - User can be granted _any_ permission sets.
  - \* The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.
- **Developer** &mdash; User can be granted _any_ permission sets.
- **IT** &mdash; Available on [Starter, Enterprise, and Enterprise+ plans only](https://www.getdbt.com/pricing). User has Security Admin and Billing Admin [permissions](/docs/platform/manage-access/enterprise-permissions#permission-sets) applied, as well as permissions to edit **Connections** in the **Account settings** page.
  - Can manage users, groups, connections, and licenses, among other permissions. 
  - _IT licensed users do not inherit rights from any permission sets_. 
  - Every IT licensed user has the same access across the account, regardless of the group permissions assigned.
- **Read-Only** &mdash; Available on [Starter, Enterprise, and Enterprise+ plans only](https://www.getdbt.com/pricing).
  - User has read-only permissions applied to all <Constant name="dbt" /> platform features (Catalog, docs, job run history, source freshness, and more), but can’t make changes.
  - _Read-only licensed users do not inherit rights from any permission sets_.
  - Every read-only licensed user has the same <Constant name="dbt_platform" /> access across the account, regardless of the group permissions assigned.
  - Can generate a [personal access token (PAT)](/docs/dbt-apis/user-tokens) to authenticate with the <Constant name="dbt" /> API and <Constant name="semantic_layer" />. When querying the <Constant name="semantic_layer" />, data warehouse-level access is controlled by the user’s own warehouse credentials and not by the <Constant name="dbt" /> license.

\* The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.
