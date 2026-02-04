#!/bin/bash
# Generate, optimize, and deploy all .tape files in current directory

set -e

TAPE_ROOT="$(cd "$(dirname "$0")" && pwd)"
STATIC_IMG_ROOT="$(dirname "$TAPE_ROOT")/../../static/img"

# Get relative path from tape root to cwd
REL_PATH="${PWD#$TAPE_ROOT/}"

# Destination directory
DEST_DIR="$STATIC_IMG_ROOT/$REL_PATH"

# Find all .tape files in cwd
TAPE_FILES=$(find . -maxdepth 1 -name "*.tape" -type f)

if [ -z "$TAPE_FILES" ]; then
    echo "No .tape files found in current directory"
    exit 1
fi

# Create destination directory
mkdir -p "$DEST_DIR"

for tape in $TAPE_FILES; do
    name=$(basename "$tape" .tape)
    echo "Generating $name.gif..."
    vhs "$tape"

    echo "Optimizing and copying to $DEST_DIR/$name.gif"
    gifsicle -O3 --lossy=80 --colors=8 "$name.gif" -o "$DEST_DIR/$name.gif"

    echo ""
done

echo "Done. Generated $(echo "$TAPE_FILES" | wc -l | tr -d ' ') GIF(s)"
