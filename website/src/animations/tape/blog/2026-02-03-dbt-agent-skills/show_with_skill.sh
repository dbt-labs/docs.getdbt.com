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
line "  📖 Skill  using-dbt-for-analytics-engineering" 0.3
type_text '           "…You must look at the data to correctly model it…"' 0.02
sleep 0.6

echo ""
type_text "I'll verify the data structure first." 0.02
sleep 0.4

line "  ⚙ Read   fct_reviews.sql" 0.15
line "  ⚙ Read   fct_reviews.yml" 0.15
line "  ⚙ Read   src_reviews.sql" 0.15
line "  ⚙ Read   sources.yml" 0.3

echo ""
type_text "I don't see an existing review_id column. Let me explore the raw data." 0.02
sleep 0.4

line "  ⚙ dbt    show source('airbnb','reviews')" 0.2
line "           LISTING_ID | DATE | REVIEWER_NAME | COMMENTS | SENTIMENT" 0.2
line "              ...     | ...  |       ...     |   ...    |    ..." 0.2
sleep 0.7

echo ""
type_text "The raw data doesn't have a review_id column. I'll need to create a surrogate key." 0.02
sleep 0.4

line "  ⚙ Read   packages.yml" 0.15
echo ""
type_text "The dbt_utils package is available. I'll use it." 0.02
sleep 0.7

line "  ✏️  Edit   fct_reviews.sql" 0.2
sleep 0.5

echo ""
type_text "Now I'll document the column and add unique and not_null tests." 0.02
line "  ✏️  Edit   schema.yml" 0.2
 
echo ""
type_text "Let me validate that the model builds and that the column is unique." 0.02
sleep 0.3

line "  ⚙ dbt    run --select fct_reviews --full-refresh" 0.2
line "           → PASS=1" 0.3

line "  ⚙ dbt    show --inline [...]" 0.2
line "           | REVIEW_ID | count |" 0.2
line "           |    ...    |   2   |" 0.2
sleep 0.5

echo ""
type_text "The combination of columns is not unique! Let me add REVIEW_TEXT to the surrogate key" 0.02
sleep 0.3

line "  ✏️  Edit   fct_reviews.sql" 0.2
line "           - generate_surrogate_key([...])" 0.15
line "           + generate_surrogate_key([...])" 0.3

echo ""
type_text "I'll rebuild the model and check for duplicates again." 0.02
sleep 0.3

line "  ⚙ dbt    run --select fct_reviews --full-refresh" 0.2
line "           → PASS=1" 0.3
line "  ⚙ dbt    show --inline [...]" 0.2
line "           → No duplicates found" 0.2
sleep 0.7

echo ""
type_text "The REVIEW_ID is now unique. The implementation is complete." 0.03
sleep 10
