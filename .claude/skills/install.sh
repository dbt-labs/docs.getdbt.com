#!/usr/bin/env bash
# Setup dbt docs fox.
# Run once: bash .claude/skills/install.sh
# Or:       bash dbt-docs-fox install

bash "$(cd "$(dirname "$0")/../.." && pwd)/dbt-docs-fox" install
