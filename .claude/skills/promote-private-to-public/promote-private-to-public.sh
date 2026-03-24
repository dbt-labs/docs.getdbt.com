#!/usr/bin/env bash
# Promote work from docs-internal (private_docs) to docs.getdbt.com (origin).
# Run from any directory inside your local clone (with both remotes configured).
# No arguments needed — the script will prompt you for everything.
set -euo pipefail

PUBLIC_REMOTE="${PUBLIC_REMOTE:-origin}"
PRIVATE_REMOTE="${PRIVATE_REMOTE:-private_docs}"
BASE_BRANCH="${BASE_BRANCH:-current}"

# ── Colours ──────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  BOLD='\033[1m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'
  YELLOW='\033[0;33m'; RED='\033[0;31m'; RESET='\033[0m'
else
  BOLD=''; GREEN=''; CYAN=''; YELLOW=''; RED=''; RESET=''
fi

die()  { echo -e "${RED}Error:${RESET} $*" >&2; exit 1; }
ok()   { echo -e "${GREEN}✓${RESET} $*"; }
info() { echo -e "${CYAN}→${RESET} $*"; }
warn() { echo -e "${YELLOW}!${RESET} $*"; }

# ── Helpers ───────────────────────────────────────────────────────────────────
require_remote() {
  git remote get-url "$1" >/dev/null 2>&1 \
    || die "Remote '$1' is not configured.\n  Run: git remote add $1 https://github.com/dbt-labs/…"
}

ensure_clean_tree() {
  [[ -z "$(git status --porcelain 2>/dev/null)" ]] \
    || die "Working tree has uncommitted changes.\nCommit, stash, or discard them before running this script."
}

current_branch() {
  git branch --show-current
}

open_pr_url() {
  local branch="$1"
  local url="https://github.com/dbt-labs/docs.getdbt.com/compare/${branch}?expand=1"
  echo ""
  echo -e "${BOLD}Open your PR here:${RESET}"
  echo -e "  ${CYAN}${url}${RESET}"
  # Try to open in browser automatically
  if command -v open >/dev/null 2>&1; then
    read -rp "  Open in browser? [Y/n] " yn
    [[ "${yn,,}" != "n" ]] && open "$url"
  fi
}

prompt() {
  # prompt <var_name> <question> [default]
  local var="$1" question="$2" default="${3:-}"
  if [[ -n "$default" ]]; then
    read -rp "  ${question} [${default}]: " val
    eval "$var=\"${val:-$default}\""
  else
    while true; do
      read -rp "  ${question}: " val
      [[ -n "$val" ]] && break
      warn "This field is required."
    done
    eval "$var=\"$val\""
  fi
}

# ── Squash mode ───────────────────────────────────────────────────────────────
cmd_squash() {
  local current; current="$(current_branch)"
  local private_branch public_branch message

  echo ""
  prompt private_branch "Private branch (your docs-internal branch)" "$current"
  prompt public_branch  "Public branch name (use a different name)"  "public-${private_branch}"
  prompt message        "Commit message"

  echo ""
  info "Fetching remotes..."
  git fetch "$PUBLIC_REMOTE" "$BASE_BRANCH" -q
  git fetch "$PRIVATE_REMOTE" "$private_branch" -q
  ok "Fetched"

  local diff_range="${PUBLIC_REMOTE}/${BASE_BRANCH}...${PRIVATE_REMOTE}/${private_branch}"

  # Check for empty diff before doing anything destructive
  if [[ -z "$(git diff "$diff_range")" ]]; then
    die "No differences found between ${diff_range}.\nCheck that --private-branch differs from ${PUBLIC_REMOTE}/${BASE_BRANCH}."
  fi

  ensure_clean_tree

  if git show-ref --verify --quiet "refs/heads/${public_branch}"; then
    warn "Local branch '${public_branch}' already exists."
    read -rp "  Delete it and recreate? [y/N] " yn
    [[ "${yn,,}" == "y" ]] || die "Aborted. Choose a different public branch name."
    git branch -D "$public_branch"
  fi

  info "Creating branch ${public_branch} from ${PUBLIC_REMOTE}/${BASE_BRANCH}..."
  git checkout -b "$public_branch" "${PUBLIC_REMOTE}/${BASE_BRANCH}" -q
  ok "Branch created"

  info "Applying changes..."
  if ! git diff "$diff_range" | git apply; then
    git reset --hard HEAD >/dev/null 2>&1 || true
    git checkout "$current" -q 2>/dev/null || true
    git branch -D "$public_branch" 2>/dev/null || true
    die "Could not apply the diff cleanly. Resolve conflicts manually or check the private branch."
  fi

  local changed
  changed="$(git diff --cached --stat HEAD 2>/dev/null; git status --short)"
  ok "Changes applied ($(echo "$changed" | grep -c .) file(s) changed)"

  git add -A
  git commit -m "$message" -q
  ok "Committed"

  info "Pushing to ${PUBLIC_REMOTE}..."
  git push -u "$PUBLIC_REMOTE" "$public_branch" -q
  ok "Pushed"

  open_pr_url "$public_branch"
}

# ── History mode ──────────────────────────────────────────────────────────────
cmd_history() {
  local current; current="$(current_branch)"
  local branch

  echo ""
  prompt branch "Branch to promote (your docs-internal branch)" "$current"

  echo ""
  info "Fetching remotes..."
  git fetch "$PUBLIC_REMOTE" "$BASE_BRANCH" -q
  git fetch "$PRIVATE_REMOTE" "$BASE_BRANCH" -q
  git fetch "$PRIVATE_REMOTE" "$branch" -q
  ok "Fetched"

  ensure_clean_tree

  info "Updating local ${BASE_BRANCH} from ${PRIVATE_REMOTE}..."
  git checkout "$BASE_BRANCH" -q
  git pull "$PRIVATE_REMOTE" "$BASE_BRANCH" -q
  ok "Updated"

  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    git checkout "$branch" -q
  else
    info "Checking out ${branch} from ${PRIVATE_REMOTE}..."
    git checkout -b "$branch" "${PRIVATE_REMOTE}/${branch}" -q
  fi
  ok "On branch ${branch}"

  info "Merging ${BASE_BRANCH}..."
  if ! git merge "$BASE_BRANCH" --no-edit -q; then
    echo ""
    warn "Merge conflicts detected."
    echo "  Resolve them, then run:"
    echo -e "    ${BOLD}git push -u ${PUBLIC_REMOTE} ${branch}${RESET}"
    exit 1
  fi
  ok "Merged"

  info "Pushing to ${PUBLIC_REMOTE}..."
  git push -u "$PUBLIC_REMOTE" "$branch" -q
  ok "Pushed"

  open_pr_url "$branch"
}

# ── Entry point ───────────────────────────────────────────────────────────────
cd "$(git rev-parse --show-toplevel 2>/dev/null || die "Run this from inside a git repository.")"

require_remote "$PUBLIC_REMOTE"
require_remote "$PRIVATE_REMOTE"

echo ""
echo -e "${BOLD}  Promote docs-internal → docs.getdbt.com${RESET}"
echo "  ─────────────────────────────────────────"
echo -e "  Current branch: ${CYAN}$(current_branch)${RESET}"
echo ""
echo "  Promote type:"
echo "    1. Single clean commit  (recommended — no private history)"
echo "    2. Keep full commit history"
echo ""
read -rp "  Choice [1]: " choice
choice="${choice:-1}"

case "$choice" in
  1) cmd_squash ;;
  2) cmd_history ;;
  *) die "Invalid choice. Enter 1 or 2." ;;
esac
