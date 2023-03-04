---
title: "Setting up example projects locally"
id: 2-setting-up-examples-on-core-manual
slug: working-with-guides/core/2-setting-up-manual
description: Learn how to set up Guides example projects on dbt Core on your computer.
displayText: dbt Core manual setup
hoverSnippet: Learn how to set up Guides example projects on dbt Core on your computer.
---

## Getting started

This path is for more advanced user who already have a preferred method of developing with dbt locally. We'll outline some basic steps here, but feel free to make this repo work with your preferred setup.

1. 🔀 **Fork the repo**. Go to the repo specificed as the example project in the guide you're working through, or start from [the base template](https://github.com/dbt-labs/jaffle-shop-template). Click `Use this template` and `Create new repository`.
2. 👯 **Clone your fork locally.** If you're unsure how to do this in GitHub, we'd suggest workign through one of the other pathways.
3. 🌍 Ideally you should **create a virtual environment** for your project. Again, if you're not sure about this step, we'd suggest the other learning options.
4. 📚 **Install the dependencies** in `requirements.txt`.
5. ↔️ Ensure you're **connecting to the profile** you want to connect to. If you're using duckdb you can use the profile in the repo. If you want to connect to an existing warehouse, you'll want to delete that file so dbt looks in you `~/.dbt/profiles.yml` file.
6. 📦 **Run `dbt deps`** to install the necessary dbt packages.
7. 🛠️ **Run a `dbt build`** to build the project!
8. 📊 Use [duckcli](https://github.com/dbcli/duckcli) and [Evidence](https://evidence.dev/) to explore the data from the commandline or an open source, code-first BI tool.
