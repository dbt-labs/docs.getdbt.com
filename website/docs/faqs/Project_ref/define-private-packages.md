---
title: Can I define private packages in the dependencies.yml file?
sidebar_label: Define private packages
id: define-private-packages
description: Learn how to define private packages in your project
---

It depends on how you're accessing your private packages:

- If you're using [native private packages](/docs/build/packages#native-private-packages), you can define them in the `dependencies.yml` file.
- If you're using the [git token method](/docs/build/packages#git-token-method), use `packages.yml` on <Constant name="core" />. <Constant name="core" /> does not render Jinja in `dependencies.yml`. The <Constant name="fusion_engine" /> supports Jinja in `dependencies.yml`, but prefer `packages.yml` if the project must also run on <Constant name="core" />. Refer to [Jinja support by file type](/reference/jinja-file-support).
