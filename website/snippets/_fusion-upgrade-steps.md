#### Upgrade considerations

Keep in mind the following considerations during the upgrade process:

- **Manifest incompatibility** &mdash; <Constant name="fusion" /> is backwards-compatible and can read <Constant name="core" /> [manifests](/reference/artifacts/manifest-json). However, <Constant name="core" /> isn't forward-compatible and can't read Fusion manifests. <Constant name="fusion" /> produces a `v20` manifest, while the latest version of <Constant name="core" /> still produces a `v12` manifest.

  As a result, mixing <Constant name="core" /> and <Constant name="fusion" /> manifests across environments breaks cross-environment features. To avoid this, use `state:modified`, `--defer`, and cross-environment `dbt docs generate` only after _all_ environments are running the latest Fusion version. Using these features before all environments are on <Constant name="fusion" /> may cause errors and failures.

- **State-aware orchestration** &mdash; If using [state-aware orchestration](/docs/deploy/state-aware-about), dbt doesn’t detect a change if a table or view is dropped outside of dbt, as the cache is unique to each <Constant name="dbt_platform" /> environment. This means state-aware orchestration will not rebuild that model until either there is new data or a change in the code that the model uses.
  - **Workarounds:**
    - Use the **Clear cache** button on the target Environment page to force a full rebuild (acts like a reset), or
    - Temporarily disable State-aware orchestration for the job and rerun it.
