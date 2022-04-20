---
id: idempotent
title: Idempotent
displayText: idempotent
hoverSnippet: Idempotent describes a process that is independent of previous executions of that same process.
---

Idempotent is a way to describe a particular process.  A process that is idempotent is independent of previous executions of that same process.  

For a mathematical example, the process of adding 1 is not idempotent where as the process of multiplying by 1 is idempotent.  If I add 1 to a number and then add 1 again, I don’t get the same results. If I multiply a number by 1 and multiply by 1 again, I do get the same result.

Idempotent is an intimidating word, but particularly important in a data transformation process. dbt was built to be idempotent to avoid those challenges of having to roll back changes and being able to independently refresh your data pipeline.

>This is the concept in analytics engineering that is the hardest to spell and the most important to learn.
