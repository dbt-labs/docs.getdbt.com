---
title: "Enhancement: New Cloud IDE beta"
id: "ide-improvements-beta.md"
description: "Aug 2022 release note: Launch of the IDE beta, which focuses on performance and reliability improvements."
sidebar_label: "Enhancement: New cloud IDE beta"
tags: [Aug-2022, IDE]
---

:::info Beta feature 
Read more about the [Cloud IDE beta](https://www.getdbt.com/blog/staging-highlights-the-latest-from-dbt-labs/) and [submit your expression of interest](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join the new Cloud IDE beta group.

:::

Building code on the dbt Cloud integrated development environment (IDE) should be seamless, and the tool that you’re using should not add more distractions to the data work that is often already confusing and difficult.

We're now excited to start rolling out the IDE Beta version, which focuses on performance and reliability improvements.

The classic IDE currently has severe performance and reliability issues. It takes a long time to start up the IDE, and the interactions (saving or committing) are slow.

Our focus is on performance and reliability, particularly around the following four metrics:

- Spinner time for cold start = Time that you see a spinner in a brand new session.
- Spinner time for hot start = Time that you see a spinner when you resume an existing session (return within 3 hours).
- Time to save = Time between saving a file and the IDE being ready for edit.
- Time to git = Time between making a commit and the IDE being ready for edit.

**Improvements:**

To address the issue, we rebuilt the IDE and made some significant architectural changes to the way we work. These changes will help improve the IDE performance and reliability:

- Your IDE spinner and interaction time will be faster, regardless of the size of your dbt project.
    - Instead of fetching and downloading all the contents for the files during any change, the IDE only needs the file tree/name. This means that starting up the IDE should no longer depend on the size of the dbt project. This also helps make the interaction with the IDE (saving files and committing changes) more snappy.

- Your IDE spinner time will be quicker as you can access it without needing to wait for the rpc server to finish getting ready.


