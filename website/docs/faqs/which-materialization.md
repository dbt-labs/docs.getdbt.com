---
title: Which materialization should I use for my model?
---
Start out with <Term id="view">views</Term>, and then change <Term id="model">models</Term> to tables when required for performance reasons (i.e. downstream queries have slowed).

Check out the [docs on materializations](materializations) for advice on when to use each <Term id="materialization" />.
