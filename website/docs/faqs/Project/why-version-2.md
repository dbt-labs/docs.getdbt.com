---
title: "Why do model and source yml files always start with `version: 2`?"
description: ".yml file structure more extensible with version 2."
sidebar_label: 'Why does yml file start with version 2'
id: why-version-2

---

Once upon a time, the structure of these `.yml` files was very different (s/o to anyone who was using dbt back then!). Adding `version: 2` allowed us to make this structure more extensible.

Currently, Version 2 is the only supported version for these files. We kept `version:` around as a required key so that in the future, if we need to introduce a new structure for these files, we'll be able to do this more easily.
