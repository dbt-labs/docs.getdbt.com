---
title: "Setting up example projects with GitHub Codespaces"
id: 1-setting-up-examples-on-core-recommended
slug: working-with-guides/core/1-setting-up-recommended
description: Learn how to set up Guides example projects on dbt Core in GitHub Codespaces.
displayText: dbt Core recommended setup
hoverSnippet: Learn how to set up Guides example projects on dbt Core in GitHub Codespaces.
---

## Core Codespaces

![Click use this template](/img/guides/working-with-guides/use-template.gif)
![Click use this template](/img/guides/working-with-guides/open-codespace.gif)

1. 🔀 **Fork the repo**. As above, go to the repo specificed as the example project in the guide you're working through, click `Use this template` and `Create new repository`.
2. 🚀 **Open the codespace**. Navigate to that new repository. Where you would normally clone it from the Code button, instead go to the Codespaces tab and click `Create codespace on main` as shown above.
   1. ↔ Depending on your settings, this will **either spin up a browser tab running VSCode** or open the codespace in in a **new window of VSCode** if you have it installed and prefer this. Either option is perfectly fine for this tutorial.
3. 🍵 **Let the codespace build itself out.** This will take several minutes, grab a cup of tea and come back when it’s setup. It’s building an entire functioning dbt environment and warehouse, stocked with data from a simulated [jaffle](https://craftytoasties.com/what-is-a-jaffle/) shop (a fictional cafe selling food and beverages in several US cities) business for you. You’ll see a tab like the below while it’s working. When this tab closes the build has completed.
   ![GitHub Codespaces setup screen](/img/guides/working-with-guides/codespaces-setup-screen.png)
4. 💁‍♀️ **Ready to go**. That's it! All dbt commands should work and you can use [duckcli](https://github.com/dbcli/duckcli) to write SQL against the warehouse from the command line.
