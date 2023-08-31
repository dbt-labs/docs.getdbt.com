---
title: "Building a Trusted Adapter"
id: "8-building-a-trusted-adapter"
---

The Trusted adapter program exists to allow adapter maintainers to demonstrate to the dbt community that your adapter is trusted to be used in production.

## What does it mean to be trusted

By opting into the below, you agree to this, and we take you at your word. dbt Labs reserves the right to remove an adapter from the trusted adapter list at any time, should any of the below guidelines not be met.

### Feature Completeness

To be considered for the Trusted Adapter program, the adapter must cover the essential functionality of dbt Core given below, with best effort given to support the entire feature set.

Essential functionality includes (but is not limited to the following features):

- table, view, and seed materializations
- dbt tests

The adapter should have the required documentation for connecting and configuring the adapter. The dbt docs site should be the single source of truth for this information. These docs should be kept up-to-date.

See [Documenting a new adapter](/guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter) for more information.

### Release Cadence

Keeping an adapter up-to-date with dbt Core is an integral part of being a trusted adapter. Therefore, we ask that adapter maintainers:

- Release of new minor versions of the adapter with all tests passing within four weeks of dbt Core's release cut.
- Release of new major versions of the adapter with all tests passing within eight weeks of dbt Core's release cut.

### Community Responsiveness

On a best effort basis, active participation and engagement with the dbt Community across the following forums:

- Being responsive to feedback and supporting user enablement in dbt Community’s Slack workspace
- Responding with comments to issues raised in public dbt adapter code repository
- Merging in code contributions from community members as deemed appropriate

### Security Practices

Trusted adapters will not do any of the following:

- Output to logs or file either access credentials information to or data from the underlying data platform itself.
- Make API calls other than those expressly required for using dbt features (adapters may not add additional logging)
- Obfuscate code and/or functionality so as to avoid detection
- Use the Python runtime of dbt to execute arbitrary Python code
- Draw a dependency on dbt’s Python API beyond what is required for core data transformation functionality as described in the Essential and Extended feature tiers

Additionally, to avoid supply-chain attacks:

- Use an automated service to keep Python dependencies up-to-date (such as  Dependabot or similar),
- Publish directly to PyPI from the dbt adapter code repository by using trusted CI/CD process (such as GitHub actions)
- Restrict admin access to both the respective code (GitHub) and package (PyPI) repositories
- Identify and mitigate security vulnerabilities by use of a static code analyzing tool (such as Snyk) as part of a CI/CD process

### Other considerations

The adapter repository is:

- open-souce licensed,
- published to PyPI, and
- automatically tests the codebase against dbt Lab's provided adapter test suite

## How to get an adapter verified?

Open an issue on the [docs.getdbt.com GitHub repository](https://github.com/dbt-labs/docs.getdbt.com) using the "Add adapter to Trusted list" template. In addition to contact information, it will ask confirm that you agree to the following.

1. my adapter meet the guidelines given above
2. I will make best reasonable effort that this continues to be so
3. checkbox: I acknowledge that dbt Labs reserves the right to remove an adapter from the trusted adapter list at any time, should any of the above guidelines not be met.

The approval workflow is as follows:

1. create and populate the template-created issue
2. dbt Labs will respond as quickly as possible (maximally four weeks, though likely faster)
3. If approved, dbt Labs will create and merge a Pull request to formally add the adapter to the list.

## How to get help with my trusted adapter?

Ask your question in #adapter-ecosystem channel of the community Slack.
