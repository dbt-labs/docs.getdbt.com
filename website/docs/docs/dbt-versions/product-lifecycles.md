---
title: "dbt Product lifecycles"
id: "product-lifecycles"
description: "Learn about dbt Labs' product lifecycles."
---

dbt Labs is directly involved with the maintenance of two products: the open-source dbt Core, and the managed SaaS solution built on top of it, dbt Cloud. 

Any given dbt feature will fall into one of the following lifecycle states:

**dbt Cloud**:

- **Beta**: Beta features may be made available for the purpose of customer testing and evaluation. These may not be feature-complete or fully stable. There may still be some planned additions and modifications to product behaviors while in Beta. Breaking changes may occur – although we will do our best to communicate them in advance, we may not always be able to do so. Beta features may not be fully documented, technical support may be limited, and service level objectives (SLOs) may not be provided.

- **Preview (may be Private or Public)**:  Preview releases are more feature complete and stable than Beta releases, and are ready for production consideration. There may still be some planned additions and modifications to product behaviors before moving to General Availability. Breaking changes may still occur  – although we will do our best to communicate them in advance, we may not always be able to do so. Preview features are documented, technical support is provided, and service level objectives (SLOs) apply. Features in Preview are generally provided at no additional cost, although they may become paid features in their Generally Available state. 

- **Generally Available**: Can be used for production-grade workloads. Generally Available features are fully documented, technical support is provided, and service level agreements (SLAs) apply.

- **Deprecated**: Features in this state are not actively being worked on or enhanced, and will continue to function as-is until their removal date.

- **Removed**: Removed features no longer have any level of product functionality or platform support.

**dbt Core**

- **Unreleased**: This functionality will be included in the next minor version prerelease. However, no commitments are made about its behavior or implementation. As maintainers, we reserve the right to modify any part of it, or remove it entirely (with an accompanying explanation.)

- **Prerelease**:
   * Beta: The purpose of betas is to provide a first glimpse of the net-new features that will be arriving in this minor version, when it has its final release. The code included in a beta should work, without regression from existing functionality, or negative interactions with other released features. Net-new features included in a beta MAY be incomplete or have known edge cases / limitations. Changes included in a beta are not “locked,” and the maintainers reserve the right to modify or remove (with explanation).
   * Release Candidate: The purpose of a release candidate is to offer a 2-week window for more extensive production-level testing, with the goal of catching regressions before they go live in a final release. Users can believe that features in a Release Candidate will work the same on release day. However, if we do find a significant bug, we do still reserve the right to modify or remove the underlying behavior, with a clear explanation. 

- **Released**: Ready for use in production.

- **Experimental**: Features that have been released for general availability, which we believe are usable in their current form, but for which we may document additional caveats. 

- **Undocumented**: These are subsets of dbt Core functionality that are internal, not contracted, or intentionally left undocumented. This functionality should not be considered part of that release’s product surface area. 

- **Deprecated**: Features in this state are not actively being worked on or enhanced, and will continue to function as-is until their removal date.

- **Removed**: Removed features no longer have any level of product functionality or platform support.

