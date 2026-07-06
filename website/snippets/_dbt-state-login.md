<VersionBlock firstVersion="1.13">

## `dbt login` with dbt State

When [dbt State](/docs/deploy/dbt-state-about) is enabled, `dbt login` is used specifically for dbt State authentication, not for general <Constant name="dbt_platform" /> access. Running this command opens a browser window with two options:

- **Log in with your <Constant name="dbt_platform" /> account**: Enter your email address. If you don't have a <Constant name="dbt_platform" /> account, dbt Labs will create a standalone [Developer account](https://www.getdbt.com/pricing) for you. After that, you'll authorize access between the CLI and <Constant name="dbt_platform" />.

  In the <Constant name="fusion_engine" />, once authenticated, the CLI checks your configuration and responds accordingly:

  | dbt State enabled in <Constant name="dbt_platform" />? | dbt State enabled locally? | Behavior |
  |---|---|---|
  | ✅ | ✅ | dbt State is ready to use. |
  | ✅ | ❌ | CLI prompts you to enable dbt State locally. If you confirm, [`user_settings.yml`](/reference/global-configs/user-settings) is updated automatically. |
  | ❌ | ✅ | CLI prompts you to enable dbt State in your platform account. |

  In <Constant name="core" /> v1.13 and later, `dbt login` automatically sets `manage_state: true` in [`user_settings.yml`](/reference/global-configs/user-settings) after platform authentication, unless you've explicitly disabled it. Whether dbt State is enabled in your <Constant name="dbt_platform" /> account is checked when you run a dbt command &mdash; if it's not enabled, dbt will fail on your next `dbt run` or `dbt build`. To resolve this, refer to [User settings](/reference/global-configs/user-settings#when-dbt-state-is-enabled-locally-but-not-in-dbt-platform).

- **Log in without a <Constant name="dbt_platform" /> account**: Redirects you to the dbt State standalone app at [app.state.dbt.com](https://app.state.dbt.com), where a token is created and stored locally at `~/.dbt/auth_state.json`. dbt State is automatically enabled locally after account creation. Select this option if any of the following apply:
  - You don't have a <Constant name="dbt_platform" /> account.
  - You don't have admin permissions to enable dbt State in your <Constant name="dbt_platform" /> account.
  - You want to try dbt State independently first.

</VersionBlock>
