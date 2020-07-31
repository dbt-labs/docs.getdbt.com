## Description & motivation
<!---
Describe your changes, and why you're making them. Is this linked to an open
issue, a Trello card, or another pull request? Link it here.
-->

## To-do before merge
<!---
(Optional -- remove this section if not needed)
Include any notes about things that need to happen before this PR is merged, e.g.:
- [ ] Change the base branch
- [ ] Ensure PR #56 is merged
-->

## Pre-release docs
Is this change related to an unreleased version of dbt?
- [ ] Yes
- [ ] No (if you're not sure, it's probably "No")

If yes, please:
- Change the base branch of this PR to `next`
- Add Changelog components
    - if new: `<Changelog>New in v0.x.0</Changelog>`
    - if changed: `<Changelog>Changed in v0.x.0: In prior versions, ...</Changelog>`
- Add links to the "New and changed documentation" section of the latest [Migration Guide](../website/docs/docs/guides/migration-guide)
