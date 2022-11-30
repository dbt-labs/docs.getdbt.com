---
title: "Resolve merge conflicts"
id: "resolve-merge-conflicts"
---

Merge conflicts often occur when multiple users are concurrently making edits to the same section in the same file. This makes it difficult for Git to determine which change should be kept. The merge conflict process gives users the ability to sort out which lines of code should be kept and committed. Here we'll show you how you'd resolve merge conflicts in the IDE!

## Running into a merge conflict

In this example we have a column that represents the total number of orders your customer has ever had. It's currently named `number_of_orders` but your stakeholder feels like this could be named better.

You and a teammate make changes to the column name, but have gone two separate routes. You rename this column to `total_number_of_orders` and your teammate has renamed it `historical_order_count`.

Your teammate has committed their change first, so you encounter a merge conflict when you press commit.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-to-merge-conflict.png" title="Commit which will trigger the merge conflict"/>

You will then see that the git action bar shows `commit and resolve...` instead of `commit` indicating that the Cloud IDE has detected some conflicts that need to be addressed. You should also see the conflict section marked with some flags:
```
<<<<<< HEAD
    your current code
======
    conflicting code
>>>>>> (some branch identifier)
```

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/conflict-section.png" title="Conflicting section that needs resolution will be highlighted"/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/file-highlight.png" title="File and path are colored in red with a warning sign to highlight files that need to be resolved"/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-warning.png" title="Pressing commit without resolving the conflict will also list which files need to be addressed"/>

:::info Encountering Merge Conflicts

You could run into this merge conflict in 2 possible ways:
- Pulling changes from your main branch when someone else has merged a conflicting change
- Committing your changes to the same branch when someone else has already committed their change first (this scenario)

The way to resolve either scenario will be exactly the same!

:::

## Resolving conflicts

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/resolve-section.png" title="Choosing lines to keep"/>

1. Choose which lines of code you'd like to preserve. Delete the rest, make sure to also delete the special flags that highlight the merge conflict.
2. Press save! You will notice the line highlights disappearing, returning to a plain white background, which is a good sign that you've resolved the conflict successfully!

Repeat this process for every file that has a merge conflict.

## Completing the process

When you've resolved all the merge conflicts, the last step would be to commit the changes you've made!

The easiest way to identify whether you've successfully resolved all conflicts would be to check the file tree. If all the files highlighted in red have a file icon next to it, instead of the warning sign, you should be good to go!

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/needs-resolution.png" title="Conflict still needs to be resolved"/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/resolved-file.png" title="Conflict has been resolved! "/>

You will also know it's time to commit when you press the `commit and resolve...` button and the modal does not have any warning messages about unresolved merge conflicts!

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-warning.png" title="Commit modal with a warning highlighting unresolved merge conflicts"/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/clean-commit-modal.png" title="Clean commit modal that's ready to be committed"/>

When you're ready, write your commit message as you normally would and press the `Commit` button!

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit-to-resolve.png" title="Commit merge conflict resolution"/>
