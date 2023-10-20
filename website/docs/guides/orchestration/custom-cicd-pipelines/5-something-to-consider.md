---
title: Something to Consider
id: 5-something-to-consider
---

Running dbt Cloud jobs through a CI/CD pipeline is a form of job orchestration. If you also run jobs using dbt Cloud’s built in scheduler, you now have 2 orchestration tools running jobs. The risk with this is that you could run into conflicts - you can imagine a case where you are triggering a pipeline on certain actions and running scheduled jobs in dbt Cloud, you would probably run into job clashes. The more tools you have, the more you have to make sure everything talks to each other. 

That being said, if **the only reason you want to use pipelines is for adding a lint check or run on merge**, you might decide the pros outweigh the cons, and as such you want to go with a hybrid approach. Just keep in mind that if two processes try and run the same job at the same time, dbt Cloud will queue the jobs and run one after the other. It’s a balancing act but can be accomplished with diligence to ensure you’re orchestrating jobs in a manner that does not conflict.