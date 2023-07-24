---
title: "dbt Product lifecycles"
id: "product-lifecycles"
description: "Learn about dbt Labs' product lifecycles."
---

dbt Labs is directly involved with the maintenance of two products: 

- dbt Core: The [open-source](https://github.com/dbt-labs/dbt-core) software that’s freely available 
- dbt Cloud: The managed [SaaS solution](https://www.getdbt.com/signup) built on top of dbt Core

Any dbt feature will fall into one of the following lifecycle states:


### dbt Cloud

- **Beta:** Beta features may be made available for the purpose of customer testing and evaluation. These might not be feature-complete or fully stable. There might still be some planned additions and modifications to product behaviors while in beta. Breaking changes could occur &mdash; although we will do our best to communicate them in advance, we might not always be able to do so. Beta features might not be fully documented, technical support might be limited, and service level objectives (SLOs) might not be provided. Download the [Beta Features Terms and Conditions](/assets/beta-tc.pdf) for more details.

- **Preview (Private or Public):**  Preview features are stable and can be considered for production deployments. There may still be some planned additions and modifications to product behaviors before moving to General Availability. We may also introduce new functionality to Preview features that is not backward compatible. Preview features include documentation, technical support, and include service level objectives (SLOs). Features in Preview are generally provided at no extra cost, although they may become paid features in their Generally Available state.

- **Generally Available(GA):** Generally Available features provide stable features that can be considered for production deployments. Service level agreements (SLAs) apply to GA features, and these features include documentation and technical support.

- **Deprecated:** Features in this state are not actively worked on or enhanced by dbt Labs and will continue to function as-is until their removal date. 

- **Removed:** Removed features no longer have any level of product functionality or platform support.

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


