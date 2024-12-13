---
title: "Expectations for OSS contributors"
---

Whether it's `dbt-core`, adapters, packages, or this very documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to share your knowledge, level yourself up as a developer, and to give back to the community. The goal of this page is to help you understand what to expect when contributing to dbt open source software (OSS).

Have you seen things in other OSS projects that you quite like, and think we could learn from? [Open a discussion on the dbt Community Forum](https://discourse.getdbt.com), or start a conversation in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community) (for example: `#community-strategy`, `#dbt-core-development`, `#package-ecosystem`, `#adapter-ecosystem`). We always appreciate hearing from you!

## Principles

### Open source is participatory

We all build dbt together -- whether you write code or contribute your ideas. By using dbt, you're invested in the future of the tool, and have an active role in pushing forward the standard of analytics engineering. You already benefit from using code and documentation contributed by community members. Contributing to the dbt community is your way to be an active participant in the thing we're all creating together.

There's a very practical reason, too: OSS prioritizes our collective knowledge and experience over any one person's. We don't have experience using every database, operating system, security environment, ... We rely on the community of OSS users to hone our product capabilities and documentation to the wide variety of contexts in which it operates. In this way, dbt gets to be the handiwork of thousands, rather than a few dozen.

### We take seriously our role as maintainers of a standard

As a standard, dbt must be reliable and consistent. Our first priority is ensuring the continued high quality of existing dbt capabilities before we introduce net-new capabilities.

We also believe dbt as a framework should be extensible enough to ["make the easy things easy, and the hard things possible"](https://en.wikipedia.org/wiki/Perl#Philosophy). To that end, we _don't_ believe it's appropriate for dbt to have an out-of-the-box solution for every niche problem. Users have the flexibility to achieve many custom behaviors by defining their own macros, materializations, hooks, and more. We view it as our responsibility as maintainers to decide when something should be "possible" — via macros, packages, etc. — and when something should be "easy" — built into the dbt Core standard.

So when will we say "yes" to new capabilities for dbt Core? The signals we look for include:
- Upvotes on issues in our GitHub repos
- Open source dbt packages trying to close a gap
- Technical advancements in the ecosystem

In the meantime — we'll do our best to respond to new issues with:
- Clarity about whether the proposed feature falls into the intended scope of dbt Core
- Context (including links to related issues)
- Alternatives and workarounds
- When possible, pointers to code that would aid a community contributor

### Initiative is everything

Given that we, as maintainers, will not be able to resolve every bug or flesh out every feature request, we empower you, as a community member, to initiate a change.

- If you open the bug report, it's more likely to be identified.
- If you open the feature request, it's more likely to be discussed.
- If you comment on the issue, engaging with ideas and relating it to your own experience, it's more likely to be prioritized.
- If you open a PR to fix an identified bug, it's more likely to be fixed.
- If you comment on an existing PR, to confirm it solves the concrete problem for your team in practice, it's more likely to be merged.

Sometimes, this can feel like shouting into the void, especially if you aren't met with an immediate response. We promise that there are dozens (if not hundreds) of folks who will read your comment, including us as maintainers. It all adds up to a real difference.

## Practicalities

### Discussions

A discussion is best suited to propose a Big Idea, such as brand-new capability in dbt Core or an adapter. Anyone can open a discussion, comment on an existing one, or reply in a thread.

When you open a new discussion, you might be looking for validation from other members of the community — folks who identify with your problem statement, who like your proposed idea, and who may have their own ideas for how it could be improved. The most helpful comments propose nuances or desirable user experiences to be considered in design and refinement. Unlike an **issue**, there is no specific code change that would “resolve” a discussion.

If, over the course of a discussion, we reach a consensus on specific elements of a proposed design, we can open new implementation issues that reference the discussion for context. Those issues will connect desired user outcomes to specific implementation details, acceptance testing, and remaining questions that need answering.

### Issues

An issue could be a bug you've identified while using the product or reading the documentation. It could also be a specific idea you've had for a narrow extension of existing functionality.

#### Best practices for issues

- Issues are **not** for support / troubleshooting / debugging help. Please see [dbt support](/docs/dbt-support) for more details and suggestions on how to get help.
- Always search existing issues first, to see if someone else had the same idea / found the same bug you did.
- Many dbt repositories offer templates for creating issues, such as reporting a bug or requesting a new feature. If available, please select the relevant template and fill it out to the best of your ability. This information helps us (and others) understand your issue.

##### You've found an existing issue that interests you. What should you do?

Comment on it! Explain that you've run into the same bug, or had a similar idea for a new feature. If the issue includes a detailed proposal for a change, say which parts of the proposal you find most compelling, and which parts give you pause.

##### You've opened a new issue. What can you expect to happen?

In our most critical repositories (such as `dbt-core`), our goal is to respond to new issues as soon as possible. This initial response will often be a short acknowledgement that the maintainers are aware of the issue, signalling our perception of its urgency. Depending on the nature of your issue, it might be well suited to an external contribution, from you or another community member.

**What if you're opening an issue in a different repository?** We have engineering teams dedicated to active maintenance of [`dbt-core`](https://github.com/dbt-labs/dbt-core) and its component libraries ([`dbt-common`](https://github.com/dbt-labs/dbt-common) + [`dbt-adapters`](https://github.com/dbt-labs/dbt-adapters)), as well as several platform-specific adapters ([`dbt-snowflake`](https://github.com/dbt-labs/dbt-snowflake), [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery), [`dbt-redshift`](https://github.com/dbt-labs/dbt-redshift), [`dbt-postgres`](https://github.com/dbt-labs/dbt-postgres)). We've open-sourced a number of other software projects over the years, and the majority of them do not have the same activity or maintenance guarantees. Check to see if other recent issues have responses, or when the last commit was added to the `main` branch.

**You're not sure about the status of your issue.** If your issue is in an actively maintained repo and has a `triage` label attached, we're aware it's something that needs a response. If the issue has been triaged, but not prioritized, this could mean:
- The intended scope or user experience of a proposed feature requires further refinement from a maintainer
- We believe the required code change is too tricky for an external contributor

We'll do our best to explain the open questions or complexity, and when / why we could foresee prioritizing it.

**Automation that can help us:** In many repositories, we use a bot that marks issues as stale if they haven't had any activity for 180 days. This helps us keep our backlog organized and up-to-date. We encourage you to comment on older open issues that you're interested in, to keep them from being marked stale. You're also always welcome to comment on closed issues to say that you're still interested in the proposal.

#### Issue labels

In all likelihood, the maintainer who responds will also add a number of labels. Not all of these labels are used in every repository.

In some cases, the right resolution to an open issue might be tangential to the codebase. The right path forward might be in another codebase (we'll transfer it), a documentation update, or a change that you can make yourself in user-space code. In other cases, the issue might describe functionality that the maintainers are unwilling or unable to incorporate into the main codebase. In these cases, a maintainer will close the issue (perhaps using a `wontfix` label) and explain why.

Some of the most common labels are explained below:

| tag                | description                                                                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `triage`           | This is a new issue which has not yet been reviewed by a maintainer. This label is removed when a maintainer reviews and responds to the issue.                                                                                                                        |
| `bug`              | This issue represents a defect or regression from the behavior that's documented                                                                                                                                                        |
| `enhancement`      | This issue represents a narrow extension of an existing capability                                                                                                                                                                          |
| `good_first_issue` | This issue does not require deep knowledge of the codebase to implement, and it is appropriate for a first-time contributor.                                                                                                                                       |
| `help_wanted`      | This issue is trickier than a "good first issue." The required changes are scattered across the codebase, or more difficult to test. The maintainers are happy to help an experienced community contributor; they aren't planning to prioritize this issue themselves. |
| `duplicate`        | This issue is functionally identical to another open issue. The maintainers will close this issue and encourage community members to focus conversation on the other one.                                                                                              |
| `stale`            | This is an old issue which has not recently been updated. In repositories with a lot of activity, stale issues will periodically be closed.                                                                                                                            |
| `wontfix`          | This issue does not require a code change in the repository, or the maintainers are unwilling to merge a change which implements the proposed behavior.                                                                                                                |

### Pull requests

**Every PR should be associated with an issue.** Why? Before you spend a lot of time working on a contribution, we want to make sure that your proposal will be accepted. You should open an issue first, describing your desired outcome and outlining your planned change. If you've found an older issue that's already open, comment on it with an outline for your planned implementation _before_ putting in the work to open a pull request.

**PRs must include robust testing.** Comprehensive testing within pull requests is crucial for the stability of dbt. By prioritizing robust testing, we ensure the reliability of our codebase, minimize unforeseen issues, and safeguard against potential regressions. **We cannot merge changes that risk the backward incompatibility of existing documented behaviors.** We understand that creating thorough tests often requires significant effort, and your dedication to this process greatly contributes to the project's overall reliability. Thank you for your commitment to maintaining the integrity of our codebase and the experience of everyone using dbt!

**PRs go through two review steps.** First, we aim to respond with feedback on whether we think the implementation is appropriate from a product & usability standpoint. At this point, we will close PRs that we believe fall outside the scope of dbt Core, or which might lead to an inconsistent user experience. This is an important part of our role as maintainers; we're always open to hearing disagreement. If a PR passes this first review, we will queue it up for code review, at which point we aim to test it ourselves and provide thorough feedback.

**We receive more PRs than we can thoroughly review, test, and merge.** Our teams have finite capacity, and our top priority is maintaining a well-scoped, high-quality framework for the tens of thousands of people who use it every week. To that end, we must prioritize overall stability and planned improvements over a long tail of niche potential features. For best results, say what in particular you'd like feedback on, and explain what would it mean to you, your team, and other community members to have the proposed change merged. Smaller PRs tackling well-scoped issues tend to be easier and faster for review. Two examples of community-contributed PRs:
- [(dbt-core#9347) Fix configuration of turning test warnings into failures](https://github.com/dbt-labs/dbt-core/pull/9347)
- [(dbt-core#9863) Better error message when trying to select a disabled model](https://github.com/dbt-labs/dbt-core/pull/9863)

**Automation that can help us:** Many repositories have a template for pull request descriptions, which will include a checklist that must be completed before the PR can be merged. You don't have to do all of these things to get an initial PR, but they will delay our review process. Those include:

- **Tests, tests, tests.** When you open a PR, some tests and code checks will run. (For security reasons, some may need to be approved by a maintainer.) We will not merge any PRs with failing tests. If you're not sure why a test is failing, please say so, and we'll do our best to get to the bottom of it together.
- **Contributor License Agreement** (CLA): This ensures that we can merge your code, without worrying about unexpected implications for the copyright or license of open source dbt software. For more details, read: ["Contributor License Agreements"](../resources/contributor-license-agreements.md)
- **Changelog:** In projects that include a number of changes in each release, we need a reliable way to signal what's been included. The mechanism for this will vary by repository, so keep an eye out for notes about how to update the changelog.

#### Inclusion in release versions

Both bug fixes and backwards-compatible new features will be included in the [next minor release of dbt Core](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning). Fixes for regressions and net-new bugs that were present in the minor version's original release will be backported to versions with [active support](/docs/dbt-versions/core). Other bug fixes may be backported when we have high confidence that they're narrowly scoped and won't cause unintended side effects.
