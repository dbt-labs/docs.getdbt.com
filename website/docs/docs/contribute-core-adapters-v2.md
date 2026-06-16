---
title: "Contribute a dbt Core v2 adapter"
id: "contribute-core-adapters-v2"
pagination_next: null
---

:::caution Work in progress
This guide is a work in progress — synthesized from internal Fusion v2 adapter team docs, DuckDB/ClickHouse reference implementations, the Exasol community adapter, and the v1 adapter creation guide.

**Community contribution scope:** You are responsible for **Phase 1 (foundation)** only — connecting, running macros, and basic materializations. Phase 2 (SQL static analysis) is led by dbt Labs after your Phase 1 PR is merged.
:::

## Step 1: Introduction

dbt Core v2 adapters work very differently from dbt Core v1 adapters. In v1, each adapter was a standalone Python package that implemented a fragmented Python interface. In dbt Core v2, adapters live **inside a monorepo written in Rust**, connected to warehouses via ADBC (Arrow Database Connectivity) drivers — and the community contribution model has changed accordingly.

This guide walks you through contributing a new dbt Core v2 adapter to dbt-core as a community member. The file breakdown in the [reference section](#reference-file-by-file-implementation-guide) shows the ~13 files a complete community dbt Core v2 adapter touches. Exasol, a community contributed dbt Core v2 adapter, is the example used throughout this guide.

:::info What is dbt Core v2?
dbt Core v2 is the new Rust-based dbt engine. Adapters in Core v2 are written in Rust and live inside the `dbt-core` monorepo, rather than as standalone Python packages.
:::

### How adapters are different now

In dbt Core v1, every adapter is:
- A **separate Python package** (e.g. `dbt-snowflake`, `dbt-bigquery`)
- **Community-owned** and maintained independently
- **Dynamically loaded** at runtime via Python's plugin system
- Built upon vendor-maintained Python SDK connectors/drivers

In dbt Core v2, adapters are:
- **Part of the `dbt-core` monorepo**, contributed as PRs
- **Written in Rust** (with Jinja SQL macros still used for SQL logic)
- Connected to warehouses via **ADBC drivers** — a unified driver interface that abstracts away connection management
- Organized by **vertical** (feature area) rather than by warehouse — meaning a bug fix in one crate often benefits all adapters

The practical upside: **adding a new adapter requires far less code than it did in v1**, and the cost of development decreases as more adapters are added because shared logic increases.

### What you'll be building

As a community contributor, you're building the **foundation**: connect your warehouse, run dbt macros, and support basic materializations (`dbt run`, `dbt build`). The ~13 files in the reference section define the complete scope.

---

## Step 2: Prerequisites

### Background knowledge

Before starting, you should:
- **Have some Rust familiarity** — you do not need to be a Rust expert (an LLM will likely do most of the code writing). You need to be able to read Rust, understand enum match expressions, and make sense of compiler errors. If Rust is new to you, skim [The Rust Book](https://doc.rust-lang.org/book/) Chapter 6 (enums and pattern matching) — those are the concepts you'll encounter most.
- **Understand dbt fundamentals** — how [`profiles.yml`](https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml) works, what [materializations](https://docs.getdbt.com/docs/build/materializations) are, and what [adapter dispatch](https://docs.getdbt.com/reference/dbt-jinja-functions/adapter) macros do.
- **Understand your query engine** and how it differs from others. The following questions cover the key considerations for building an adapter:
  - What character is used for quoting identifiers?
  - Are three-part names supported, or only two?
  - Are transactions supported?
  - What's the most performant way to get all the columns in a schema?
  - What datatype represents a string?
  - What connection fields does your warehouse require?
- **Have an LLM coding assistant available** (optional) — the adapter development workflow is designed with AI-assisted coding in mind, and this guide calls out where to use it.

### Your ADBC driver

:::caution The ADBC driver for your warehouse must already exist before you start
dbt Labs does not write drivers. If your warehouse doesn't have an ADBC driver yet, that work comes first — it's a prerequisite you can't skip.
:::

**What "having an ADBC driver" actually means**

For certain adapters (Snowflake, BigQuery, Databricks, Redshift, DuckDB, ClickHouse, Salesforce, Spark, SQL Server), dbt Core v2 automatically downloads the correct driver binary from the dbt Labs CDN on first use. Users never have to think about it.

Community adapters don't have CDN support. Instead, Fusion looks for a shared library by name on the user's system — e.g. `libadbc_driver_exasol.dylib` on macOS, `libadbc_driver_exasol.so` on Linux. If the file isn't present, the connection fails at runtime.

This means two things for you as a contributor:
1. **The driver binary must exist somewhere.** It's a compiled shared library (`.dylib`/`.so`/`.dll`) that implements the ADBC C ABI for your warehouse. Exasol's driver is `exarrow-rs`, a separate Rust crate maintained by Exasol — not part of `dbt-core` and not in `apache/arrow-adbc`. Your warehouse's driver will likely live in a similar separate repo.
2. **Your users will need to install it manually.** Unlike first-party adapters, there's no auto-download. Your documentation (Step 6) needs to tell users where to get the driver and how to install it.

Check whether a driver already exists for your warehouse:
- [dbt-labs/arrow-adbc](https://github.com/dbt-labs/arrow-adbc) — the dbt Labs fork
- [apache/arrow-adbc](https://github.com/apache/arrow-adbc) — the upstream community repo
- [adbc-drivers](https://github.com/orgs/adbc-drivers/repositories?type=all) — the [ADBC driver foundry](https://adbc-drivers.org/2025/10/29/announcing-adbc-driver-foundry.html), the primary community home for ADBC drivers, with active drivers for Trino, MySQL, BigQuery, Databricks, Snowflake, and more; also includes Rust/Go frameworks (`driverbase-rs`, `template-rs`) for building new drivers from scratch
- The warehouse vendor's own GitHub org (many vendors publish ADBC drivers independently)

:::note Driver source is flexible — with a security caveat
Fusion loads drivers by shared library name from the system path (e.g. `libadbc_driver_exasol.dylib` on macOS) — the source repository is flexible, as long as the binary implements the ADBC C ABI. dbt Labs is working on a driver signing and verification mechanism. Until that ships, users are responsible for trusting the driver binary they install.
:::

If no driver exists yet, building one is a separate project that comes before the adapter contribution. This is outside the scope of what dbt Labs can help with. [Columnar](https://columnar.tech/) specializes in building ADBC drivers and may be a useful resource if you need help getting a driver built.

### Are you porting an existing v1 adapter?

:::tip Building from scratch with no v1 adapter?
Skip to the checklist below, then go straight to Step 4. You won't have macro SQL or connection logic to port, but the rest of the guide (crate structure, Rust patterns, AI workflow) still applies.
:::

Most community contributors aren't building from scratch — they're porting an adapter they already maintain or use in Python for dbt Core v1. If that's you, **you have a significant head start**, and this is the most realistic path for the vast majority of contributors.

Before writing any Rust, check a few things:

**1. Does a v1 adapter already exist for your warehouse?**

Check the [trusted adapters](/docs/trusted-adapters) and [community adapters](/docs/community-adapters) lists. If one exists, find its GitHub repo — the macro SQL and connection logic are almost directly reusable.

**2. Did dbt Labs already add a placeholder for your warehouse?**

Some warehouses already appear in v2's `AdapterType` enum but aren't fully implemented yet — the enum variant exists, which means the boilerplate is partially in place. When you add the remaining code, the compiler shows you exactly what's still missing. The warehouses in this state are:

| Warehouse | v1 adapter | Fusion status |
|-----------|------------|---------------|
| Athena | [dbt-athena](https://github.com/dbt-athena/dbt-athena) (trusted) | `AdapterType::Athena` exists — needs auth, macros, adapter arms |
| Trino | [dbt-trino](https://github.com/starburstdata/dbt-trino) (trusted) | `AdapterType::Trino` exists — needs auth, macros, adapter arms |
| Starburst | [dbt-trino](https://github.com/starburstdata/dbt-trino) (trusted) | `AdapterType::Starburst` exists — needs auth, macros, adapter arms |
| Dremio | [dbt-dremio](https://github.com/dremio/dbt-dremio) (trusted) | `AdapterType::Dremio` exists — needs auth, macros, adapter arms |
| Oracle | [dbt-oracle](https://github.com/oracle/dbt-oracle) (trusted) | `AdapterType::Oracle` exists — needs auth, macros, adapter arms |

For warehouses not yet in `AdapterType` at all (MySQL, Hive, Vertica, SQL Server, Teradata, etc.), you start from Step 4.1 by adding the `AdapterType` variant.

**What transfers from v1 to v2**

| v1 component | Where it goes in v2 | Notes |
|---|---|---|
| `macros/adapters.sql` | `dbt-loader/.../dbt-<wh>/macros/adapters.sql` | Mostly a direct port — same `<wh>__` dispatch prefix, same macro names, same Jinja patterns |
| `macros/catalog.sql` | Same location | The catalog SQL (`list_relations_without_caching`, `get_catalog`) transfers almost verbatim |
| Custom materializations and adapter-overrides | Same location | Look out for Jinja that might not yet be supported in dbt Core v2; that will need to be addressed separately |
| Profile fields in `credentials.py` / `profile_template.yml` | `DbConfig` struct in `dbt-schemas` | Each profile field becomes a struct field — optional fields use `Option<T>` |
| Connection URI / DSN construction in `connections.py` | `dbt-auth/src/<wh>/mod.rs` | The URI building logic maps cleanly to the auth module pattern |
| `BaseRelation.quote_policy` / identifier casing behavior | `Policy::new(...)` in `relation_object.rs` | The 3-part vs. 2-part name structure and quote flags map 1:1 to the dbt Core v2 `Policy` struct |
| Catalog introspection SQL in macros and `adapter.py` | `get_relation.rs` and Jinja macros | The system catalog table names and queries you already know transfer directly |

**What doesn't transfer by design**

A few components won't transfer 1:1 from v1 to dbt Core v2 — meaning less code and maintenance for you:
- `ConnectionManager` methods (`open`, `cancel`, `get_response`, `execute`) — In v1, these were your responsibility to implement against the Python DB API 2.0 spec. In v2, connection management is owned entirely by the ADBC driver.
- Python adapter class hierarchy and execution-wrapping methods — now handled by `match adapter_type()` expressions in the shared `adapter_impl.rs` (Step 4.5 explains how these work).
- `setup.py` / package dependencies on `dbt-core` — dbt Labs handles packaging and distribution once your PR is merged. No `setup.py`, no PyPI release, and no version pinning required.

**How to use the v1 adapter with AI**

The Jinja macros are the biggest asset. Feed your LLM your v1 `macros/adapters.sql` alongside the reference `adapters.sql` (in the file breakdown at the bottom of this guide) and ask it to port the macros into the Fusion structure. The SQL logic is the same; you're confirming the dialect is right and the system catalog table names match.

For profile config and auth, feed your LLM your v1 `credentials.py` or `profile_template.yml` alongside the reference `DbConfig` struct and auth module (see the file breakdown below). Field names and connection parameters usually map directly.

The most common mismatch: v1 `connections.py` has a lot of Python connection-management code that has no equivalent in Core v2 — the driver handles all of that. Focus only on URI/DSN construction and credential fields — skip anything related to cursors, retries, or connection pooling.

### Dev machine setup

```bash
# Rust
rustup  # install from https://rustup.rs
rustup show  # verify

# Go (needed for driver builds)
go version  # verify

# Clone the repo
git clone https://github.com/dbt-labs/dbt-core
cd dbt-core

# Verify you can build
cargo build --bin dbt
```

If you hit Z3 errors:
```bash
brew install pkg-config z3
```

If disk fills during build:
```bash
cargo clean  # frees old build artifacts — you'll do this often
```

### Development workflow

The core development loop is the same whether you write code manually or with an AI assistant:

1. Add `AdapterType::MyWarehouse` to the enum (Step 4.1)
2. Run `cargo check -p <crate>` — the compiler lists every match arm missing for your new variant
3. Use the compiler output + the file you're editing + the equivalent reference file (from the breakdown below) to write each arm. If using an AI assistant, paste all three in as context.
   - *Example:* to fill in the `quote_char` arm, paste the compiler error listing `AdapterType::MyWarehouse` as missing, the `quote_char` match block from `dbt-adapter-core/src/lib.rs`, and the Exasol line (`Exasol => '"'`) as the pattern to follow.
4. Fill in the arm; verify with `cargo check` again
5. Repeat for each crate until error-free

Every missing case is a compile error, so the AI always has a precise specification to work from.

**What context helps for each arm:**
- **The file you're editing** — paste the relevant `match` block or function. For example: the `match self.adapter_type()` block from `adapter_impl.rs` that needs a new arm.
- **The equivalent reference file** from the breakdown below. For example: when writing your auth module, paste `crates/dbt-auth/src/exasol/mod.rs` as the pattern.
- **The compiler error output.** For example: `error[E0004]: non-exhaustive patterns: AdapterType::MyWarehouse not covered`
- **Your warehouse's specifics** — system catalog table names and the connection fields from your `profiles.yml`.

**Watch out for:**
- **Hallucinated file paths** — AI often invents Fusion paths. Use the file breakdown below as ground truth.
- **Always verify with the type checker** — run `cargo check -p <crate>` after any AI-generated changes.
- **SQL macro patterns from v1** may not apply cleanly in Fusion. Compare against the reference `adapters.sql` in `crates/dbt-loader/src/dbt_macro_assets/dbt-exasol/macros/adapters.sql` in [dbt-labs/dbt-fusion](https://github.com/dbt-labs/dbt-fusion).

---

## Step 3: Understand the architecture

Before writing code, it helps to understand the layers you'll be working in.

### Why ADBC?

A key architectural decision in Core v2 is the use of **ADBC (Arrow Database Connectivity)** as the unified driver interface.

In dbt Core v1, adapters connected via Python drivers — often wrapping `pyodbc` or proprietary connection mechanisms. Each adapter owned its connection logic entirely.

In v2, each warehouse connects through an **ADBC driver** — a pre-compiled binary that handles the wire protocol, authentication handshakes, and connection pooling. Your adapter code never touches any of that. For CDN-supported first-party adapters, Fusion downloads this driver automatically on first use. For community adapters, users install it manually — which is why Step 2 covers finding or building a driver.

ADBC is column-native end-to-end — if your warehouse supports columnar output (e.g. Arrow IPC or Arrow Flight SQL), data flows through with zero conversion. This means **you do not need to write connection management code** — that lives in the driver. What you write is the warehouse-specific configuration, authentication, relation naming, macro logic, and catalog introspection that sits above the driver.

### The vertical model

Unlike v1 where *each warehouse* had its own monolithic adapter class (`SnowflakeAdapter`, `BigqueryAdapter`), Core v2 organizes adapter logic by **vertical** — feature areas that *span all warehouses*:
- **`dbt-xdbc`** — driver loading, ADBC connections (all warehouses)
- **`dbt-auth`** — credential resolution (all warehouses, per-warehouse modules)
- **`dbt-adapter`** — a single `ConcreteAdapter` with warehouse-specific behavior driven by `match adapter_type()`, not per-warehouse structs
- **`dbt-loader`** — Jinja SQL macros per warehouse

When you add a new warehouse, you add a variant to each vertical, not a new top-level package. The compiler enforces this: if you add `AdapterType::MyWarehouse` and any `match adapter_type()` block doesn't handle it, Rust won't compile. For example, if `adapter_impl.rs` has a `match self.adapter_type()` that covers Postgres, Snowflake, Exasol, etc. but not `MyWarehouse`, the compiler reports an error at that exact line — so you always know what's left.

This is a meaningful improvement over v1's class inheritance model. In v1, a new adapter subclass would silently inherit parent behavior for any method you didn't explicitly override — which could mask bugs where a warehouse quietly used the wrong default. In v2 there's no inheritance and no implicit behavior. Every function that varies by warehouse requires an explicit match arm, so nothing falls through silently.

For example:

```
error[E0004]: non-exhaustive patterns: `AdapterType::MyWarehouse` not covered
  --> crates/dbt-adapter/src/adapter/adapter_impl.rs:142:18
   |
   |     match self.adapter_type() {
   |           ^^^^^^^^^^^^^^^^^^^ pattern `AdapterType::MyWarehouse` not covered
```

### Layer stack

The diagram below shows how a dbt project request flows through the crates at runtime — from configuration to SQL execution. Your adapter work lives in the middle layers: profile config, credential resolution, driver loading, relation logic, and macros. The bottom layer (SQL execution against the warehouse) is owned by dbt Labs.

```
profiles.yml / dbt_project.yml
        │
        ▼
  dbt-schemas        ← profile config struct for your warehouse
        │
        ▼
  dbt-auth           ← credential resolution
        │
        ▼
  dbt-xdbc           ← ADBC driver loading
        │
        ▼
  dbt-adapter        ← relation types, metadata adapter, adapter methods
        │
  dbt-loader         ← Jinja SQL macros (materializations, catalog, utils)
        │
        ▼
  [dbt internal]     ← SQL execution against warehouse (dbt Labs)
```

### Crate map

In Rust, a **crate** is a package — the unit of compilation, roughly equivalent to a "library" or "module" in other languages. The `dbt-core` monorepo has multiple crates, each responsible for one vertical slice of functionality across all warehouses. This is a quick-reference map of the six crates you'll touch to build your adapter, in the order you'll work through them in Step 4.

| Crate | Location | What you touch |
|---|---|---|
| `dbt-adapter-core` | `crates/dbt-adapter-core/` | `AdapterType` enum variant, `quote_char` arm |
| `dbt-xdbc` | `crates/dbt-xdbc/` | ADBC driver registration (`Backend` enum, library name) |
| `dbt-schemas` | `crates/dbt-schemas/` | `profiles.yml` config struct (`DbConfig` variant) |
| `dbt-auth` | `crates/dbt-auth/` | Credential resolution, connection URI construction |
| `dbt-adapter` | `crates/dbt-adapter/` | Relation quoting, metadata catalog queries, adapter match arms, column builder, sql_types |
| `dbt-loader` | `crates/dbt-loader/` | Jinja SQL macros (`dbt_macro_assets/dbt-<adapter>/`) |

---

## Step 4: Build a new adapter

This step walks you through each crate you need to touch. Work through them in order — each builds on the last. After each sub-step, run the type checker to catch missed match arms and type errors:

```bash
cargo check -p <crate-name>
```

Replace `<crate-name>` with the crate you just edited — e.g. `dbt-adapter-core`, `dbt-xdbc`, `dbt-schemas`, `dbt-auth`, `dbt-adapter`, or `dbt-loader`. These match the names in the crate map.

### 4.1 — Register the adapter type

**Crate:** `crates/dbt-adapter-core/`

`AdapterType` is the central enum that identifies your warehouse throughout the entire codebase. Add your variant here first.

Rust's `match` expressions must handle every possible variant — there's no catch-all default case. So when you add `AdapterType::MyWarehouse`, every `match adapter_type()` block in the codebase that doesn't handle your variant becomes a **compile error**. Run `cargo check -p <crate>` and the compiler hands you a complete list of exactly what still needs to be written.

```rust
// crates/dbt-adapter-core/src/lib.rs
pub enum AdapterType {
    Postgres, Snowflake, Bigquery, Databricks, Redshift,
    Salesforce, Spark, DuckDB, Fabric,
    ClickHouse, Athena, Starburst, Trino, Datafusion, Dremio, Oracle,
    Exasol,        // ← already added
    MyWarehouse,   // ← add yours here
}
```

Also add a `quote_char` arm in the same file. Use double quotes `'"'` for most warehouses; BigQuery and Databricks use a backtick instead:

```rust
// crates/dbt-adapter-core/src/lib.rs
fn quote_char(&self) -> char {
    match self {
        // ... existing adapters ...
        Exasol => '"',         // double-quote (most warehouses)
        MyWarehouse => '"',    // ← add yours here
        BigQuery | Databricks => '`',
    }
}
```

### 4.2 — Register the ADBC driver

**Crate:** `crates/dbt-xdbc/`

This is where v2 learns how to find and load your warehouse's ADBC driver at runtime.

| File | What to do | Required? |
|---|---|---|
| `src/driver.rs` | Add a variant to the `Backend` enum; add the ADBC library name (e.g. `"adbc_driver_exasol"`) and FFI protocol; also define a `LoadStrategy` | **Yes** |
| `src/install.rs` | Add CDN download URL and platform strings | No — only if the driver will be distributed via the dbt Labs CDN, which requires separate coordination with dbt Labs. Community adapter drivers are not on the CDN by default. |

The `Backend` enum maps to the ADBC shared library name (`lib<name>.so` / `<name>.dll` / `lib<name>.dylib`). You're registering its identity so v2 knows what to load — you're not writing the driver here.

For **custom Arrow type mappings** (e.g. DuckDB needed this for `HUGEINT`, `UTINYINT`): only add warehouse-specific type handling if your driver returns types that Arrow's standard schema doesn't cover. Most warehouses don't need this.

### 4.3 — Add your connection profile

**Crate:** `crates/dbt-schemas/`

| File | What to do |
|---|---|
| `src/schemas/profiles.rs` | Add a `DbConfig` variant and a config struct with all connection fields |

The config struct should include everything a user would put in their `profiles.yml` for your warehouse. Example from Exasol:

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Default, DbtSchema, Merge)]
pub struct ExasolDbConfig {
    pub user: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none", alias = "pass")]
    pub password: Option<String>,
    pub host: Option<String>,
    pub port: Option<StringOrInteger>,
    pub database: Option<String>,
    pub schema: Option<String>,
    pub encryption: Option<bool>,
    pub certificate_validation: Option<bool>,
    pub certificate_fingerprint: Option<String>,
    pub connection_timeout: Option<StringOrInteger>,
    pub threads: Option<StringOrInteger>,
}
```

After adding the config struct, also add `DbConfig::MyWarehouse(Box<MyWarehouseDbConfig>)` as a new variant to the `DbConfig` enum. This registers your new config type so the rest of the codebase knows it exists. Once you do, the compiler will point you at every place that reads from `DbConfig` and needs a new case for your warehouse — follow those errors to wire it in.

### 4.4 — Add authentication

**Crate:** `crates/dbt-auth/`

| File | What to do | Required? |
|---|---|---|
| `src/<warehouse>/mod.rs` | Credential resolution — reads config fields, env vars, key files, tokens; builds the ADBC connection URI and credentials | **Yes** |
| `src/<warehouse>/init.rs` | Init SQL generation — SQL that must run when the connection opens (e.g. `USE SCHEMA`, `SET` statements, extension loading) | Optional — only for warehouses that need to run SQL on connection open. Most warehouses don't need this. |
| `src/lib.rs` | Register the new module with `mod <warehouse>;` and wire it into the auth dispatch match | **Yes** |

The auth module turns a `DbConfig` into a live, authenticated ADBC connection. At minimum you need basic credential handling. More sophisticated auth (OAuth, SSO, key-pair) can be added incrementally.

The pattern is: read config fields → construct URI → call `builder.with_parse_uri(uri)`, `builder.with_username(user)`, `builder.with_password(password)`.

### 4.5 — Build the adapter layer

**Crate:** `crates/dbt-adapter/`

This is the largest step. You're adding warehouse-specific behavior to the shared adapter layer via `match adapter_type()` arms.

:::tip Simple vs. complex adapters
Most adapters — including Exasol, Athena, Trino, Starburst, Dremio, Oracle, and ClickHouse — add match arms directly to the shared files in `src/relation/`.

Only adapters with highly custom relation logic (Snowflake's multi-part names and case rules; BigQuery's project/dataset structure) have their own subdirectory under `src/relation/`.

If your warehouse uses standard `schema.table` or `database.schema.table` naming with straightforward quoting, you're likely a simple adapter. Start simple and only add complexity if the compiler forces it.
:::

#### Relation type and quoting

:::note
The relation crate is currently being verticalized — `Policy` is moving from `relation_object.rs` to `relation_impl.rs`. Verify file paths against the current repo before using them.
:::

**File:** `src/relation/relation_object.rs`

Add a match arm that constructs a `Relation` with your quoting policy. The policy controls three things: whether the database is included in fully-qualified names, whether the schema is quoted, and whether the identifier is quoted.

For example, Exasol uses a 2-part name (`schema.table`, no database prefix) and quotes both:

```rust
// src/relation/relation_object.rs
Exasol => Box::new(Relation::new_with_policy(
    Exasol,
    RelationPath {
        database: Some(database).filter(|s| !s.is_empty()),
        schema: Some(schema),
        identifier,
    },
    relation_type,
    Policy::new(false, true, true),
    //          ↑      ↑     ↑
    //       database schema identifier
    //       disabled quoted  quoted
    custom_quoting,
    None,
    false,
    false,
)) as Box<dyn BaseRelation>,
```

Decide up front whether your warehouse uses 2-part or 3-part names, and whether identifiers are case-sensitive. For example, Exasol uppercases unquoted identifiers by default — so all catalog lookup SQL uses `upper()` comparisons.

**File:** `src/relation/factory.rs`

Add your `AdapterType` to the `create_static_relation` match, wiring it to `RelationStatic` (the generic static relation used for Jinja's `api.Relation`):

```rust
Databricks | Spark | Fabric | DuckDB | Exasol | Postgres | Redshift | Salesforce | Bigquery => {
    let relation_type = RelationStatic { adapter_type, quoting };
    StaticBaseRelationObject::new(Arc::new(relation_type))
}
```

#### Catalog introspection

**File:** `src/metadata/get_relation.rs`

Add a match arm and a function that queries your warehouse's system catalog to look up a single relation by name:

```rust
AdapterType::Exasol => exasol_get_relation(
    adapter, state, ctx, conn, database, schema, identifier, token,
),
```

```rust
fn exasol_get_relation(
    adapter: &AdapterImpl,
    state: &State,
    ctx: &QueryCtx,
    conn: &mut dyn Connection,
    database: &str,
    schema: &str,
    identifier: &str,
    token: CancellationToken,
) -> AdapterResult<Option<Box<dyn BaseRelation>>> {
    let q_schema = schema.to_uppercase();
    let q_ident = identifier.to_uppercase();

    let sql = format!(
        "select 'table' as \"type\" from sys.exa_all_tables \
         where table_schema = '{q_schema}' and table_name = '{q_ident}' \
         union all \
         select 'view' from sys.exa_all_views \
         where view_schema = '{q_schema}' and view_name = '{q_ident}'"
    );
    // execute, read result, return relation
}
```

Use `information_schema` if your warehouse supports standard SQL, or system catalog tables (`sys.*`, `information_schema.*`) as appropriate.

#### Adapter match arms

**File:** `src/adapter/adapter_impl.rs`

After adding `AdapterType::MyWarehouse`, the compiler will enumerate every `match self.adapter_type()` block that needs a new arm. Most arms simply delegate to an existing pattern. For example:

```rust
// Column builder — delegate to postgres-like builder
Exasol => Ok(Self::build_postgres_like(field, type_ops)),

// Schema column name for listing relations
Exasol => "name",

// DATA_TYPE column name in information schema
AdapterType::Exasol => "DATA_TYPE",  // in src/sql_types.rs
```

For capabilities your adapter doesn't support yet (e.g. `valid_incremental_strategies`), return `unimplemented!()` — that's fine for an initial community adapter contribution. The reference PR has several of these.

#### Column builder

**File:** `src/column/column_builder.rs`

Add a match arm for how your warehouse's Arrow record batches map to dbt column objects. Most adapters can delegate to `build_postgres_like`:

```rust
Exasol => Ok(Self::build_postgres_like(field, type_ops)),
```

Only implement custom logic if your warehouse has unusual type handling.

### 4.6 — Write your SQL macros

**Crate:** `crates/dbt-loader/`

Create a new directory at `src/dbt_macro_assets/dbt-<adapter_type>/`.

:::note Registration is automatic
The loader discovers adapter packages by scanning `src/dbt_macro_assets/`. You don't need to add any Rust code to register your directory — creating it and the `dbt_project.yml` is sufficient.
:::

| File | What to do |
|---|---|
| `dbt_macro_assets/dbt-<warehouse>/dbt_project.yml` | Adapter plugin project definition: `name: dbt_<warehouse>`, `macro-paths: ["macros"]` |
| `macros/adapters.sql` | Core adapter macros: `create_schema`, `drop_schema`, `drop_relation`, `rename_relation`, `truncate_relation`, `create_table_as`, `create_view_as`, `list_schemas`, `check_schema_exists`, `information_schema_name`, `current_timestamp`, `get_columns_in_relation`, `list_relations_without_caching` |

v2 uses the same `adapter.dispatch()` pattern as v1. Your macros use the `<warehouse>__` prefix to override defaults:

```sql
{% macro exasol__create_table_as(temporary, relation, sql) -%}
  create or replace table {{ relation }} as (
    {{ sql }}
  )
{%- endmacro %}

{% macro exasol__create_view_as(relation, sql) -%}
  create or replace view {{ relation }} as (
    {{ sql }}
  )
{%- endmacro %}

{% macro exasol__drop_relation(relation) -%}
  {% call statement('drop_relation', auto_begin=False) -%}
    drop {{ relation.type }} if exists {{ relation }} cascade
  {%- endcall %}
{% endmacro %}

{% macro exasol__rename_relation(from_relation, to_relation) -%}
  {% call statement('rename_relation') -%}
    rename {{ from_relation.type }} {{ from_relation }} to {{ to_relation.identifier }}
  {%- endcall %}
{% endmacro %}
```

Note: `rename_relation` uses only `to_relation.identifier`, not the full relation — Exasol's `RENAME` syntax doesn't take a fully qualified target.

For catalog introspection, use your warehouse's system catalog. For example, Exasol queries `sys.*` instead of `information_schema`:

```sql
{% macro exasol__list_relations_without_caching(schema_relation) -%}
  {% call statement('list_relations_without_caching', fetch_result=True) -%}
    select
      '{{ schema_relation.database }}' as "database",
      table_name as "name",
      table_schema as "schema",
      'table' as "type"
    from sys.exa_all_tables
    where upper(table_schema) = upper('{{ schema_relation.schema }}')
    union all
    select
      '{{ schema_relation.database }}' as "database",
      view_name as "name",
      view_schema as "schema",
      'view' as "type"
    from sys.exa_all_views
    where upper(view_schema) = upper('{{ schema_relation.schema }}')
  {%- endcall %}
  {{ return(load_result('list_relations_without_caching').table) }}
{%- endmacro %}

{% macro exasol__information_schema_name(database) -%}
  sys
{%- endmacro %}
```

If your warehouse is similar to an existing one (e.g. Postgres-compatible), start by delegating to that dialect's macros and only override where behavior differs:

```sql
{% macro mywarehouse__create_table_as(temporary, relation, sql) -%}
  {{ return(postgres__create_table_as(temporary, relation, sql)) }}
{%- endmacro %}
```

---

## Step 5: Test your adapter

### Type check after each crate

Run the type checker after completing work in each crate to catch missed match arms and type errors:

```bash
cargo build -p dbt-adapter-core
cargo build -p dbt-xdbc
cargo build -p dbt-schemas
cargo build -p dbt-auth
cargo build -p dbt-adapter
cargo build -p dbt-loader
```

### End-to-end test

Run a real `dbt build` against your warehouse. At minimum, exercise table, view, incremental, and snapshot materializations. A clean `dbt build` on `jaffle-shop-classic` is the standard acceptance bar for a community adapter.

```bash
# Build the CLI
cargo build --bin dbt

# Create a test project (or clone jaffle-shop-classic)
./target/debug/dbt init

# Run against your warehouse
./target/debug/dbt build --project-dir <your-project>
```

### CI testing

CI testing for community adapter PRs is coordinated with the dbt Labs adapters team — the test infrastructure is not publicly distributed. When your PR is ready, reach out in `#adapter-ecosystem` and the adapters team will work with you on warehouse validation.

:::caution Known gap: CI requires coordination
Community contributors cannot run CI independently. dbt Labs' CI pipeline requires warehouse credentials for the target warehouse — which means dbt Labs needs access configs for whatever warehouse you're contributing. The process for this handoff is still being defined. Expect to coordinate closely with the adapters team. If you hit friction, flag it in `#adapter-ecosystem`.
:::

---

## Step 6: Document your adapter

Once your adapter is merged and available in a release, document it so users can find and configure it.

### Write a setup guide

Document the `profiles.yml` configuration for your warehouse — what fields are required, what's optional, and example values. Follow the format of existing adapter setup guides on [docs.getdbt.com](http://docs.getdbt.com).

:::caution Driver installation is critical to document
Unlike first-party adapters, your users won't get the driver automatically — Fusion won't download it for them. Your setup guide must explain where to get the driver binary and how to install it so Fusion can find it at runtime. Without this, users will configure a valid profile and still get a connection error. Include the exact library name Fusion looks for (e.g. `libadbc_driver_<yourwarehouse>.dylib`) and where to put it.
:::

### General documentation guidelines

- Assume the reader knows dbt fundamentals but is not an expert on your warehouse inner workings.
- Include a complete working `profiles.yml` example.
- Document any warehouse-specific quirks (e.g. 2-part vs 3-part naming, identifier case sensitivity).
- Link to the warehouse vendor's ADBC driver documentation.

---

## Step 7: Promote your adapter

:::caution Your PR must be merged first
dbt Labs reviews and merges community adapter PRs into dbt-core. Wait until the PR is merged and the adapter ships in a published release before directing users to it.
:::

### Community channels

Join the dbt Community Slack and find:
- **`#adapter-ecosystem`** — the main channel for adapter developers
- **`#db-<yourwarehouse>`** — if a channel exists for your warehouse, let users know v2 support is available. Note: v1 adapter users will still be on the Python-based adapter and will need to migrate.
- **`#proj-isv-adapters-in-fusion`** — ping the dbt Labs adapters team here once your PR is up for review.

### Before you announce

Align with the adapters team on: which materializations you're targeting in the initial implementation, any known gaps in your ADBC driver, and timeline. This prevents surprises during review and sets accurate expectations for users.

---

## Reference: File-by-file implementation guide

A community contributed v2 adapter touches roughly 13 files, all in the public [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core) repo. The "Exasol example" column shows what it looks like in practice — substitute your warehouse name and system catalog throughout.

| Generic path | What it does | Exasol example |
|---|---|---|
| `.changes/unreleased/Features-*.yaml` | Changelog entry | Same for all adapters |
| `crates/dbt-adapter-core/src/lib.rs` | Add `AdapterType::<Warehouse>` variant and `quote_char` arm | `AdapterType::Exasol` |
| `crates/dbt-xdbc/src/driver.rs` | Add `Backend::<Warehouse>` variant — the ADBC library name and FFI protocol | `Backend::Exasol`, library name `"adbc_driver_exasol"` |
| `crates/dbt-schemas/src/schemas/profiles.rs` | `<Warehouse>DbConfig` struct + `DbConfig::<Warehouse>` variant, wired into all config match arms | `ExasolDbConfig` struct + `DbConfig::Exasol` variant |
| `crates/dbt-auth/src/<warehouse>/mod.rs` | Auth module — reads config fields, resolves credentials, constructs connection URI | `src/exasol/mod.rs` — builds URI from host, port, user/pass, TLS options |
| `crates/dbt-adapter/src/adapter/adapter_impl.rs` | All exhaustive `match adapter_type()` arms — most delegate to existing patterns; use `unimplemented!()` for unimplemented features | Exasol adds ~10 arms, most are 1–2 lines |
| `crates/dbt-adapter/src/column/column_builder.rs` | Column builder match arm — maps Arrow record batches to dbt column objects | `Exasol => Ok(Self::build_postgres_like(...))` |
| `crates/dbt-adapter/src/metadata/get_relation.rs` | Catalog lookup function — queries system tables to find a relation by name | `exasol_get_relation()` — queries `sys.exa_all_tables` / `sys.exa_all_views` |
| `crates/dbt-adapter/src/relation/relation_object.rs` | Match arm — quoting policy and whether database prefix is included in fully-qualified names | `Policy::new(false, true, true)` — database disabled, schema + identifier quoted |
| `crates/dbt-adapter/src/relation/factory.rs` | Add warehouse to `RelationStatic` arm in `create_static_relation` | Exasol added alongside Postgres, Redshift, DuckDB, etc. |
| `crates/dbt-adapter/src/sql_types.rs` | Metadata column name arms — `DATA_TYPE` and schema listing column names | Exasol uses standard `DATA_TYPE` column name |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/dbt_project.yml` | Macro plugin project definition | `dbt-exasol/dbt_project.yml` |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/macros/adapters.sql` | All required adapter macros | `dbt-exasol/macros/adapters.sql` — uses `sys.*` instead of `information_schema` |

## Reference: Useful commands

```bash
# Type check a specific crate
cargo build -p <crate-name>

# Build the CLI binary
cargo build --bin dbt

# Run a full dbt build against your warehouse
./target/debug/dbt build --project-dir <your-project>

# Free disk space
cargo clean
```
