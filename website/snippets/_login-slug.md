To complete this section, you will need your login URL slug. This slug controls the URL where users on your account can log into your application. dbt automatically generates login URL slugs, which can't be altered. It will contain only letters, numbers, and dashes.
For example, the login URL slug for dbt Labs would look something like `dbt-labs-afk123`.
Login URL slugs are unique across all <Constant name="dbt" /> accounts.

Users can also sign in at [https://login.dbt.com](https://login.dbt.com) to see accounts they have access to across instances. The enterprise login URL that includes your slug remains the URL used for IdP-initiated SSO flows with your identity provider.