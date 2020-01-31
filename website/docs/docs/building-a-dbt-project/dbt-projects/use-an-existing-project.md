---
title: "Use an existing project"
id: "use-an-existing-project"
---

This guide assumes your organization already has a dbt project hosted on GitHub / GitLab / BitBucket / etc. If you're not sure if your project is already hosted on one of these services, or if you don't have access to the repository, you should check with your account administrator.

## Using git CLI

If you're using the git CLI, you'll need to set up git authentication. GitHub has [an excellent overview of how this works](https://help.github.com/articles/connecting-to-github-with-ssh/), and a [simple guide on how to quickly get set up](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Once you've set up your SSH keys for git, you can make a clone of your dbt project with:

```bash
git clone git@github.com:your-organization/your-dbt-project.git
```