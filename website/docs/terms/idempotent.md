---
id: idempotent
title: Idempotent
displayText: idempotent
hoverSnippet: Idempotent describes a process that is independent of previous executions of that same process.
---
:::important This page could use some love
This term would benefit from additional depth and examples. Have knowledge to contribute? [Create a discussion in the docs.getdbt.com GitHub repository](https://github.com/dbt-labs/docs.getdbt.com/discussions) to begin the process of becoming a glossary contributor!
:::

Idempotent is a way to describe a particular process.  A process that is idempotent is independent of previous executions of that same process.  

For a mathematical example, adding 1 changes the results, but multiplying by 1 is idempotent. When you add 1 to a number and then add 1 again, you get different results. If you multiply a number by 1 and multiply by 1 again, you do get the same result.

Idempotent is an intimidating word, but particularly important in a data transformation process. dbt was built to be idempotent to avoid those challenges of having to roll back changes and being able to independently refresh your data pipeline.

:::note Note
This is the concept in analytics engineering that is the hardest to spell and the most important to learn.
:::
