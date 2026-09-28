---
datatype: [directorypath]
description: "Read this guide to understand the skill-paths configuration in dbt."
default_value: [skills]
---

<File name='dbt_project.yml'>

```yml
skill-paths: [directorypath]
```

</File>

## Definition

Optionally specify a custom list of directories where [agent skills](/docs/dbt-ai/package-skills) are located.

Every subdirectory containing a `SKILL.md` file is treated as one skill. dbt scans `skill-paths` in your root project and in each installed package when it installs packages.

## Default

By default, dbt looks for skills in a directory named `skills` in the root of your project.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="skill-paths"
absolute="/Users/username/project/skills"
/>

- ✅ **Do**
  - Use relative path:
    ```yml
    skill-paths: ["skills"]
    ```

- ❌ **Don't**
  - Avoid absolute paths:
    ```yml
    skill-paths: ["/Users/username/project/skills"]
    ```

## Examples

### Use a subdirectory named `agent-skills` for skills

<File name='dbt_project.yml'>

```yml
skill-paths: ["agent-skills"]
```

</File>

### Use more than one directory for skills

<File name='dbt_project.yml'>

```yml
skill-paths: ["skills", "team-skills"]
```

</File>
