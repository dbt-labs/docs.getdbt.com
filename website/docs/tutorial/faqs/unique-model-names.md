---
title: Do model names need to be unique?
---
Yes! To build dependencies between models, you need to use the `ref` function. The `ref` function only takes one argument — the model name (i.e. the filename). As a result, these model names need to be unique, even if they are in separate folders.

Often, this question comes up because users want to give two models the same name in their warehouse, splitting them across separate schemas (e.g. `stripe.users` and `app.users`). Checkout the docs on [custom aliases](https://docs.getdbt.com/docs/using-custom-aliases) and [custom schemas](https://docs.getdbt.com/docs/using-custom-schemas) to achieve this.
