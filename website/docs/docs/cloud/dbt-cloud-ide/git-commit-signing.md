---
title: "Git commit signing"
description: "Learn how to sign your Git commits when using the IDE for development."
sidebar_label: Git commit signing
---

# Git commit signing <Lifecycle status="managed,managed_plus" />

To prevent impersonation and enhance security, you can sign your <Constant name="git" /> commits before pushing them to your repository. Using your signature, a <Constant name="git" /> provider can cryptographically verify a commit and mark it as "verified", providing increased confidence about its origin.

You can configure <Constant name="cloud" /> to sign your <Constant name="git" /> commits when using the <Constant name="cloud_ide" /> for development. To set up, enable the feature in <Constant name="cloud" />, follow the flow to generate a keypair, and upload the public key to your <Constant name="git" /> provider to use for signature verification.  


## Prerequisites 

- GitHub or GitLab is your <Constant name="git" /> provider. Currently, Azure DevOps is not supported.
- You have a <Constant name="cloud" /> account on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing/).

## Generate GPG keypair in dbt

To generate a GPG keypair in <Constant name="cloud" />, follow these steps:
1. Go to your **Personal profile** page in <Constant name="cloud" />.
2. Navigate to **Signed Commits** section.
3. Enable the **Sign commits originating from this user** toggle.
4. This will generate a GPG keypair. The private key will be used to sign all future <Constant name="git" /> commits. The public key will be displayed, allowing you to upload it to your <Constant name="git" /> provider.

<Lightbox src="/img/docs/dbt-cloud/example-git-signed-commits-setting.png" width="95%" title="Example of profile setting Signed commits" />

## Upload public key to Git provider 

To upload the public key to your <Constant name="git" /> provider, follow the detailed documentation provided by the supported <Constant name="git" /> provider:

- [GitHub instructions](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) 
- [GitLab instructions](https://docs.gitlab.com/ee/user/project/repository/signed_commits/gpg.html) 

Once you have uploaded the public key to your <Constant name="git" /> provider, your <Constant name="git" /> commits will be marked as "Verified" after you push the changes to the repository.

<Lightbox src="/img/docs/dbt-cloud/git-sign-verified.png" width="95%" title="Example of a verified Git commit in a Git provider." />

## Considerations

- The GPG keypair is tied to the user, not a specific account. There is a 1:1 relationship between the user and keypair. The same key will be used for signing commits on any accounts the user is a member of.
- The GPG keypair generated in <Constant name="cloud" /> is linked to the email address associated with your account at the time of keypair creation. This email identifies the author of signed commits.
- For your <Constant name="git" /> commits to be marked as "verified", your <Constant name="cloud" /> email address must be a verified email address with your <Constant name="git" /> provider. The <Constant name="git" /> provider (such as, GitHub, GitLab) checks that the commit's signed email matches a verified email in your <Constant name="git" /> provider account. If they don’t match, the commit won't be marked as "verified."
- Keep your <Constant name="cloud" /> email and <Constant name="git" /> provider's verified email in sync to avoid verification issues. If you change your <Constant name="cloud" /> email address:
  - Generate a new GPG keypair with the updated email, following the [steps mentioned earlier](/docs/cloud/dbt-cloud-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
  - Add and verify the new email in your <Constant name="git" /> provider.

<!-- vale off -->

## FAQs

<!-- vale on -->

<DetailsToggle alt_header="What happens if I delete my GPG keypair in dbt?">

If you delete your GPG keypair in <Constant name="cloud" />, your Git commits will no longer be signed. You can generate a new GPG keypair by following the [steps mentioned earlier](/docs/cloud/dbt-cloud-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
</DetailsToggle>

<DetailsToggle alt_header="What Git providers support GPG keys?">

GitHub and GitLab support commit signing, while Azure DevOps does not. Commit signing is a [git feature](https://git-scm.com/book/ms/v2/Git-Tools-Signing-Your-Work), and is independent of any specific provider. However, not all providers support the upload of public keys, or the display of verification badges on commits.

</DetailsToggle>

<DetailsToggle alt_header="What if my Git provider doesn't support GPG keys?">

If your Git Provider does not explicitly support the uploading of public GPG keys, then
commits will still be signed using the private key, but no verification information will
be displayed by the provider.

</DetailsToggle>

<DetailsToggle alt_header="What if my Git provider requires that all commits are signed?">

If your Git provider is configured to enforce commit verification, then unsigned commits
will be rejected. To avoid this, ensure that you have followed all previous steps to generate
a keypair, and uploaded the public key to the provider.

</DetailsToggle>
