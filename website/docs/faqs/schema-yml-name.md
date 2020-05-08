---
title: Does my `.yml` file containing tests and descriptions need to be named `schema.yml`?
---
No! You can name this file whatever you want (including `whatever_you_want.yml`), so long as:
* The file is in your `models/` directory¹
* The file has `.yml` extension

Check out the [docs](declaring-properties) for more information.

¹If you're declaring properties for seeds, snapshots, or macros, you can also place this file in the related directory — `data/`, `snapshots/` and `macros/` respectively.
