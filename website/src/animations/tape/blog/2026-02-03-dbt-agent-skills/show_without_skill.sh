#!/bin/bash
# Animated output with typing effect

# Function to simulate typing
type_text() {
    local text="$1"
    local delay="${2:-0.03}"
    for ((i=0; i<${#text}; i++)); do
        echo -n "${text:$i:1}"
        sleep "$delay"
    done
    echo ""
}

# Function for instant line with pause
line() {
    echo "$1"
    sleep "${2:-0.15}"
}

clear

# Fake prompt with typing effect
echo -n '$ '
type_text 'claude "Add review_id as a primary key to fct_reviews"' 0.04
sleep 1

echo ""
type_text "Let me find and read the current model file." 0.02
sleep 0.5

line "  ⚙ Read  fct_reviews.sql" 0.2
line "       → Found incremental model with config block" 0.4

echo ""
type_text "Now I'll update the model to use dbt's unique_key config option:" 0.02
sleep 0.5

line "  ✏️ Edit  fct_reviews.sql" 0.2
line "       + unique_key=review_id" 0.6

echo ""
type_text "Done. I've added unique_key=\"review_id\" to the config block." 0.02
sleep 1.2

# Gentle transition with animated hourglass
echo ""
echo ""
echo "                               ╭──────────────────╮"
sleep 0.3
echo "                               │    ⏳ later      │"
sleep 0.3
echo "                               │    ⏳ that       │"
sleep 0.3
echo "                               │    ⏳ day...     │"
sleep 0.3
echo "                               ╰──────────────────╯"
echo ""
echo ""
sleep 2

echo -n '$ '
type_text 'dbt run -s fct_reviews' 0.04
sleep 1

echo ""
line "Running dbt..." 0.5
echo ""
line "  ❌ Database Error in model fct_reviews (models/fact/fct_reviews.sql)" 0.6
line "      000904 (42000): SQL compilation error:" 0.6
line "      identifier 'REVIEW_ID' does not exist" 0.6

sleep 30