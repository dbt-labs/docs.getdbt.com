---
title: "Documentation"
id: "documentation"
---

## Overview

Good documentation for your dbt models will help downstream consumers discover and understand the datasets which you curate for them. In the [schema.yml](declaring-properties) section of this guide, a simple paradigm for documenting models and columns was shown. Namely, a model or column can be described by providing a string in the `description` field of a schema.yml file. For reference, that might look something like this:

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: events
    description: This table contains clickstream events from the marketing website

    columns:
        - name: event_id
          description: This is a unique identifier for the event
          tests:
              - unique
              - not_null

        - name: user-id
          quote: true
          description: The user who performed the event
          tests:
              - not_null
```

</File>

This works well for simple one-line documentation strings, but it can be restrictive for complex models or columns which warrant whole paragraphs of discussion. For these more complicated documentation tasks, you can use a `docs block` in concert with the `{{ doc(...) }}` context function to write rich documentation for your models and columns.

## Docs Blocks
### Syntax
To declare a docs block, use the jinja `docs` tag. Docs blocks must be uniquely named, and can contain arbitrary markdown. In practice, a docs block might look like this:

<File name='events.md'>

```markdown
{% docs table_events %}

This table contains clickstream events from the marketing website.

The events in this table are recorded by [Snowplow](http://github.com/snowplow/snowplow) and piped into the warehouse on an hourly basis. The following pages of the marketing site are tracked:
 - /
 - /about
 - /team
 - /contact-us

{% enddocs %}
```

</File>

In the above example, a docs block named `table_events` is defined with some descriptive markdown contents. There is nothing significant about the name `table_events` -- docs blocks can be named however you like, as long as the name only contains alphanumeric and underscore characters.

### Placement
Docs blocks should be placed in files with a `.md` file extension. dbt will look for these files in the `source-paths` and `docs-paths` directories specified in your `dbt_project.yml` file. Typically, it makes sense to place these markdown files near the models they document. Many docs blocks can exist in a single `.md` file.

### Usage
To use a docs block, reference it from your schema.yml file with the [doc()](doc) function. Using the examples above, the `table_events` docs can be included in the `schema.yml` file as shown below:

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: events
    description: '{{ doc("table_events") }}'

    columns:
        - name: event_id
          description: This is a unique identifier for the event
          tests:
              - unique
              - not_null
```

</File>

In the resulting documentation, `'{{ doc("table_events") }}'` will be expanded to the markdown defined in the `table_events` docs block.
