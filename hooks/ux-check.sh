#!/usr/bin/env bash
# ux-pilot PostToolUse hook
# Runs after Write/Edit on HTML/CSS/JSX/TSX/Svelte/Vue files
# Quick UX rule checks — max 100ms execution

FILE="$1"

# Only check relevant file types
case "$FILE" in
  *.html|*.htm|*.jsx|*.tsx|*.vue|*.svelte) ;;
  *) exit 0 ;;
esac

# Only check if file exists
[ -f "$FILE" ] || exit 0

CONTENT=$(cat "$FILE")
WARNINGS=""

# Check H1 count (only for full HTML pages)
if echo "$CONTENT" | grep -q "<html\|<head"; then
  H1_COUNT=$(echo "$CONTENT" | grep -oi "<h1" | wc -l)
  if [ "$H1_COUNT" -eq 0 ]; then
    WARNINGS="${WARNINGS}[ux-pilot] Missing H1 heading\n"
  elif [ "$H1_COUNT" -gt 1 ]; then
    WARNINGS="${WARNINGS}[ux-pilot] Multiple H1 headings found ($H1_COUNT)\n"
  fi

  # Check viewport meta
  if ! echo "$CONTENT" | grep -q "viewport"; then
    WARNINGS="${WARNINGS}[ux-pilot] Missing viewport meta tag\n"
  fi

  # Check meta description
  if ! echo "$CONTENT" | grep -q 'name="description"\|name='\''description'\'''; then
    WARNINGS="${WARNINGS}[ux-pilot] Missing meta description\n"
  fi
fi

# Check images without alt
IMG_NO_ALT=$(echo "$CONTENT" | grep -oP '<img\s[^>]*>' | grep -v 'alt=' | wc -l)
if [ "$IMG_NO_ALT" -gt 0 ]; then
  WARNINGS="${WARNINGS}[ux-pilot] $IMG_NO_ALT image(s) missing alt attribute\n"
fi

# Check inputs without associated labels
INPUT_COUNT=$(echo "$CONTENT" | grep -oP '<input\s[^>]*>' | grep -v 'type="hidden"\|type="submit"\|type="button"' | wc -l)
LABEL_COUNT=$(echo "$CONTENT" | grep -oi "<label" | wc -l)
if [ "$INPUT_COUNT" -gt 0 ] && [ "$LABEL_COUNT" -lt "$INPUT_COUNT" ]; then
  WARNINGS="${WARNINGS}[ux-pilot] Possible missing form labels ($LABEL_COUNT labels for $INPUT_COUNT inputs)\n"
fi

# Output warnings to stderr
if [ -n "$WARNINGS" ]; then
  echo -e "$WARNINGS" >&2
fi

exit 0
