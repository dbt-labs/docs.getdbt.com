---
title: Which materialization should I use for my model?
description: "Recommendations on materializations to use for models"
sidebar_label: 'What materializations to use'
id: which-materialization

---
Start out with <Term id="view">views</Term>, and then change models to tables when required for performance reasons (i.e. downstream queries have slowed).

Check out the [docs on materializations](/docs/build/materializations) for advice on when to use each <Term id="materialization" />.
