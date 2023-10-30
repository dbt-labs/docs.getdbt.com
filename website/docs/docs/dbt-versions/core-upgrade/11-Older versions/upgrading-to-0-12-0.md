---
title: "Upgrading to 0.12.0"
id: "upgrading-to-0-12-0"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

## End of support

Support for the `repositories:` block in `dbt_project.yml` (deprecated in 0.10.0) was removed.
In order to install packages in your dbt project, you must use [a `packages.yml` file](/docs/build/packages#how-do-i-add-a-package-to-my-project).
