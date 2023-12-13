---
title: "Expectations for OSS contributors"
---

Whether it's a dbt package, a plugin, `dbt-core`, or this very documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and to give back to the community. The goal of this page is to help you understand what to expect when contributing to dbt open source software (OSS). While we can only speak for our own experience as open source maintainers, many of these guidelines apply when contributing to other open source projects, too.

Have you seen things in other OSS projects that you quite like, and think we could learn from? [Open a discussion on the dbt Community Forum](https://discourse.getdbt.com), or start a conversation in the dbt Community Slack (for example: `#community-strategy`, `#dbt-core-development`, `#package-ecosystem`, `#adapter-ecosystem`). We always appreciate hearing from you!

## Principles

### Open source is participatory

Why take time out of your day to write code you don’t _have_ to? We all build dbt together. By using dbt, you’re invested in the future of the tool, and an agent in pushing forward the practice of analytics engineering. You’ve already benefited from using code contributed by community members, and documentation written by community members. Contributing to dbt OSS is your way to pay it forward, as an active participant in the thing we’re all creating together.

There’s a very practical reason, too: OSS prioritizes our collective knowledge and experience over any one person’s. We don’t have experience using every database, operating system, security environment, ... We rely on the community of OSS users to hone our product capabilities and documentation to the wide variety of contexts in which it operates. In this way, dbt gets to be the handiwork of thousands, rather than a few dozen.

### We take seriously our role as maintainers

In that capacity, we cannot and will not fix every bug ourselves, or code up every feature worth doing. Instead, we’ll do our best to respond to new issues with context (including links to related issues), feedback, alternatives/workarounds, and (whenever possible) pointers to code that would aid a community contributor. If a change is so tricky or involved that the initiative rests solely with us, we’ll do our best to explain the complexity, and when / why we could foresee prioritizing it. Our role also includes maintenance of the backlog of issues, such as closing duplicates, proposals we don’t intend to support, or stale issues (no activity for 180 days).

### Initiative is everything

Given that we, as maintainers, will not be able to resolve every bug or flesh out every feature request, we empower you, as a community member, to initiate a change.

- If you open the bug report, it’s more likely to be identified.
- If you open the feature request, it’s more likely to be discussed.
- If you comment on the issue, engaging with ideas and relating it to your own experience, it’s more likely to be prioritized.
- If you open a PR to fix an identified bug, it’s more likely to be fixed.
- If you contribute the code for a well-understood feature, that feature is more likely to be in the next version.
- If you review an existing PR, to confirm it solves a concrete problem for you, it’s more likely to be merged.

Sometimes, this can feel like shouting into the void, especially if you aren’t met with an immediate response. We promise that there are dozens (if not hundreds) of folks who will read your comment, maintainers included. It all adds up to a real difference.

# Practicalities

As dbt OSS is growing in popularity, and dbt Labs has been growing in size, we’re working to involve new people in the responsibilities of OSS maintenance. We really appreciate your patience as our newest maintainers are learning and developing habits.

## Discussions

Discussions are a relatively new GitHub feature, and we really like them!

A discussion is best suited to propose a Big Idea, such as brand-new capability in dbt Core, or a new section of the product docs. Anyone can open a discussion, add a comment to an existing one, or reply in a thread.

What can you expect from a new Discussion? Hopefully, comments from other members of the community, who like your idea or have their own ideas for how it could be improved. The most helpful comments are ones that describe the kinds of experiences users and readers should have. Unlike an **issue**, there is no specific code change that would “resolve” a Discussion.

If, over the course of a discussion, we do manage to reach consensus on a way forward, we’ll open a new issue that references the discussion for context. That issue will connect desired outcomes to specific implementation details, as well as perceived limitations and open questions. It will serve as a formal proposal and request for comment.

## Issues

An issue could be a bug you’ve identified while using the product or reading the documentation. It could also be a specific idea you’ve had for how it could be better.

### Best practices for issues

- Issues are **not** for support / troubleshooting / debugging help. Please [open a discussion on the dbt Community Forum](https://discourse.getdbt.com), so other future users can find and read proposed solutions. If you need help formulating your question, you can post in the `#advice-dbt-help` channel in the [dbt Community Slack](https://www.getdbt.com/community/).
- Always search existing issues first, to see if someone else had the same idea / found the same bug you did.
- Many repositories offer templates for creating issues, such as when reporting a bug or requesting a new feature. If available, please select the relevant template and fill it out to the best of your ability. This will help other people understand your issue and respond.

### You’ve found an existing issue that interests you. What should you do?

Comment on it! Explain that you’ve run into the same bug, or had a similar idea for a new feature. If the issue includes a detailed proposal for a change, say which parts of the proposal you find most compelling, and which parts give you pause.

### You’ve opened a new issue. What can you expect to happen?

In our most critical repositories (such as `dbt-core`), **our goal is to respond to most new issues within 2 standard work days.** This response will include the context, feedback, and pointers that we can offer as maintainers. Depending on the nature of your issue, it might be well suited to an external contribution, from you or another community member.

**What does “triage” mean?** In some repositories, we use a `triage` label to keep track of issues that need a response from a maintainer. In the `dbt-core` repo, we also tag issues with a "team" that will be providing the response.

**What if I’m opening an issue in a smaller repository?** We’ve open sourced a number of software projects over the years; not all of them have the same activity or maintenance guarantees as `dbt-core`. Check to see if other recent issues have responses, or when the last commit was added to the `main` branch.

**If my issue is lingering...** Sorry for the delay! If your issue is in a busier repo and has a `triage` label attached, we’re still aware of it as something that needs a response. If it's a smaller repo, or if it’s been more than two weeks without a response, we’d encourage you to comment and tag `@dbt-labs/oss-maintainers`, reminding us that you’re waiting.

**Automation that can help us:** In many repositories, we use a bot that marks issues as stale if they haven’t had any activity for 180 days. This helps us keep our backlog organized and up-to-date. We encourage you to comment on older open issues that you’re interested in, to keep them from being marked stale. You’re also always welcome to comment on closed issues to say that you’re still interested in the proposal.

### Issue labels

In all likelihood, the maintainer who responds will also add a number of labels. Not all of these labels are used in every repository.

In some cases, the right resolution to an open issue might be tangential to the codebase. The right path forward might be in another codebase (we'll transfer it), a documentation update, or a change that can be made in user-space code. In other cases, the issue might describe functionality that the maintainers are unwilling or unable to incorporate into the main codebase. In these cases, a maintainer will close the issue (perhaps using a `wontfix` label) and explain why.

| tag                | description                                                                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `triage`           | This is a new issue which has not yet been reviewed by a maintainer. This label is removed when a maintainer reviews and responds to the issue.                                                                                                                        |
| `bug`              | This issue represents a defect or regression from the behavior that's documented, or that you reasonably expect                                                                                                                                                        |
| `enhancement`      | This issue represents net-new functionality, including an extension of an existing capability                                                                                                                                                                          |
| `good_first_issue` | This issue does not require deep knowledge of the codebase to implement. This issue is appropriate for a first-time contributor.                                                                                                                                       |
| `help_wanted`      | This issue is trickier than a "good first issue." The required changes are scattered across the codebase, or more difficult to test. The maintainers are happy to help an experienced community contributor; they aren't planning to prioritize this issue themselves. |
| `duplicate`        | This issue is functionally identical to another open issue. The maintainers will close this issue and encourage community members to focus conversation on the other one.                                                                                              |
| `stale`            | This is an old issue which has not recently been updated. In repositories with a lot of activity, stale issues will periodically be closed.                                                                                                                            |
| `wontfix`          | This issue does not require a code change in the repository, or the maintainers are unwilling to merge a change which implements the proposed behavior.                                                                                                                |

## Pull requests

PRs are your surest way to make the change you want to see in dbt / packages / docs, especially when the change is straightforward.

**Every PR should be associated with an issue.** Why? Before you spend a lot of time working on a contribution, we want to make sure that your proposal will be accepted. You should open an issue first, describing your desired outcome and outlining your planned change. If you've found an older issue that's already open, comment on it with an outline for your planned implementation. Exception to this rule: If you're just opening a PR for a cosmetic fix, such as a typo in documentation, an issue isn't needed.

**PRs should include robust testing.** With the goal to substantially cut down the number and impact of regressions, we are taking a more meticulous approach to the tests that we require to merge a pull request. We recognize that robust testing can often take significantly more effort than the main portion of the code. Thank you for your help in contributing to this goal!

**Our goal is to review most new PRs within 7 days.** The first review will include some high-level comments about the implementation, including (at a high level) whether it’s something we think suitable to merge. Depending on the scope of the PR, the first review may include line-level code suggestions, or we may delay specific code review until the PR is more finalized / until we have more time.

**Automation that can help us:** Many repositories have a template for pull request descriptions, which will include a checklist that must be completed before the PR can be merged. You don’t have to do all of these things to get an initial PR, but they definitely help. Those many include things like:

- **Tests!** When you open a PR, some tests and code checks will run. (For security reasons, some may need to be approved by a maintainer.) We will not merge any PRs with failing tests. If you’re not sure why a test is failing, please say so, and we’ll do our best to get to the bottom of it together.
- **Contributor License Agreement** (CLA): This ensures that we can merge your code, without worrying about unexpected implications for the copyright or license of open source dbt software. For more details, read: ["Contributor License Agreements"](../resources/contributor-license-agreements.md)
- **Changelog:** In projects that include a number of changes in each release, we need a reliable way to signal what's been included. The mechanism for this will vary by repository, so keep an eye out for notes about how to update the changelog.

**If my PR is lingering...?** This happens, despite our best efforts—we promise it’s not intentional! If it’s been more than two weeks, we’d encourage you to leave a comment tagging `@dbt-labs/oss-maintainers`. reminding us that you’re awaiting review. For best results, say what in particular you’d like feedback on, and explain what would it mean to you to have the change merged in.
