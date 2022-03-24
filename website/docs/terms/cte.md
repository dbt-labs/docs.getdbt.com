---
id: cte
title: CTE
displayText: CTE  
hoverSnippet: CTE is one of those SQL specific acronyms that is impossible to Google.
---

CTE is one of those SQL specific acronyms that is impossible to Google. It stands for common table expression, but the name itself doesn’t feel super self explanatory.. A CTE is used in order to enable readability within code. It is used to group little query snippets, and reference them all within one large piece of work. Each CTE is a common-table-expression because you are creating and naming a snippet that you will use more than once within your code so that you do not need to repeat, but instead just reference the common piece of code. 

Common Table Expression - Creating an ephemeral table to reference downstream in your SQL query for ease of understanding / improved query readability. In my experience, these are extra helpful when you need to operate over aggregates.

CTEs are really helpful for troubleshooting. You can easily track each step of your process to see where something went wrong.

```
  with cte_1 as (
  ...
  ),
  cte_2 as (
  ...
  ),
  cte_3 as (
  ...
  ),
  final as (
  ...
  )
  select * from final
```

I can easily hop into my code and adjust the final line to check the output of each previous CTE (example: select * from final → select * from cte_2). This saves lots of time when trying to find an error in your code! (Much easier than dealing with tons of nested queries)
