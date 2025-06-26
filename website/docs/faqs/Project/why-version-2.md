---
title: "Why do model and source YAML files always start with `version: 2`?"
description: ".yml file structure more extensible with version 2."
sidebar_label: 'Why does YAML file start with version 2'
id: why-version-2

---

Once upon a time, the structure of these `.yml` files was very different (s/o to anyone who was using dbt back then!). Adding `version: 2` allowed us to make this structure more extensible.

Resource YAML files do not currently require this config. We only support `version: 2` if it's specified. Although we do not expect to update YAML files to `version: 3` soon, having this config will make it easier for us to introduce new structures in the future

