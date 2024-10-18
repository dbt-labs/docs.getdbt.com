---
title: "Git commit signing"
description: "Learn how to sign your Git commits when using the IDE for development."
---

# Git commit signing <Lifecycle status="Enterprise" />

To improve identity protection/impersonation and enhance security, you can sign your Git commits when pushing them to the repository. Using your signature, a Git provider can cryptographically verify it and mark the commit as "verified", giving people increased confidence about the origin of the commit. 

You can configure dbt Cloud to sign your Git commits when using the IDE for development. To set up, enable the feature in dbt Cloud, generate a GPG keypair, and upload the public key to your Git provider to use for signature verification.  


## Prerequisites 

- GitHub or GitLab is your Git provider. Currently, Azure DevOps is not supported.
- You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).

## Generate GPG keypair in dbt Cloud



<Lightbox src="/img/docs/dbt-cloud/example-git-signed-commits-setting.png" title="Example of profile setting Signed commits" />


## Upload public key to Git provider 

- GitHub instructions: https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account
- GitLab instructions: https://docs.gitlab.com/ee/user/project/repository/signed_commits/gpg.html


## Considerations

- The keypair is not tied to any specific account. It exists at the user level. There is a 1:1 relationship between the user and keypair. The same key will be used for signing commits on any accounts the user is a member of.
- In order for your Git commits to be marked as "verified", your dbt Cloud email address must be a verified email address with your Git provider.
