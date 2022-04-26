Before moving on from building your first models, make a change and see how it affects your results:

* Write some bad SQL to cause an error — can you debug this error?
* Run only a single model at a time ([docs](/reference/node-selection/syntax))
* Group your models with a `stg_` prefix into a `staging` subdirectory (i.e. `models/staging/stg_customers.sql`)
  * Configure your `staging` models to be views
  * Run only the `staging` models
