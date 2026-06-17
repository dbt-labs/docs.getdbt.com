---
title: "Configuring public IP restrictions"
id: ip-restrictions
description: "Restrict public access to the dbt platform by allowing only specific IP addresses."
sidebar_label: "Public IP restrictions"
pagination_next: "docs/platform/secure/private-connectivity/private-connectivity"
pagination_prev: null
---

# Configuring public IP restrictions <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

IP restrictions help control which IP addresses can connect to <Constant name="dbt" />. They allow <Constant name="dbt" /> customers to meet security and compliance controls by only allowing approved IPs to connect to their <Constant name="dbt" /> environment. This feature is supported in all regions across NA, Europe, and Asia-Pacific, but contact us if you have questions about availability.

## Configuring IP restrictions

To configure IP restrictions, go to **Account Settings** → **IP Restrictions**. IP restrictions provide two methods for determining which IPs can access <Constant name="dbt" />: an allowlist and a blocklist. IPs in the allowlist can access <Constant name="dbt" />, and IPs in the blocklist are blocked from accessing <Constant name="dbt" />. You can use IP restrictions for a range of use cases, including:

- Allow only corporate VPN traffic and deny all other traffic
- Deny IPs flagged by the security team
- Allow only VPN traffic but make an exception for contractors' IP addresses

IP restrictions block all service tokens, user requests made through the API (using personal user tokens), and the UI if they come from blocked IP addresses.

For any version control system integrations (GitHub, GitLab, ADO, and others) inbound into <Constant name="dbt" />, ensure you add their IP addresses to the allowed list.

### Allowing IPs

To add an IP to the allowlist, from the **IP Restrictions** page:

1. Click **Edit**.
2. Click **Add Rule**.
3. Add a name and description for the rule.
   - For example, Corporate VPN CIDR Range
4. Select **Allow**.
5. Add the ranges in CIDR notation.
   - For example, 1.1.1.1/8
   - You can add multiple ranges in the same rule.
6. Click **Save**.

Add multiple IP ranges by clicking the **Add IP range** button to create a new text field.

Simply adding the IP ranges does not enforce IP restrictions. For more information, refer to the [Enabling restrictions](#enabling-restrictions) section.

If you only want to allow the IP ranges added to this list and deny all other requests, you don't need to add a blocklist. By default, if you only add an allowlist, <Constant name="dbt" /> only allows IPs in the allowable range and denies all other IPs. However, you can add a blocklist if you want to deny specific IP addresses within your allowlist CIDR range.

### Blocking IPs (deny)

If you have IPs defined in the allowlist that need to be denied, you can add those IP ranges to the blocklist:

1. Click **Edit**.
2. Click **Add Rule**.
3. Add a name and description for the rule.
   - For example, "Corporate VPN Deny Range"
4. Select **Deny**.
5. Add the ranges or individual IP addresses in CIDR notation.
6. Click **Save**.

:::note Duplicate IP addresses

If identical IP addresses are in both the allow and block configurations, the second entry fails to save.

You can put an IP range on one list and then a sub-range or IP address that is part of it on the other. Using USA (range) and NY (sub-range) as an example, the expected behavior is:
- USA is on blocklist and NY is on allowlist &mdash; Traffic from the USA is blocked, but IPs from NY are allowed.
- USA is on the allowlist and NY is on the blocklist &mdash; USA traffic is allowed, but IPs from NY are blocked.

:::

## Enabling restrictions

Once you finish adding all your ranges, you can enable IP restrictions by selecting **Enable IP restrictions** and clicking **Save**. If your IP address is in any of the blocklist ranges, you can't save or enable IP restrictions &mdash; this prevents accidental account lockouts. If you get locked out due to IP changes on your end, reach out to support@getdbt.com.

Once enabled, when someone attempts to access <Constant name="dbt" /> from a restricted IP, they encounter one of the following messages depending on whether they use email and password or SSO login:

- For email logins: "Access denied! Please contact your admin for more details."
- For SSO logins: "Access denied! Please contact your admin for more details." on a dbt login page
