#!/usr/bin/env bash
# Install dbt docs team Claude skills to user-level ~/.claude/skills/
# Run once per machine: bash install.sh

set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOME/.claude/skills"
INSTALLED=0
SKIPPED=0

echo "Installing dbt docs Claude skills to $TARGET_DIR..."
echo ""

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name="$(basename "$skill_dir")"

  # Skip non-skill entries
  [[ ! -f "$skill_dir/SKILL.md" ]] && continue

  dest="$TARGET_DIR/$skill_name"

  if [[ -d "$dest" ]]; then
    read -r -p "  '$skill_name' already exists. Overwrite? [y/N] " answer
    [[ "$answer" =~ ^[Yy]$ ]] || { echo "  Skipped $skill_name"; ((SKIPPED++)); continue; }
  fi

  mkdir -p "$dest"
  cp "$skill_dir/SKILL.md" "$dest/SKILL.md"
  echo "  ✓ Installed $skill_name"
  ((INSTALLED++))
done

echo ""
echo "Done. $INSTALLED installed, $SKIPPED skipped."
echo "Restart Claude Code for new skills to take effect."
