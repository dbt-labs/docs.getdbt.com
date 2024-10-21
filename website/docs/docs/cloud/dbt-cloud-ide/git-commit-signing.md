---
title: "Git commit signing"
description: "Learn how to sign your Git commits when using the IDE for development."
sidebar_label: Git commit signing
---

# Git commit signing <Lifecycle status="Enterprise" />

To improve identity protection/impersonation and enhance security, you can sign your Git commits when pushing them to the repository. Using your signature, a Git provider can cryptographically verify it and mark the commit as "verified", giving people increased confidence about the origin of the commit. 

You can configure dbt Cloud to sign your Git commits when using the IDE for development. To set up, enable the feature in dbt Cloud, generate a GPG keypair, and upload the public key to your Git provider to use for signature verification.  


## Prerequisites 

- GitHub or GitLab is your Git provider. Currently, Azure DevOps is not supported.
- You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).

## Generate GPG keypair in dbt Cloud

To generate a GPG keypair in dbt Cloud, follow these steps:
1. Go to your **Personal profile** page in dbt Cloud.
2. Navigate to **Signed Commits** section.
3. Enable the **Sign commits originating from this user** toggle to generate a GPG key.
4. This will generate a GPG keypair and display the public key. You can copy the public key to upload it to your Git provider. Make sure to keep the private key secure.

<Lightbox src="/img/docs/dbt-cloud/example-git-signed-commits-setting.png" width="95%" title="Example of profile setting Signed commits" />

## Upload public key to Git provider 

To upload the public key to your Git provider, follow the detailed documentation provided by the supported Git provider:

- [GitHub instructions](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) 
- [GitLab instructions](https://docs.gitlab.com/ee/user/project/repository/signed_commits/gpg.html) 

Once you have uploaded the public key to your Git provider, your Git commits will be signed with the GPG keypair generated in dbt Cloud after you push the changes to the repository.

<Lightbox src="/img/docs/dbt-cloud/git-sign-verified.jpg" width="95%" title="Example of a verified Git commit in a Git provider." />

## Considerations

- The GPG keypair is tied to the user, not a specific account. There is a 1:1 relationship between the user and keypair. The same key will be used for signing commits on any accounts the user is a member of.
- The GPG key generated in dbt Cloud is linked to the email address associated with your account at the time of key creation. This email identifies the author of signed commits.
- For your Git commits to be marked as "verified", your dbt Cloud email address must be a verified email address with your Git provider. The Git provider (such as, GitHub, GitLab) checks that the commit's signed email matches a verified email in your Git provider account. If they don’t match, the commit won't be marked as "verified."
- Keep you dbt Cloud email and Git provider's verified email in sync to avoid verification issues. If you change your email address:
  - Generate a new GPG keypair with the updated email, following the [steps mentioned earlier](/docs/cloud/dbt-cloud-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
  - Or add and verify the new email in your Git provider.

<!-- vale off -->

## FAQs

<!-- vale on -->

<DetailsToggle alt_header="What happens if I delete my GPG keypair in dbt Cloud?">

If you delete your GPG keypair in dbt Cloud, your Git commits will no longer be signed. You can generate a new GPG keypair by following the [steps mentioned earlier](/docs/cloud/dbt-cloud-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
</DetailsToggle>

<DetailsToggle alt_header="What if my Git provider doesn't support GPG keys?">

Currently, GitHub or GitLab are supported Git providers for git commit signing (Azure DevOps is not supported). If your Git provider doesn't support GPG keys, you won't be able to sign your Git commits. You can still commit code to your repository, but the commits won't be marked as "verified".
</DetailsToggle>

