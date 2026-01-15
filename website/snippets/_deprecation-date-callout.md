:::info
If your model has an [enforced contract](/docs/mesh/govern/model-contracts), you won't be able to delete the model until after the `deprecation_date` has passed. dbt won't allow deleting the model(s) with enforced contracts until after their `deprecation_date` to protect downstream consumers.

If you try to delete a versioned model before its `deprecation_date`, dbt will raise an error during development runs and cause jobs to fail.

:::
