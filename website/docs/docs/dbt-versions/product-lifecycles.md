---
title: "dbt Product lifecycles"
id: "product-lifecycles"
description: "Learn about dbt Labs' product lifecycles."
---

dbt Labs is directly involved with the maintenance of three products: 

- <Constant name="core" />: The [open-source](https://github.com/dbt-labs/dbt-core) software that’s freely available.
- <Constant name="dbt_platform" />: The cloud-based [SaaS solution](https://www.getdbt.com/signup), originally built on top of <Constant name="core" />. We're now introducing dbt's new engine, the <Constant name="fusion_engine" />. For more information, refer to [About the dbt Fusion engine](/docs/fusion/about-fusion).
- <Constant name="fusion_engine" />: The next-generation dbt engine, substantially faster than  <Constant name="core" /> and has built in SQL comprehension technology to power the next generation of analytics engineering workflows. The <Constant name="fusion_engine" /> is designed to deliver data teams a lightning-fast development experience, intelligent cost savings, and improved governance.

All dbt features fall into a lifecycle category determined by their availability in the following products:

### The dbt platform

<Constant name="cloud" /> features all fall into one of the following categories:

- **Beta:** Beta features are in development and might not be entirely stable; they should be used at the customer’s risk, as breaking changes could occur. Beta features might not be fully documented, technical support is limited, and service level objectives (SLOs) might not be provided. Download the [Beta Features Terms and Conditions](/assets/beta-tc.pdf) for more details. If a beta feature is marked `Private`, it must be enabled by dbt Labs, and access is not self-service. If documentation is available, it will include instructions for requesting access.
- **Preview:**  Preview features are stable and considered functionally ready for production deployments. Some planned additions and modifications to feature behaviors could occur before they become generally available. New functionality that is not backward compatible could also be introduced. Preview features include documentation, technical support, and service level objectives (SLOs). Features in preview are provided at no extra cost, although they might become paid features when they become generally available. If a preview feature is marked `Private`, it must be enabled by dbt Labs, and access is not self-service. Refer to the feature documentation for instructions on requesting access.
- **Generally available (GA):** Generally available features provide stable features introduced to all qualified <Constant name="cloud" /> accounts. Service level agreements (SLAs) apply to GA features, including documentation and technical support. Certain GA feature availability is determined by the dbt version of the environment. To always receive the latest GA features, ensure your <Constant name="cloud" /> [environments](/docs/dbt-cloud-environments) are on a supported [Release Track](/docs/dbt-versions/cloud-release-tracks).
- **Deprecated:** Features in this state are no longer being developed or enhanced by dbt Labs. They will continue functioning as-is, and their documentation will persist until their removal date. However, they are no longer subject to technical support. 
- **Removed:** Removed features are no longer available on the platform in any capacity.

### dbt Core

We release <Constant name="core" /> in the following lifecycle states. Core releases follow semantic versioning, which you can read more about in [About Core versions](/docs/dbt-versions/core).
- **Unreleased:** We will include this functionality in the next minor version prerelease. However, we make no commitments about its behavior or implementation. As maintainers, we reserve the right to change any part of it, or remove it entirely (with an accompanying explanation.)

- **Prerelease:**
    * **Beta:** The purpose of betas is to provide a first glimpse of the net-new features that will be arriving in this minor version, when it has its
    final release. The code included in beta should work, without regression from existing functionality, or negative interactions with other released
    features. Net-new features included in a beta _may be_ incomplete or have known edge cases/limitations. Changes included in beta are not “locked,”
    and the maintainers reserve the right to change or remove (with an explanation).
    * **Release Candidate:** The purpose of a release candidate is to offer a 2-week window for more extensive production-level testing, with the goal of
    catching regressions before they go live in a final release. Users can believe that features in a Release Candidate will work the same on release day.
    However, if we do find a significant bug, we do still reserve the right to change or remove the underlying behavior, with a clear explanation. 
 - **Released:** Ready for use in production.
 - **Experimental:** Features we release for general availability, which we believe are usable in their current form, but for which we may document
    additional caveats. 
 - **Undocumented:** These are subsets of <Constant name="core" /> functionality that are internal, not contracted, or intentionally left undocumented. Do not consider
    this functionality part of that release’s product surface area.
 - **Deprecated:** Features in this state are not actively worked on or enhanced by dbt Labs and will continue to function as-is until their removal date. 
 - **Removed:** Removed features no longer have any level of product functionality or platform support.

### dbt Fusion engine

The <Constant name="fusion_engine" /> and [VS Code extension](/docs/about-dbt-extension) are currently in preview for local installations and beta in <Constant name="cloud" />.

- **Beta:** Beta features are still in development and are only available to select customers. Beta features are incomplete and might not be entirely stable; they should be used at the customer’s risk, as breaking changes could occur. Beta features might not be fully documented, technical support is limited, and service level objectives (SLOs) might not be provided. Download the [Beta Features Terms and Conditions](/assets/beta-tc.pdf) for more details.
- **Preview:** Preview features are stable and considered functionally ready for production deployments that are using supported features and do not depend on deprecated functionality. For more about the status of features and functionality, the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) contain the most recent updates.
- **Path to Generally available (GA):** Learn what's required for the dbt Fusion engine to reach GA in our [Path to GA](/blog/dbt-fusion-engine-path-to-ga) blog post.
