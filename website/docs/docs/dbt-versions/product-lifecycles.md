---
title: "dbt Product lifecycles"
id: "product-lifecycles"
description: "Learn about dbt Labs' product lifecycles."
---

dbt Labs is directly involved with the maintenance of two products: 

- dbt Core: The [open-source](https://github.com/dbt-labs/dbt-core) software that’s freely available 
- dbt Cloud: The managed [SaaS solution](https://www.getdbt.com/signup) built on top of dbt Core

All dbt features fall into a lifecycle category determined by their availablibilty in the following products:

### dbt Cloud

dbt Cloud features all fall into one of the following categories:

- **Beta:** Beta features are still in development and are only available to select customers. To join a beta, there might be a signup form or dbt Labs may contact specific customers about testing. Some features can be activated by enabling [experimental features](/docs/dbt-versions/experimental-features) in your account. Beta features are incomplete and might not be entirely stable; they should be used at the customer’s risk, as breaking changes could occur. Beta features might not be fully documented, technical support is limited, and service level objectives (SLOs) might not be provided. Download the [Beta Features Terms and Conditions](/assets/beta-tc.pdf) for more details.
- **Preview:**  Preview features are stable and considered functionally ready for production deployments. Some planned additions and modifications to feature behaviors could occur before they become generally available. New functionality that is not backward compatible could also be introduced. Preview features include documentation, technical support, and service level objectives (SLOs). Features in preview are provided at no extra cost, although they might become paid features when they become generally available.
- **Generally available (GA):** Generally available features provide stable features introduced to all qualified dbt Cloud accounts. Service level agreements (SLAs) apply to GA features, including documentation and technical support. Certain GA feature availability is determined by the dbt version of the environment. To always receive the latest GA features, ensure your dbt Cloud [environments](/docs/dbt-cloud-environments) are on a supported [Release Track](/docs/dbt-versions/cloud-release-tracks).
- **Deprecated:** Features in this state are no longer being developed or enhanced by dbt Labs. They will continue functioning as-is, and their documentation will persist until their removal date. However, they are no longer subject to technical support. 
- **Removed:** Removed features are no longer available on the platform in any capacity.

### dbt Core

We release dbt Core in the following lifecycle states. Core releases follow semantic versioning, which you can read more about in [About Core versions](/docs/dbt-versions/core).
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
 - **Undocumented:** These are subsets of dbt Core functionality that are internal, not contracted, or intentionally left undocumented. Do not consider
    this functionality part of that release’s product surface area.
 - **Deprecated:** Features in this state are not actively worked on or enhanced by dbt Labs and will continue to function as-is until their removal date. 
 - **Removed:** Removed features no longer have any level of product functionality or platform support.


