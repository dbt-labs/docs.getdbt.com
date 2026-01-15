:::info
If your model has an [enforced contract](/docs/mesh/govern/model-contracts), you cannot delete the model until after the `deprecation_date` has passed. dbt doesn't allow deleting models with enforced contracts before their `deprecation_date` to protect downstream consumers.

If you try to delete a versioned model before its `deprecation_date`, dbt will raise an error during development runs and cause jobs to fail.

:::
