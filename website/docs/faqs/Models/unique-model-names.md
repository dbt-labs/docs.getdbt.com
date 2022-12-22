---
title: Do model names need to be unique?
description: "Unique model names to build dependencies"
sidebar_label: 'Model names need to be unique'
id: unique-model-names

---

Yes! To build dependencies between models, you need to use the `ref` function. The `ref` function only takes one argument — the model name (i.e. the filename). As a result, these model names need to be unique, _even if they are in distinct folders_.

Often, this question comes up because users want to give two models the same name in their warehouse, splitting them across separate schemas (e.g. `stripe.users` and `app.users`). Checkout the docs on [custom aliases](/docs/build/custom-aliases) and [custom schemas](/docs/build/custom-schemas) to achieve this.
