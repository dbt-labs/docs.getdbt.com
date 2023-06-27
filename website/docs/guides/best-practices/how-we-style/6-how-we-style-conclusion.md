---
title: Now it's your turn
id: 6-how-we-style-conclusion
---

## BYO Styles

Now that you've seen how we style our dbt projects, it's time to build your own. Feel free to copy this guide and use it as a template for your own project. If you do, we'd love to hear about it! Reach out to us on [the Community Forum](https://discourse.getdbt.com/c/show-and-tell/22) or [Slack](https://www.getdbt.com/community) to share your style guide. We recommend co-locating your style guide with your code to make sure contributors can easily follow it. If you're using GitHub, you can add your style guide to your repository's wiki, or include it in your README.

## Pre-commit hooks

Lastly, to ensure your style guide's automated rules are being followed without additional mental overhead to your team, you can use [pre-commit hooks](https://pre-commit.com/) to automatically check your code for style violations (and often fix them automagically) before it's committed. This is a great way to make sure your style guide is followed by all contributors. We recommend implementing this once you've settled on and published your style guide, and your codebase is conforming to it. This will ensure that all future commits follow the style guide. You can find an excellent set of open source pre-commit hooks for dbt from the community [here in the dbt-checkpoint project](https://github.com/dbt-checkpoint/dbt-checkpoint).
