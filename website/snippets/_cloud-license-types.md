There are four license types in <Constant name="cloud" />:

- **Analyst** &mdash;  Available on [Enterprise and Enterprise+ plans only](https://www.getdbt.com/pricing). Requires developer seat license purchase.
  - User can be granted _any_ permission sets.
- **Developer** &mdash; User can be granted _any_ permission sets.
- **IT** &mdash; Available on [Starter, Enterprise, and Enterprise+ plans only](https://www.getdbt.com/pricing). User has Security Admin and Billing Admin [permissions](/docs/cloud/manage-access/enterprise-permissions#permission-sets) applied. 
  - Can manage users, groups, and licenses, among other permissions. 
  - _IT licensed users do not inherit rights from any permission sets_. 
  - Every IT licensed user has the same access across the account, regardless of the group permissions assigned.
- **Read-Only** &mdash; Available on [Starter, Enterprise, and Enterprise+ plans only](https://www.getdbt.com/pricing).
  - User has read-only permissions applied to all <Constant name="cloud" /> resources. 
  - Intended to view the [artifacts](/docs/deploy/artifacts) and the [deploy](/docs/deploy/deployments) section (jobs, runs, schedules) in a <Constant name="cloud" /> account, but can’t make changes. 
  - _Read-only licensed users do not inherit rights from any permission sets_. 
  - Every read-only licensed user has the same access across the account, regardless of the group permissions assigned.
