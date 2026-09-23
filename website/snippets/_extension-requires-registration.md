:::info Uses your <Constant name="dbt_platform" /> account
This capability can read from your <Constant name="dbt_platform" /> account. [Sign in](/docs/sign-in-dbt-extension) so the dbt VS Code extension can reach it.

<VersionBlock firstVersion="2.0">

Authentication is handled by [`dbt login`](/reference/commands/login?version=2.0), so your login state is shared across the CLI, dbt VS Code extension, and <Constant name="copilot"/>.

</VersionBlock>
:::
