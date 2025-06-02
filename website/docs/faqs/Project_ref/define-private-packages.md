---
title: Can I define private packages in the dependencies.yml file?
sidebar_label: Define private packages
id: define-private-packages
description: Learn how to define private packages in your project
---

It depends on how you're accessing your private packages:

- If you're using [native private packages](/docs/build/packages#native-private-packages), you can define them in the `dependencies.yml` file.
- If you're using the [git token method](/docs/build/packages#git-token-method), you must define them in the `packages.yml` file instead of the `dependencies.yml` file. This is because conditional rendering (like Jinja-in-yaml) is not supported in `dependencies.yml`.
