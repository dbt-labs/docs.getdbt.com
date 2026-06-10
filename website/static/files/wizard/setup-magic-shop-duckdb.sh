#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-magic_shop_wizard}"

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Python 3.9 or later is required, but Python was not found on your PATH." >&2
  exit 1
fi

if [ -e "$PROJECT_DIR" ]; then
  echo "The directory '$PROJECT_DIR' already exists." >&2
  echo "Choose another location with PROJECT_DIR=my_project_name, or remove the existing directory." >&2
  exit 1
fi

mkdir -p "$PROJECT_DIR/seeds" "$PROJECT_DIR/models/staging"
cd "$PROJECT_DIR"

"$PYTHON_BIN" -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install --pre dbt

cat > dbt_project.yml <<'EOF'
name: magic_shop_wizard
version: "1.0.0"
config-version: 2

profile: magic_shop_wizard

model-paths: ["models"]
seed-paths: ["seeds"]

models:
  magic_shop_wizard:
    staging:
      +materialized: view

seeds:
  magic_shop_wizard:
    +quote_columns: false
EOF

cat > profiles.yml <<'EOF'
magic_shop_wizard:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: magic_shop.duckdb
EOF

cat > seeds/wizards.csv <<'EOF'
id,w_name,email,phone,world
1,Merlin,merlin@magic.shop,555-0101,1
2,Morgana,morgana@magic.shop,555-0102,2
3,Gandalf,gandalf@magic.shop,555-0103,1
EOF

cat > seeds/orders.csv <<'EOF'
id,customer,wand,date
1001,1,10,2026-01-05
1002,2,11,2026-01-07
1003,1,12,2026-01-12
1004,3,10,2026-01-14
EOF

cat > seeds/wands.csv <<'EOF'
id,name
10,Oak wand
11,Elder wand
12,Willow wand
EOF

cat > seeds/worlds.csv <<'EOF'
id,name
1,Earth
2,Avalon
EOF

cat > models/staging/stg_wizards.sql <<'EOF'
select
    id as wizard_id,
    w_name as wizard_name,
    email,
    email like '%@%' as is_valid_email_address,
    phone as phone_number,
    world as world_id
from {{ ref('wizards') }}
EOF

cat > models/staging/stg_orders.sql <<'EOF'
select
    id as order_id,
    customer as wizard_id,
    wand as wand_id,
    cast("date" as date) as order_date
from {{ ref('orders') }}
EOF

cat > models/staging/stg_wands.sql <<'EOF'
select
    id as wand_id,
    name as wand_name
from {{ ref('wands') }}
EOF

cat > models/staging/stg_worlds.sql <<'EOF'
select
    id as world_id,
    name as world_name
from {{ ref('worlds') }}
EOF

cat > .gitignore <<'EOF'
.venv/
target/
dbt_packages/
dbt_internal_packages/
logs/
*.duckdb
.user.yml
EOF

dbt seed
dbt build

# Initialize a git repo so `wizard review` and the commit steps work later.
# Done after the build so generated artifacts are already ignored and the
# working tree is clean when you start Wizard.
if command -v git >/dev/null 2>&1; then
  git init -q
  git add -A
  git -c user.name="dbt Wizard" -c user.email="wizard@example.com" \
    commit -q -m "Initial Magic Shop project" || true
fi

cat <<EOF

Magic Shop is ready.

Next steps:
  cd $PROJECT_DIR
  source .venv/bin/activate
  # Install Wizard CLI next (see the quickstart), then:
  export OPENAI_API_KEY="sk-..."
  wizard

EOF
