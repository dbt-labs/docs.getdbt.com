---
title: Which materialization should I use for my model?
Description: “Recommendations on materializations to use for models”
sidebar_label: ‘What materializations to use’
id: structure-a-project

---
Start out with <Term id="view">views</Term>, and then change models to tables when required for performance reasons (i.e. downstream queries have slowed).

Check out the [docs on materializations](materializations) for advice on when to use each <Term id="materialization" />.
