---
title: "Understanding dbt Core Versions"
id: "core-versions"
---

See also:
- [Installing dbt Core](dbt-cli/install/overview)
- [require-dbt-version](require-dbt-version) + [dbt_version](dbt_version)
- In dbt Cloud: [choosing](cloud-choosing-a-dbt-version) and [upgrading](cloud-upgrading-dbt-versions) dbt Core versions

### Semantic versioning

dbt Core is released in versions, according to [semantic versioning](https://semver.org/). There are three types of version releases:

- **Minor versions**, also called "feature releases," include a mix of net-new features and changes to existing capabilities that are backwards-compatible with previous minor versions. They will not break code in your project that relies on documented functionality.
- **Patch versions**, also called "maintenance releases," include fixes _only_. These fixes could be improvements to new features, needed to restore previous behavior (from unintended regressions), or critical for security/installation. We are judicious about which fixes are included in patch releases, to minimize the surface area of changes.

To date, dbt Core has had one **major version** release: v1.0.0. In the future, when v2.0.0 is released, it will introduce new features and break backwards compatibility for functionality that has been deprecated.

### Expectations

**Upgrading to patches:** We expect users to upgrade to patches as soon as they're available. When we refer to a "minor version" of dbt Core, such as v1.0 or v1.0.x, we are always referring to _the latest patch release of that version_. We highly encourage you to structure your development and production environments such that you can always install the latest patch.

**Upgrading minor versions:** While we do not expect users to immediately upgrade to minor versions as soon as they're available, there will always be features and some fixes that are only available for users of the latest minor version.

Note that, for **adapter versions**, dbt-core and adapter plugins coordinate minor releases. Patch version numbers may differ, and will be released independently. As such, you may find you're using `dbt-core==1.0.1` with `dbt-snowflake==1.0.0` — that's ok! You should always install and use the latest available patch for all `dbt-*` software.

**Trying prereleases:** All dbt Core versions are available as _prereleases_ before the final release. "Release candidates" are available for testing, in production-like environments, two weeks before the final release. For minor versions, we also aim to release one or more "betas," which include new features and invite community feedback, 4+ weeks before the final release. It is in your interest to help us test prereleases—we need your help!

### Timeline + support

_Prior to v1.0_

- We are no longer releasing new patches for minor versions prior to v1.0
- As of June 30, 2022, dbt Cloud will remove support for dbt Core versions older than v1.0

_Starting with v1.0_

**Past versions:** Minor versions will be supported for one year (12 months) from the date of their initial release. _This is a definite commitment._ Ongoing support includes:
- **Ongoing patches:** We will continue to release new patch versions that include fixes. When a newer minor version is available, we will end Active Support; subsequent patches will be limited to critical fixes related to security and installation. After End of Support, no new patches will be released.
- **Availability in dbt Cloud:** While a minor version is officially supported, you can continue to use it in dbt Cloud. We will notify you as its End of Support is approaching. On the day it reaches End of Support, we will upgrade you to the subsequent minor version.

**Future versions:** We aim to release a new minor "feature" every 3 months. _This is an indicative timeline ONLY._ For the latest information about upcoming releases, including their planned release dates and which features and fixes might be included in each, see [the GitHub milestones in the dbt-core repository](https://github.com/dbt-labs/dbt-core/milestones).

| dbt Core   | Initial Release | End of Support  | Active Support Until | Latest Patch         |
|------------|-----------------|-----------------|----------------------|----------------------|
| 1.0.x      | 2021-12-03      | 2022-12-03      | 1.1.0 release        | 1.0.1                |
| _1.1.x_    | _2022-04_       | _2023-04_       | _1.2.0 release_      |                      |
| _1.2.x_    | _2022-07_       | _2023-07_       | _1.3.0 release_      |                      |
| _1.3.x_    | _2022-10_       | _2023-10_       | _1.4.0 release_      |                      |

_Italics: indicative only_
