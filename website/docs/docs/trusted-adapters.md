---
title: "Trusted adapters"
id: "trusted-adapters"
hide_table_of_contents: true
---

Trusted adapters are adapters not maintained by dbt Labs, that we feel comfortable recommending to users for use in production.

Free and open-source tools for the data professional are increasingly abundant. This is by-and-large a *good thing*, however it requires due diligence that wasn't required in a paid-license, closed-source software world. As a user, there are questions to answer important before taking a dependency on an open-source project. The trusted adapter designation is meant to streamline this process for end users.

<details><summary>Considerations for depending on an open-source project</summary>

1. Does it work?
2. Does anyone "own" the code, or is anyone liable for ensuring it works?
3. Do bugs get fixed quickly?
4. Does it stay up-to-date with new Core features?
5. Is the usage substantial enough to self-sustain?
pendency on this library?

</details>

### Trusted adapter specifications

Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide for more information, particularly if you are an adapter maintainer considering having your adapter be added to the trusted list.

### Trusted vs Verified

The Verification program exists to highlight adapters that meets both of the following criteria:

- the guidelines given in the Trusted program,
- formal agreements required for integration with dbt Cloud

For more information on the Verified Adapter program, reach out the [dbt Labs partnerships team](mailto:partnerships@dbtlabs.com)

### Trusted adapters

The following are **Trusted adapters** ✓ you can connect to in dbt Core:

import AdaptersTrusted from '/snippets/_adapters-trusted.md';

<AdaptersTrusted />
