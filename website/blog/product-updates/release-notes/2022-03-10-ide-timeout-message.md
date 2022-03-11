---
title: "Spotty internet issues no longer cause a session time out message"
description: "We fixed an issue where a spotty internet connection could cause the “IDE session timed out” message to appear unexpectedly. People using a VPN were most likely to see this issue."
slug: 2022-03-10-ide-timeout-message

tags: [release notes]
hide_table_of_contents: false

date: 2022-03-10
is_featured: true
---


We fixed an issue where a spotty internet connection could cause the “IDE session timed out” message to appear unexpectedly. People using a VPN were most likely to see this issue.

We updated the health check logic so it now excludes client-side connectivity issues from the IDE session check. If you lose your internet connection, we no longer update the health-check state. Now, losing internet connectivity will no longer cause this unexpected message.

<LoomVideo id="fdb03d5192ee465ebdde08a9b53c15bd" />
