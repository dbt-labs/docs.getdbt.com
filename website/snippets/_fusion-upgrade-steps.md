#### Upgrade considerations

Keep in mind the following considerations during the upgrade process:

- **Manifest compatibility** &mdash; <Constant name="fusion" /> produces a `v12` [manifest](/reference/artifacts/manifest-json) that's compatible with <Constant name="core" />. The only differences are optional, <Constant name="fusion" />-specific fields, which <Constant name="core" /> safely ignores.

  As a result, you can run <Constant name="fusion" /> and <Constant name="core" /> side by side. State-dependent features such as `state:modified`, `--defer`, and cross-environment `dbt docs generate` work across mixed <Constant name="fusion" /> and <Constant name="core" /> environments, so you can migrate to <Constant name="fusion" /> incrementally without breaking existing <Constant name="core" /> jobs.

<!--
- **dbtState-aware orchestration** &mdash; If using [state-aware orchestration](/docs/deploy/state-aware-about), dbt doesn't detect a change if a table or view is dropped outside of dbt, as the cache is unique to each <Constant name="dbt_platform" /> environment. This means state-aware orchestration will not rebuild that model until either there is new data or a change in the code that the model uses.
  - **Workarounds:**
    - Use the **Clear cache** button on the target Environment page to force a full rebuild (acts like a reset), or
    - Temporarily disable state-aware orchestration for the job and rerun it.
-->
  :::caution State-aware orchestration is now dbt State
  [dbt State](/docs/deploy/dbt-state-about) works with all engines and environments: <Constant name="core" />, the <Constant name="dbt_platform" />, and <Constant name="fusion_engine" />.

  If you're using state-aware orchestration prior to June 1, 2026, you can continue using it. Existing state-aware orchestration customers automatically receive a 90-day trial of dbt State. To get started, refer to [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration).
  :::

