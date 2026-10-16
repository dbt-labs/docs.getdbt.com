---
name: converting-notion-to-docusaurus-blog
description: Use when converting a Notion markdown export to a Docusaurus blog post for the dbt docs site, or when given a path to a Notion export folder/file.
---

# Converting Notion Exports to Docusaurus Blog Posts

## Overview

Automates conversion of Notion markdown exports into properly formatted Docusaurus blog posts for docs.getdbt.com. Handles frontmatter generation, image processing, content cleanup, and file organization.

## When to Use

- User provides a path to a Notion markdown export
- User mentions converting Notion content to a blog post
- User has exported content from Notion for the dbt developer blog

## Workflow

### 1. Read Notion Export

Parse the markdown file and locate the accompanying image folder (same name as the .md file, without the hash suffix).

### 2. Extract Metadata

From the Notion export, extract:
- **Title**: The H1 heading
- **Owner**: Maps to author lookup
- Remove the metadata block (Status, Owner, Created time) from output

### 3. Look Up Author

Search `website/blog/authors.yml` for a matching name from the Owner field.

**If not found**, prompt user:
```
Author "[Name]" not found in authors.yml.

How would you like to proceed?
1. Enter details now (name, title, photo URL, LinkedIn)
2. Scaffold empty entry to fill in manually later
```

Option 2 creates:
```yaml
firstname_lastname:
  name: Full Name
  title: ""  # TODO
  image_url: /img/blog/authors/firstname-lastname.png  # TODO
  socials:
    linkedin: ""  # TODO
  page: true
```

### 4. Prompt for Confirmations

- **Date**: Default to today + 2 days (YYYY-MM-DD)
- **Slug**: Suggest SEO-optimized version (short, keywords only, drop filler words)
- **Description**: Find a compelling sentence from within the article that captures the key value or insight - not just the opening line
- **Tag**: Select the most appropriate tag based on content (see Tag Selection below)
- **End of content**: Confirm where the publishable content ends (remove trailing internal notes)

**Slug guidelines**: Keep 2-4 words, include primary keywords, drop "introducing", "a", "the", "how to".
- "Introducing dbt agent skills" → `dbt-agent-skills`
- "Getting Started with git Branching Strategies" → `git-branching-strategies-dbt`

**Tag selection**: Check `website/blog/categories.yml` for available tags and their descriptions. Select the most appropriate tag based on the post content. Fall back to `analytics craft` only if no other tag fits.

### 5. Process Images

For each image in the Notion export folder:
1. Analyze the image to generate a semantic filename (e.g., `skills-mcp-diagram.png` not `74cb2aed-fe53-481b-89d0-eefd0054e0c2.png`)
2. Generate alt text for accessibility
3. Copy to `website/static/img/blog/YYYY-MM-DD-slug/`

### 6. Copy Original File

Copy the Notion markdown file to `website/blog/YYYY-MM-DD-slug.md` first. This establishes the baseline for git diffs.

### 7. Commit the Raw Baseline

Stage the new blog file and any copied images and create a commit (e.g. `chore: import raw Notion export for <slug>`) before making any edits. This anchors the baseline in git history so that all subsequent transformations appear as a single, reviewable diff against the import commit.

### 8. Apply Transformations as Edits

Apply transformation rules (see below) as individual edits to the copied file. This makes changes visible in git diff, allowing review of exactly what was modified.

### 9. Spellcheck Pass

Run a spellcheck on the content and fix any typos or spelling errors. Be careful to preserve technical terms, product names (dbt, MetricFlow, BigQuery), and intentional stylistic choices.

### 10. Report Results

Summarize: files created, images processed, spelling corrections made, any TODO items (e.g., incomplete author entry).

## Transformation Rules

### Frontmatter

Generate YAML frontmatter:
```yaml
---
title: "Title from H1"
description: "A compelling sentence from the article that captures the key value or insight"
slug: seo-optimized-slug

authors: [author_slug]

tags: [appropriate-tag]
hide_table_of_contents: false

date: YYYY-MM-DD
is_featured: true
---
```

### Images

| Notion | Docusaurus |
|--------|------------|
| `![alt](Folder/image.png)` | `<Lightbox src="/img/blog/YYYY-MM-DD-slug/semantic-name.png" width="85%" alt="generated alt text" />` |
| Image with caption on next line | Merge caption into `title` attribute |

### Content Cleanup

| Pattern | Action |
|---------|--------|
| H1 title | Remove (comes from frontmatter) |
| Status/Owner/Created time block | Remove |
| Trailing sections after conclusion | Remove (internal notes) |
| Code blocks with language `markdown` | Change to `bash` if shell commands |
| Notion callouts (`> **Note**`) | Convert to `:::note` admonitions |
| URL-encoded paths (`%20`) | Decode |
| asterisks for emphasis (`*emphasised* content`) | Replace with underscores (`_emphasised_ content`) |
| Internal Notion links (`notion.so`, `notion.site`) | Flag for review - replace with public resource links |
| Absolute docs site links (`https://docs.getdbt.com/...`) | Convert to relative paths (`/docs/...`, `/reference/...`) |

### Truncate Marker

Insert `<!-- truncate -->` after the introduction (1-3 paragraphs, ~150-300 words) and before the first `##` heading.

## Quick Reference

```
Notion Export:
  my-post abc123.md
  my-post abc123/
    image.png
    image 1.png

Step 1 - Copy original + images, then commit:
  website/blog/YYYY-MM-DD-slug.md  (raw Notion content)
  website/static/img/blog/YYYY-MM-DD-slug/
    semantic-name.png
    another-semantic-name.png
  → git commit (baseline import)

Step 2 - Apply edits (diffable against baseline commit):
  website/blog/YYYY-MM-DD-slug.md  (transformed)
```
