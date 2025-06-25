---
title: "The new dbt VS Code extension: The experience we've all been waiting for"
description: "How the new dbt VS Code extension finally delivers the dev experience we've always wanted."
slug: vscode-extension-experience
authors: [bruno_lima]

tags: [analytics craft, data ecosystem]
hide_table_of_contents: false

date: 2025-06-25
is_featured: true
---

Hello, community!

My name is Bruno, and you might have seen me posting dbt content on LinkedIn. If you haven't, let me introduce myself. I started working with dbt more than 3 years ago. At that time, I was very new to the tool, and to understand it a bit better, I started creating some resources to help me with dbt learning. One of them, a dbt cheatsheet, was the starting point for my community journey.

I went from this cheatsheet to creating all different kinds of content, contributing and engaging with the community, until I got the dbt community award two times, and I am very thankful and proud about that.

Since the acquisition of SDF Labs by dbt Labs, I have been waiting for the day that we would see what the result of the fusion of these two companies would be. Spoiler alert: It’s the dbt Fusion engine and it's better than I could have expected.

## The dbt developer experience in the pre-fusion-era

If you've ever started a dbt project, chances are your journey began like mine did: cloning `jaffle_shop`, opening it in VS Code, and running [`dbt run`](/reference/commands/run) for the first time (actually the second time, because I know you forgot to run [`dbt deps`](/reference/commands/deps) in the first one). This is the dbt initiation process, our ‘hello-world’.

You played around with [staging models](/best-practices/how-we-structure/2-staging#staging-models), the orders table, customers table. But let's be honest, the developer experience in that setup was always a bit... clunky.

You wanted to check the lineage of your project, one of the coolest features of dbt, and you had to run [`dbt docs generate`](/reference/commands/cmd-docs#dbt-docs-generate), [`serve`](/reference/commands/cmd-docs#dbt-docs-serve), and open the docs in a browser. Made some updates? Do all the steps again.

Did you want to check your project's metadata? You had to rely on [`dbt docs`](/reference/commands/cmd-docs) (that whole process again), or build some custom solution with the [`manifest.json`](/reference/artifacts/manifest-json).

Moving to dbt Cloud (now called just <Constant name="cloud" />) made things smoother. It has a built-in <Constant name="cloud_ide" /> with git integration, easier to compile and preview models. An auto-updating lineage tab below the model, a much better documentation with dbt Explorer, now renamed to Catalog. And a lot of other powerful features for orchestration, observability, CI/CD, and more.

The cloud-based <Constant name="cloud" /> was a big step up, but even so, many of us still preferred to use our own dev environments. We like using our themes, our VS Code extensions, our terminals, but this would mean losing all the nice cloud features while developing. A sad trade-off.

We've already been to <Constant name="cloud" /> platform and back to the terminal, and some problems remain. Consider this all too common scenario when modifying a dbt model: forgetting a comma[1]. You don't learn your mistake until after dbt tries to run this model on your warehouse, but dbt can't do this until your cluster is turned on. So it's not until a full minute later that you get the feedback about your missing punctuation mark.

[1]: because you are using trailing commas instead of leading commas, and they're harder to see, and I'm talking too much about the comma fight.

All this back-and-forth communication of dbt and the platform was slowing down your project.

That’s why this new release is such a big deal. It solves all the problems above and introduces other things I didn't know I needed until I saw it.

## The new era of dbt development

With the acquisition of SDF Labs and a renewed focus on developer experience, dbt Labs announced its new engine, [Fusion](/docs/fusion/about-fusion). This engine was built from zero with Rust, and its intelligence will power up dbt, no matter where you run it. There are different ways you can use the Fusion engine, and the best one is with the also announced VS Code extension.

The Fusion engine with the VS Code extension is how folks will want to develop with dbt moving forward. I can say this feels like the experience we’ve all been waiting for.

After using it, it’s hard to imagine going back. Working with dbt in VS Code without this extension just doesn’t make sense anymore.

It comes with a lot of features to streamline your work and make you more efficient by developing faster and spending less. But let me tell you about my favorites:

### Catch SQL Errors in Real Time

There was no question what I was picking first. No more waiting for your platform to debug your code for you. If you misspell a column name or goof up a function's order of parameters, you catch those errors before you run anything.

This is because Fusion doesn't treat SQL code as just a string anymore; it really understands it. It also shows you some helpful information about the error.

<Lightbox src="/img/blog/2025-06-16-the-new-dbt-vscode-extension/vs_code_extension_function_error.png" title="Showing function errors." />

<Lightbox src="/img/blog/2025-06-16-the-new-dbt-vscode-extension/vs_code_extension_column_error.png" title="Showing column name errors." />

This is the greatest improvement of this engine, IMHO.

### Model and Column Lineage

My next favorite feature is the lineage view. If you were a <Constant name="cloud" /> platform user, you would feel at home. And if you were using dbt Core, finally, no more generating `dbt docs` to visualize lineage.

Now there's a tab lineage tab that shows your project’s lineage directly in VS Code. It’s interactive and live. You can use the lenses feature, that's pretty cool to have a good visualization of your project by different attributes like resource_type, or materialization.

<Lightbox src="/img/blog/2025-06-16-the-new-dbt-vscode-extension/vs_code_extension_project_lineage.png" title="Project Lineage." />

And something I was not expecting to be here, but thankfully it is, column-level lineage! Not just where columns come from, but also how they change: renamed, transformed, or passed through.

This is incredibly helpful for debugging transformations or understanding how that key metric is shaped across models.

<Lightbox src="/img/blog/2025-06-16-the-new-dbt-vscode-extension/vs_code_extension_cll.png" title="Column-level Lineage." />

### Instant refactoring

Ok, let me show you just one more thing! Have you ever faced a situation where you'd like to rename a model or a column, but it's used many places downstream that you give up because you don't want to refactor everything or you are afraid you will break something?

Now, thanks to the deep dbt Fusion SQL understanding, you can rename your model or column, and the extension will refactor all downstream dependencies for you. But don't worry, before doing it, the extension allows you to see a preview of the changes, so you can be sure it is doing what you want.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/blog/2025-06-16-the-new-dbt-vscode-extension/vs_code_extension_refactoring.webm" type="video/webm" />
</video>

There are a lot more other features this extension is bringing, like navigating through models instantly, autocompleting everything, renaming models or columns and being warned how it will impact your project, previewing models & CTEs, and other features that are already covered in other blogs. By the way, it just launched, so I believe we can expect more and more enhancements to come.

## Conclusion: A New Default

This extension changes what using dbt feels like. It brings together performance, context, and interactivity in a way that finally makes dbt feel at home inside a modern developer environment. And the best part? It’s just getting started.

The Fusion engine is already powering a faster, smarter dbt under the hood. And it opens the door to a more fluid, confident, and intuitive development experience. Fewer context switches. Fewer gotchas. More time spent thinking about your data, not your tooling.

If you’ve ever built models in a text editor and wished dbt “just knew more,” this is for you.

If you’ve relied on the CLI but missed having true autocomplete, this is for you.

And if you’ve wanted the best of both worlds, the flexibility of Core with the power of Cloud, this might just become your new default. Even if you use dbt Cloud, it powers up dbt-core to another level.

We’re incredibly excited to see how the community builds with this. Try it out. Push it. Share what’s working, and what’s missing.

This new extension will be constantly updated, so stay tuned for more improvements.

**This is the experience we’ve all been waiting for.**

*Bruno is a lead Data Engineer at [phData](https://www.phdata.io), and recently built a dbt learning platform called [DataGym.io](https://www.datagym.io).*
