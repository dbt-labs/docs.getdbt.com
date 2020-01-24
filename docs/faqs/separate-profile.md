---
title: Why is the `profiles.yml` file outside my project?
---

Profiles are stored separately to dbt projects to avoid checking credentials
into version control. Database credentials are extremely sensitive information
and should _never_ be checked into version control.
