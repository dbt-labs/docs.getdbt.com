Copy each prompt into the chat, one at a time. <Constant name="wizard" /> answers from your project's metadata, so the answers describe jaffle shop, not a generic project.

1. **Get the big picture**

    ```text
    Tell me about this project
    ```

2. **Check the testing**

    ```text
    What tests does the orders model have, and what isn't covered?
    ```

3. **Trace the lineage**

    ```text
    What feeds into the orders model, and what depends on it?
    ```

{/* TODO(verify): run all three prompts on the sample project and paste the real answers into "You should see". Exact wording of the testing answer depends on the repo's current schema.yml. */}

**You should see:**

- A summary that mentions customers, orders, and payments.
- A short list of the tests on `orders`, plus any gaps.
- A lineage answer: `orders` is built from the staging models for orders and payments, and `customers` is not downstream of it.

**What just happened:** <Constant name="wizard" /> read your models, tests, and lineage instead of guessing from file names. It answered without editing anything.
