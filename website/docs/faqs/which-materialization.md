---
title: Which materialization should I use for my model?
---
Start out with views, and then change models to tables when required for performance reasons (i.e. downstream queries have slowed).

Check out the [docs on materializations](https://docs.getdbt.com/docs/materializations#section-materializations) for advice on when to use each materialization.
