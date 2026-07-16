#### Considerations

There are some considerations to keep in mind when using model governance features:

- Model governance features like model access, contracts, and versions strengthen trust and stability in your dbt project. Because they add structure, they can make rollbacks harder (for example, removing model access) and increase maintenance if adopted too early.
  Before adding governance features, consider whether your dbt project is ready to benefit from them.  Introducing governance while models are still changing can complicate future changes.

- Governance features are model-specific. They don't apply to other resource types, including snapshots, seeds, or sources. This is because these objects can change structure over time (for example, snapshots capture evolving historical data) and aren't suited to guarantees like contracts, access, or versioning.
