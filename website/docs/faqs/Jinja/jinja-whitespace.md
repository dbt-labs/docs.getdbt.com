---
title: My compiled SQL has a lot of spaces and new lines, how can I get rid of it?
description: "Managing whitespace control"
sidebar_label: 'Compiled sql has a lot of white space'
id: jinja-whitespace
---

This is known as "whitespace control".

Use a minus sign (`-`, e.g. `{{- ... -}}`, `{%- ... %}`, `{#- ... -#}`) at the start or end of a block to strip whitespace before or after the block (more docs [here](https://jinja.palletsprojects.com/page/templates/#whitespace-control)). Check out the [tutorial on using Jinja](/guides/using-jinja#use-whitespace-control-to-tidy-up-compiled-code) for an example.

Take caution: it's easy to fall down a rabbit hole when it comes to whitespace control!
