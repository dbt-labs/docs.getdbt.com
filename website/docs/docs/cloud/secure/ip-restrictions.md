---
title: "Configuring IP restrictions"
id: ip-restrictions
description: "Configuring IP restrictions to outside traffic from accessing your dbt Cloud environment"
sidebar_label: "IP restrictions"
---

import SetUpPages from '/snippets/_available-tiers-iprestrictions.md';

<SetUpPages features={'/snippets/_available-tiers-iprestrictions.md'}/>

IP Restrictions help control which IP addresses are allowed to connect to dbt Cloud. IP restrictions allow dbt Cloud customers to meet security and compliance controls by only allowing approved IPs to connect to their dbt Cloud environment. This feature is supported in all regions across NA, Europe, and Asia-Pacific, but contact us if you have questions about availability.

## Configuring IP Restrictions

To configure IP restrictions, go to **Account Settings** → **IP Restrictions**. IP restrictions provide two methods for determining which IPs can access dbt Cloud: an allowlist and a blocklist. IPs in the allowlist are allowed to access dbt Cloud, and IPs in the deny list will be blocked from accessing dbt Cloud. IP Restrictions can be used for a range of use cases, including:

- Only allowing corporate VPN traffic and deny all other traffic
- Deny IPs flagged by the Security team
- Allow only VPN traffic but make an exception for contractors’ IP addresses

IP restrictions will block all service tokens, user requests done via the API (via personal user token), and the UI, if they are coming from blocked IP addresses.

For any version control system integrations inbound into dbt Cloud, ensure their IP addresses are added to the allowed list. Examples: Gitlab, ADO and Github.

### Allowing IPs

To add an IP to the allowlist, from the **IP Restrictions** page:

1.  Click **edit**
2. Click **Add Rule**
3. Add name and description for the rule
    - For example, Corporate VPN CIDR Range
4. Select **Allow**
5. Add the ranges in the CIDR notation
	- For example, 1.1.1.1/8
	- You can add multiple ranges followed by commas
6. Click **Save**

Note that simply adding the IP Ranges will not enforce IP restrictions. For more information, see the section “Enabling Restrictions.”

If you only want to allow the IP ranges added to this list and deny all other requests, adding a denylist is not necessary. By default, if only an allow list is added, dbt Cloud will only allow IPs in the allowable range and deny all other IPs. However, you can add a denylist if you want to deny specific IP addresses within your allowlist CIDR range.

### Blocking IPs (deny)

If you have an IP(s) defined in the allowlist that needs to be denied, you can add those IP ranges to the denylist by doing the following:

1. Click **Edit**
2. Click **Add Rule**
3. Add name and description for the rule
	- For example, "Corporate VPN Deny Range"
4. Select **Deny**
5. Add the ranges or the individual IP addresses in CIDR notation
6. Click **Save**

:::note Duplicate IP addresses

If identical IP addresses are in both the allow and block configurations, whichever is entered second will fail to save.

It is possible to put an IP range on one list and then a sub-range or IP address that is part of it on the other. Using USA (Range) and NY(sub-range) as an example, the expected behavior is:
- USA is on denylist and NY in allowlist - Traffic from the USA will be blocked, but IPs from NY will be allowed.
- USA is on the allowlist, and NY is on the denylist - USA traffic will be allowed, but IPs from NY will be blocked.

:::

## Enabling Restrictions

Once you are done adding all your ranges, IP restrictions can be enabled by selecting the **Enable IP restrictions** button and clicking **Save**. If your IP address is in any of the denylist ranges, you won’t be able to save or enable IP restrictions - this is done to prevent accidental account lockouts. If you do get locked out due to IP changes on your end, please reach out to support@dbtlabs.com

Once enabled, when someone attempts to access dbt Cloud from a restricted IP, they will encounter one of the following messages depending on whether they use email & password or SSO login. 

<Lightbox src="/img/docs/dbt-cloud/ip-restricted-email.png" title="IP restricted access denied message for email logins"/>

<Lightbox src="/img/docs/dbt-cloud/ip-restricted-sso.png" title="IP restricted access denied message for SSO logins"/>
