---
title: "Contribute a dbt Core v2 adapter"
id: adapter-creation-v2
description: "Learn how to contribute a new community adapter to the dbt Core v2 Rust monorepo, from ADBC driver registration to SQL macros."
hoverSnippet: "Step-by-step guide to contributing a community adapter to dbt Core v2, including crate structure, Rust patterns, and Jinja macros."
icon: 'guides'
hide_table_of_contents: false
tags: ['Adapter creation']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

:::info
This guide is for <Constant name="core_v2" />. For <Constant name="core_v1" />, see [Build, test, document, and promote adapters](/guides/adapter-creation).
:::

## Step 1: Introduction

dbt Core v2 adapters work very differently from v1, and it's worth understanding why before diving in.

In dbt Core v1, every adapter was a **standalone Python package**, independently maintained by the community. That model didn't scale: maintenance cost grew with every new warehouse added, bugs had to be fixed separately in each package, and shared improvements rarely made it back across the ecosystem.

dbt Core v2 flips this entirely. Adapters now live **inside a single Rust monorepo**, organized by feature area rather than by warehouse. A fix in the auth module benefits every adapter at once. When you contribute a new adapter, you're extending shared code, not building a whole new package from scratch. In Rust terms: adding arms to *existing* match expressions. The more adapters that exist, the easier each new adapter becomes. Your contribution makes the whole ecosystem better.

Another advantage of dbt Core v2: connection management lives in its own lane outside of the adapter. In v1, each adapter had to own its connection logic, wrapping vendor SDKs or implementing the Python DB API spec. **In v2, ADBC drivers handle that responsibility**: pre-compiled binaries that you register but don't write. For a full explanation of ADBC and how dbt Core v2 uses it, see [ADBC in dbt Core v2](/docs/fusion/adbc?version=2.0).

What you need to contribute is the exact logic that varies by warehouse: credentials, relation naming, macros, and catalog queries. A complete community adapter touches ~13 files; that's the bar we're aiming for.

This guide walks you through the architecture, crate structure, and how to contribute a dbt Core v2 adapter step by step. I’m Hope Watson, product manager for dbt Core v2 adapters at dbt Labs, and I put this together to help design, document, and shepherd this process for the community in the v2 world. 

The Exasol adapter, contributed by [Marco Nätlitz](https://www.linkedin.com/in/marco-naetlitz/), is used as the reference example throughout. The full file breakdown in the [reference section](#reference-file-by-file-implementation-guide) defines exactly what you're building.

### How v1 vs. v2 adapters differ

| Topic | dbt Core v1 | dbt Core v2 |
|-------|-------------|-------------|
| **Package structure** | Separate Python packages (e.g. `dbt-snowflake`, `dbt-bigquery`), each inheriting from `dbt-adapters` | Part of the `dbt-core` monorepo, contributed as PRs |
| **Who maintains them** | dbt Labs maintains base adapter and 6 major adapters; others community-maintained independently | dbt Labs maintains the monorepo; community contributes via PRs |
| **Language** | Python | Rust (with Jinja SQL macros still used for SQL logic) |
| **How they load** | Dynamically loaded at runtime via Python's plugin system | Compiled into the monorepo binary |
| **Connection management** | Each adapter implements its own connection logic, built on vendor Python SDK connectors/drivers | ADBC drivers handle connection management: a unified driver interface that abstracts away wire protocol details |
| **Code organization** | Organized by warehouse, each adapter is its own isolated codebase | Organized by feature area (vertical): a fix in one crate benefits all adapters |

### What you're building

As a community contributor, you're building the foundation: connect your warehouse, run dbt macros, and support basic materializations. Once your adapter is in place, `dbt build` and `dbt run` should work. The ~13 files in the [reference section](#reference-file-by-file-implementation-guide) define the complete scope.

Think of your adapter contribution as the bridge between dbt Core v2 and your warehouse: everything dbt needs to talk to it, nothing more. The architecture diagram below shows where your work fits in the stack.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-architecture.svg" title="dbt Core v2 adapter architecture diagram showing the community contribution zone within the monorepo, the ADBC C ABI boundary, the ADBC driver, and the warehouse" />

## Step 2: Prerequisites

**Rust familiarity**: You don't need to be a Rust expert. You need to read Rust, understand enum match expressions, and make sense of compiler errors. If Rust is new to you, skim [The Rust Book](https://doc.rust-lang.org/book/) Chapter 6 (enums and pattern matching). Those are the concepts you'll encounter most.

**dbt fundamentals**: Understand how [`profiles.yml`](/docs/local/profiles.yml) works, what [materializations](/docs/build/materializations) are, and what [adapter dispatch](/reference/dbt-jinja-functions/dispatch) macros do.

**Deep knowledge of your warehouse**: As you work through this guide, you'll need to know how your warehouse behaves:
- What character does it use for quoting identifiers?
- Does it support two-part or three-part relation names?
- What connection parameters does it require?
- How does it handle transactions?
- What datatypes map to standard SQL types like string, timestamp, boolean?
- What's the most efficient way to list columns in a schema?

**A note on AI-assisted development**: dbt Core v2's architecture is naturally legible to AI coding tools. Match arms are explicit, compiler errors are precise, and the scope of each file is narrow. You don't need to use an LLM, but if you do, the structure works in your favor.

### Your ADBC driver

*Do you have an ADBC driver for your warehouse? If no, stop here.* The ADBC driver is a firm requirement before creating a dbt Core v2 adapter.

Check these sources to find out if one exists for your warehouse:
- [apache/arrow-adbc](https://github.com/apache/arrow-adbc): upstream community repo
- [dbt-labs/arrow-adbc](https://github.com/dbt-labs/arrow-adbc): the dbt Labs fork
- [ADBC driver foundry](https://github.com/adbc-drivers): primary community home for ADBC drivers, with active drivers and Rust/Go frameworks for building new ones
- Your warehouse vendor's own GitHub org

If no driver exists yet, building one is a separate project that comes before the adapter contribution. This is outside the scope of dbt Labs. [Columnar](https://columnar.tech/) specializes in building ADBC drivers and may be a useful resource.

:::note Long-term: signed driver distribution
dbt Labs is working toward a model where community drivers can be distributed and loaded safely via signed binaries, similar to how operating systems verify installers. The goal is to make third-party driver installation as seamless and trustworthy as first-party. This isn't in place yet, but dbt Labs is considering this direction.
:::

## Step 3: Understanding the codebase shape before you build

### The vertical model

dbt Core v2 organizes adapter logic by *capability*, not by warehouse. There's no `SnowflakeAdapter` class, no `BigQueryAdapter` class. Instead, a single shared codebase handles all warehouses, with warehouse-specific behavior driven by `match adapter_type()` expressions. When you add a new warehouse, you're adding arms to those expressions across a set of feature areas, auth, relations, catalog introspection, Jinja macros, rather than creating a new top-level package.

The structural diagram below shows how the layers fit together. Your work lives in the **ADAPTER** layer: the crates that handle warehouse identity, credential resolution, relation logic, and Jinja dispatch. XDBC (driver loading and connection pooling) sits just below and has a small registration step too.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-structural.svg" title="dbt Core v2 system layers diagram showing USER, CLI, PIPELINE, TASK RUNNER, ADAPTER (highlighted as the contribution zone), XDBC, and WAREHOUSE layers" />

### Crate map

In Rust, a **crate** is a package: the unit of compilation, roughly equivalent to a "library" or "module" in other languages. The `dbt-core` repo is a monorepo of multiple crates, each responsible for one vertical slice of functionality across all warehouses. This is a quick-reference map of the six crates you'll touch to build your adapter, in the order you'll work through them in Step 5.

| Crate | Location | What you touch |
|-------|----------|----------------|
| `dbt-adapter-core` | `crates/dbt-adapter-core/` | `AdapterType` enum variant, `quote_char` arm |
| `dbt-xdbc` | `crates/dbt-xdbc/` | ADBC driver registration (`Backend` enum, library name) |
| `dbt-schemas` | `crates/dbt-schemas/` | `profiles.yml` config struct (`DbConfig` variant) |
| `dbt-auth` | `crates/dbt-auth/` | Credential resolution, connection URI construction |
| `dbt-adapter` | `crates/dbt-adapter/` | Relation quoting, metadata catalog queries, adapter match arms, column builder, sql_types |
| `dbt-loader` | `crates/dbt-loader/` | Jinja SQL macros (`dbt_macro_assets/dbt-<adapter>/`) |

### Where your adapter fits in the execution model

By the time your adapter is invoked, all the dbt work is already done. dbt has resolved `ref()` and `source()` calls, rendered every Jinja template, and produced dialect-specific SQL. Your adapter receives a finished string and executes it.

:::tip The adapter never sees un-rendered SQL
dbt resolves `ref()`, renders Jinja, and hands your adapter a finished string. You execute it; you don't template it.
:::

While you're coding, the compiler enforces completeness. When you add `AdapterType::MyWarehouse` to the enum, every `match adapter_type()` block that doesn't handle it fails at that exact line. Your to-do list is always visible. For example:

```rust
// You add your variant to the enum in dbt-adapter-core:
pub enum AdapterType {
    Snowflake,
    BigQuery,
    DuckDb,
    Trino,
    MyWarehouse,  // ← you added this
}

// Now every match block in the codebase must handle it.
// This one in adapter_impl.rs doesn't yet:
match self.adapter_type() {
    AdapterType::Snowflake => { ... }
    AdapterType::BigQuery => { ... }
    AdapterType::DuckDb => { ... }
    AdapterType::Trino => { ... }
    // missing MyWarehouse → compile error
}
```

```text
error[E0004]: non-exhaustive patterns: `AdapterType::MyWarehouse` not covered
  --> crates/dbt-adapter/src/adapter/adapter_impl.rs:142:18
   |
   |     match self.adapter_type() {
   |           ^^^^^^^^^^^^^^^^^^^ pattern `AdapterType::MyWarehouse` not covered
```

Each failure is a concrete implementation task.

### Are you porting an existing v1 adapter?

No v1 adapter? Skip to [Step 4](#step-4-development-machine-setup). If you're porting, use this map to see exactly what transfers, what needs rethinking, and what dbt Labs now owns for you in v2.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-blocks.svg" title="Diagram showing which v1 adapter components map directly to v2 (green), require rethinking (purple), or are absorbed by dbt Labs or the ADBC driver (red)" />

Most community contributors aren't building from scratch, they're porting an adapter they already maintain or use in Python for dbt Core v1. If that's you, **you have a significant head start**, and this is the most realistic path for the vast majority of contributors.

Before writing any Rust, check a couple of things:

1. Does a v1 adapter already exist for your warehouse?

Check the [trusted adapters](/docs/trusted-adapters) and [community adapters](/docs/community-adapters) lists. If one exists, find its GitHub repo: the macro SQL and connection logic are almost directly reusable.

2. Did dbt Labs already add a placeholder for your warehouse?

Some warehouses already appear in v2's `AdapterType` enum but aren't fully implemented yet: the enum variant exists, which means the boilerplate is partially in place. When you add the remaining code, the compiler shows you exactly what's still missing. The warehouses in this state are:

| Warehouse | v1 adapter | dbt Core v2 status |
|-----------|------------|-------------------|
| Athena | [dbt-athena](https://github.com/dbt-athena/dbt-athena) (trusted) | `AdapterType::Athena` exists: needs auth, macros, adapter arms |
| Trino | [dbt-trino](https://github.com/starburstdata/dbt-trino) (trusted) | `AdapterType::Trino` exists: needs auth, macros, adapter arms |
| Starburst | [dbt-trino](https://github.com/starburstdata/dbt-trino) (trusted) | `AdapterType::Starburst` exists: needs auth, macros, adapter arms |
| Dremio | [dbt-dremio](https://github.com/dremio/dbt-dremio) (trusted) | `AdapterType::Dremio` exists: needs auth, macros, adapter arms |
| Oracle | [dbt-oracle](https://github.com/oracle/dbt-oracle) (trusted) | `AdapterType::Oracle` exists: needs auth, macros, adapter arms |

For warehouses not yet in `AdapterType` at all (MySQL, Hive, Vertica, SQL Server, Teradata, etc.), you start from Step 5.1 by adding the `AdapterType` variant.

#### What transfers from v1 to v2

| v1 component | Where it goes in v2 | Notes |
|--------------|---------------------|-------|
| `macros/adapters.sql` | `dbt-loader/.../dbt-<wh>/macros/adapters.sql` | Mostly a direct port, same `<wh>__` dispatch prefix, same macro names, same Jinja patterns |
| `macros/catalog.sql` | Same location | The catalog SQL (`list_relations_without_caching`, `get_catalog`) transfers almost verbatim |
| Custom materializations and adapter-overrides | Same location | Look out for Jinja that might not yet be supported in dbt Core v2; that will need to be addressed separately |
| Profile fields in `credentials.py` / `profile_template.yml` | `DbConfig` struct in `dbt-schemas` | Each profile field becomes a struct field: optional fields use `Option<T>` |
| Connection URI / DSN construction in `connections.py` | `dbt-auth/src/<wh>/mod.rs` | The URI building logic maps cleanly to the auth module pattern |
| `BaseRelation.quote_policy` / identifier casing behavior | `include_policy()` in `crates/dbt-adapter/src/relation/relation_impl.rs`, `Policy` is a type alias for `ResolvedQuoting` defined in `crates/dbt-schemas/src/schemas/relations/base.rs` | The 3-part vs. 2-part name structure and quote flags map 1:1 to the dbt Core v2 `Policy` struct |
| Catalog introspection SQL in macros and `adapter.py` | `get_relation.rs` and Jinja macros | The system catalog table names and queries you already know transfer directly |

#### What doesn't transfer by design

Four categories of v1 code simply don't exist in v2, which means less code to port:
- **Connection management**: In v1 you owned the full connection lifecycle against the Python DB API. In v2 the ADBC driver handles this entirely; skip anything related to cursors, retries, or connection pooling.
- **Query execution**: Shared Rust infrastructure handles raw query plumbing (`execute`, `add_query`). You don't implement it.
- **Adapter class hierarchy**: The Python subclass structure is replaced by shared Rust match expressions. You register your adapter; you don't implement execution logic.
- **Packaging and distribution**: No `setup.py`, no PyPI release. dbt Labs ships your adapter once the PR is merged.

## Step 4: Development machine setup

```shell
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

```shell
brew install pkg-config z3
```

If disk fills during build:

```shell
cargo clean  # frees old build artifacts; you'll do this often
```

### Development workflow

The core development loop is the same whether you write code manually or with an AI assistant:

1. Add `AdapterType::MyWarehouse` to the enum (Step 5.1)
2. Run `cargo build -p <crate>`: the compiler lists every match arm missing for your new variant
3. Use the compiler output + the file you're editing + the equivalent reference file (from the breakdown at the bottom) to write each arm. If using an AI assistant, paste all three in as context.
   - *Example:* to fill in the `quote_char` arm, paste the error listing `AdapterType::MyWarehouse` as missing, the `quote_char` match block from `dbt-adapter-core/src/lib.rs`, and the Exasol line (`Exasol => '"'`) as the pattern to follow.
4. Fill in the arm; verify with `cargo build` again
5. Repeat for each crate until error-free

Every missing case is a compile error, so an AI assistant always has a precise specification to work from.

What context helps for each arm:
- **The file you're editing**: paste the relevant `match` block or function. For example, the `match self.adapter_type()` block from `adapter_impl.rs` that needs a new arm.
- **The equivalent reference file** from the breakdown below. For example, when writing your auth module, paste `crates/dbt-auth/src/exasol/mod.rs` as the pattern.
- **The compiler error output.** For example: `error[E0004]: non-exhaustive patterns: AdapterType::MyWarehouse not covered`
- **Your warehouse's specifics**: system catalog table names and the connection fields from your `profiles.yml`.

Watch out for:
- **Hallucinated file paths**: AI often invents dbt Core v2 paths. Use the file breakdown below as ground truth.
- **Always verify with the type checker**: run `cargo build -p <crate>` after any AI-generated changes.
- **SQL macro patterns from v1** may not apply cleanly in dbt Core v2. Compare against the reference `adapters.sql` at `crates/dbt-loader/src/dbt_macro_assets/dbt-exasol/macros/adapters.sql` in [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core).

## Step 5: Build a new adapter

This step walks you through each crate you need to touch. Work through them in order. Each builds on the last. After each sub-step, run the type checker to catch missed match arms and type errors:

```shell
cargo build -p <crate-name>
```

Replace `<crate-name>` with the crate you just edited, for example `dbt-adapter-core`, `dbt-xdbc`, `dbt-schemas`, `dbt-auth`, `dbt-adapter`, or `dbt-loader`.

### 5.1: Register the adapter type

**Crate:** `crates/dbt-adapter-core/`

`AdapterType` is the central enum that identifies your warehouse throughout the entire codebase. Add your variant here first.

Rust's `match` expressions must handle every possible variant explicitly. So when you add `AdapterType::MyWarehouse`, every `match adapter_type()` block that doesn't handle your variant becomes a **compile error**. Run `cargo build -p <crate>` and the compiler hands you a complete list of exactly what still needs to be written. Nothing is hidden or implicit.

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

### 5.2: Register the ADBC driver

**Crate:** `crates/dbt-xdbc/`

Your driver already exists (covered in Step 2). This step is where you register it so dbt Core v2 knows its library name and how to load it at runtime.

| File | What to do | Required? |
|-------|-----------|-----------|
| `src/driver.rs` | Add a variant to the `Backend` enum; add the ADBC library name (e.g. `"adbc_driver_exasol"`) and FFI protocol; also define a `LoadStrategy` | **Yes** |
| `src/install.rs` | Add CDN download URL and platform strings | No, only for drivers distributed via the dbt Labs CDN, which requires separate coordination with dbt Labs |

The `Backend` enum maps to the ADBC shared library name (`lib<name>.so` / `<name>.dll` / `lib<name>.dylib`). You're registering its identity so dbt Core v2 knows what to load. You're not writing the driver here.

#### CDN-distributed vs. manual install

For these 11 adapters, dbt Core v2 automatically downloads the driver on first use. All other adapters require manual installation. Users take one extra setup step. Make this clear in your documentation (Step 7).

| On the CDN: auto-downloaded |
|---|
| Snowflake, BigQuery, ClickHouse, Postgres, Databricks, Redshift, DuckDB, DuckDB Extended, Salesforce, Spark, SQL Server |

For **custom Arrow type mappings** (for example, DuckDB needed this for `HUGEINT`, `UTINYINT`): only add warehouse-specific type handling if your driver returns types that Arrow's standard schema doesn't cover. Most warehouses don't need this.

### 5.3: Add your connection profile

**Crate:** `crates/dbt-schemas/`

| File | What to do |
|------|------------|
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

After adding the config struct, also add `DbConfig::MyWarehouse(Box<MyWarehouseDbConfig>)` as a new variant to the `DbConfig` enum. The compiler will then point you at every place that reads from `DbConfig` and needs a new case for your warehouse. Follow those errors to wire it in.

### 5.3.1: Add `dbt init` profile generation (optional but strongly encouraged)

This is what makes your adapter easy to use. When someone runs `dbt init` and selects your warehouse, they get a guided prompt that builds their `profiles.yml`, without documentation hunting or manual YAML editing.

Add support in `crates/dbt-init/`:

1. Register your adapter in `get_available_adapters()` in `crates/dbt-init/src/profile_setup.rs`:

```rust
pub fn get_available_adapters() -> &'static [AdapterType] {
    &[
        // ... existing adapters ...
        AdapterType::MyWarehouse,  // ← add this
    ]
}
```

2. Create a config file `crates/dbt-init/src/adapter_config/<warehouse>_config.rs` implementing `InteractiveSetup` for your `DbConfig` struct: define the fields `dbt init` should prompt for and a `set_field()` handler. See `postgres_config.rs` as a minimal reference.

3. Export it from `crates/dbt-init/src/adapter_config/mod.rs`:

```rust
pub mod mywarehouse_config;
pub use mywarehouse_config::setup_mywarehouse_profile;
```

4. Add a match arm in `create_profile_for_adapter()` in `profile_setup.rs`:

```rust
AdapterType::MyWarehouse => {
    let config = match existing_config {
        Some(DbConfig::MyWarehouse(c)) => Some(c),
        _ => None,
    };
    DbConfig::MyWarehouse(setup_mywarehouse_profile(config.map(Box::as_ref))?)
}
```

### 5.4: Add authentication

**Crate:** `crates/dbt-auth/`

| File | What to do | Required? |
|------|------------|-----------|
| `src/<warehouse>/mod.rs` | Credential resolution, reads config fields, env vars, key files, tokens; builds the ADBC connection URI and credentials | **Yes** |
| `src/<warehouse>/init.rs` | Init SQL generation, SQL that must run when the connection opens (e.g. `USE SCHEMA`, `SET` statements, extension loading) | Optional, only for warehouses that need SQL on connection open. Most don't. |
| `src/lib.rs` | Register the new module with `mod <warehouse>;` and wire it into the auth dispatch match | **Yes** |

The auth module turns a `DbConfig` into a live, authenticated ADBC connection. At minimum you need basic credential handling. More sophisticated auth (OAuth, SSO, key-pair) can be added incrementally.

The pattern is: read config fields → construct URI → call `builder.with_parse_uri(uri)`, `builder.with_username(user)`, `builder.with_password(password)`.

### 5.5: Build the adapter layer

**Crate:** `crates/dbt-adapter/`

This is the largest step. You're adding warehouse-specific behavior to the shared adapter layer via `match adapter_type()` arms.

:::tip Simple vs. complex adapters
Most adapters, including Exasol, Athena, Trino, Starburst, Dremio, Oracle, and ClickHouse, add match arms directly to the shared files in `src/relation/`.

Only adapters with highly custom relation logic (Snowflake's multi-part names and case rules; BigQuery's project/dataset structure) have their own subdirectory under `src/relation/`.

If your warehouse uses standard `schema.table` or `database.schema.table` naming with straightforward quoting, you're a simple adapter. Start simple and only add complexity if the compiler forces it.
:::

#### Relation type and quoting

**File:** `crates/dbt-adapter/src/relation/relation_impl.rs`

Add a match arm that sets your quoting policy. The policy controls three things: whether the database is included in fully-qualified names, whether the schema is quoted, and whether the identifier is quoted.

For example, Exasol uses a 2-part name (`schema.table`, no database prefix) and quotes both:

```rust
// crates/dbt-adapter/src/relation/relation_impl.rs
fn include_policy(adapter_type: AdapterType, path: &RelationPath) -> Policy {
    match adapter_type {
        // ... existing adapters ...
        AdapterType::MyWarehouse => Policy::new(false, true, true),
        //                                      ↑      ↑     ↑
        //                                   database schema identifier
        //                                   disabled quoted  quoted
        _ => Policy::trues(), // default: all parts included and quoted
    }
}
```

Decide up front whether your warehouse uses 2-part or 3-part names, and whether identifiers are case-sensitive. For example, Exasol uppercases unquoted identifiers by default, so all catalog lookup SQL uses `upper()` comparisons.

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

Add a match arm and a function that queries your warehouse's system catalog to look up a single relation by name. Follow the reference implementations closely. This area of the codebase is expected to evolve:

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
// Column builder: delegate to postgres-like builder
Exasol => Ok(Self::build_postgres_like(field, type_ops)),

// Schema column name for listing relations
Exasol => "name",

// DATA_TYPE column name in information schema
AdapterType::Exasol => "DATA_TYPE",  // in src/sql_types.rs
```

For capabilities your adapter doesn't support yet (like `valid_incremental_strategies`), return `unimplemented!()`. That's fine for an initial community adapter contribution.

#### Column builder

**File:** `src/column/column_builder.rs`

Add a match arm for how your warehouse's Arrow record batches map to dbt column objects. Most adapters can delegate to `build_postgres_like`:

```rust
Exasol => Ok(Self::build_postgres_like(field, type_ops)),
```

Only implement custom logic if your warehouse has unusual type handling.

### 5.6: Write your SQL macros

**Crate:** `crates/dbt-loader/`

Create a new directory at `src/dbt_macro_assets/dbt-<adapter_type>/`.

:::note Registration is automatic
The loader discovers adapter packages by scanning `src/dbt_macro_assets/`. You don't need to add any Rust code to register your directory. Creating it and the `dbt_project.yml` is sufficient.
:::

| File | What to do |
|------|------------|
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

Note: `rename_relation` uses only `to_relation.identifier`, not the full relation. Exasol's `RENAME` syntax doesn't take a fully qualified target.

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


## Step 6: Test your adapter

### Type check after each crate

Run the type checker after completing work in each crate to catch missed match arms and type errors immediately:

```shell
cargo build -p dbt-adapter-core
cargo build -p dbt-xdbc
cargo build -p dbt-schemas
cargo build -p dbt-auth
cargo build -p dbt-adapter
cargo build -p dbt-loader
```

### Smoke testing with a dbt project

Run a real `dbt build` against your warehouse and ensure it builds error-free. At minimum, exercise table, view, incremental, and seed materializations. A clean `dbt build` on [jaffle-shop](https://github.com/dbt-labs/jaffle-shop) is one example of an acceptance bar for a community adapter.

```shell
# Build the CLI
cargo build --bin dbt

# Create a test project (or clone jaffle-shop)
./target/debug/dbt init

# Run against your warehouse
./target/debug/dbt build --project-dir <your-project>
```

### CI testing

CI testing for community adapter PRs is coordinated with the dbt Labs adapters team: the test infrastructure is not publicly distributed. When your PR is ready, reach out in `#adapter-ecosystem` on the [dbt Community Slack](https://community.getdbt.com/), tag Hope Watson (`@Hope Watson (dbt Labs)`), and the adapters team will work with you on warehouse validation. Note that this may take some time and coordination.

:::caution Known gap: CI requires coordination
Community contributors cannot run CI independently. dbt Labs' CI pipeline requires certain checks. For certain adapters, that means warehouse credentials. dbt Labs is still defining this handoff process for dbt Core v2. Expect to coordinate closely with the adapters team, for the approval process to take some time, and for some back-and-forth. If you hit friction, flag it in `#adapter-ecosystem`.
:::

## Step 7: Document your adapter

Once your adapter is merged and available in a release, document it so users can find and configure it.

### Write a setup guide

Document the `profiles.yml` configuration for your warehouse: what fields are required, what's optional, and example values. Follow the format of existing [adapter setup guides](/docs/local/connect-data-platform/about-dbt-connections?version=2.0).

:::caution Driver installation is critical to document
Unlike adapters distributed via the CDN, your users won't get the driver automatically: dbt Core v2 won't download it for them. Your setup guide must explain where to get the driver binary and how to install it so dbt Core v2 can find it at runtime. Without this, users will configure a valid profile and still get a connection error. Include the exact library name dbt Core v2 looks for (e.g. `libadbc_driver_<yourwarehouse>.dylib`) and where to put it.
:::

### General documentation guidelines

- Assume the reader knows dbt fundamentals but is not an expert on your warehouse's inner workings.
- Include a complete working `profiles.yml` example.
- Document any warehouse-specific quirks (e.g. 2-part vs 3-part naming, identifier case sensitivity).
- Link to the warehouse vendor's ADBC driver documentation.

## Step 8: Promote your adapter

:::caution Your PR must be merged first
dbt Labs reviews and merges community adapter PRs into dbt-core. Wait until the PR is merged and the adapter ships in a published release before directing users to it.
:::

### Community channels

Join the [dbt Community Slack](https://community.getdbt.com/) and find:
- **`#adapter-ecosystem`**: the main channel for adapter developers
- **`#db-<yourwarehouse>`**: if a channel exists for your warehouse, let users know v2 support is available. Note: v1 adapter users will still be on the Python-based adapter and will need to migrate.

### Before you announce

Align with the adapters team on: which materializations you're targeting in the initial implementation, any known gaps in your ADBC driver, and timeline. This prevents surprises during review and sets accurate expectations for users.

## Reference: File-by-file implementation guide

A community-contributed dbt Core v2 adapter touches roughly 13 files, all in the public [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core) repo. The "Exasol example" column shows what it looks like in practice. Substitute your warehouse name and system catalog throughout.

| Generic path | What it does | Exasol example |
|--------------|--------------|----------------|
| `.changes/unreleased/Features-*.yaml` | Changelog entry | Same for all adapters |
| `crates/dbt-adapter-core/src/lib.rs` | Add `AdapterType::<Warehouse>` variant and `quote_char` arm | `AdapterType::Exasol` |
| `crates/dbt-xdbc/src/driver.rs` | Add `Backend::<Warehouse>` variant: the ADBC library name and FFI protocol | `Backend::Exasol`, library name `"adbc_driver_exasol"` |
| `crates/dbt-schemas/src/schemas/profiles.rs` | `<Warehouse>DbConfig` struct + `DbConfig::<Warehouse>` variant, wired into all config match arms | `ExasolDbConfig` struct + `DbConfig::Exasol` variant |
| `crates/dbt-auth/src/<warehouse>/mod.rs` | Auth module, reads config fields, resolves credentials, constructs connection URI | `src/exasol/mod.rs`, builds URI from host, port, user/pass, TLS options |
| `crates/dbt-adapter/src/adapter/adapter_impl.rs` | All exhaustive `match adapter_type()` arms, most delegate to existing patterns; use `unimplemented!()` for features not yet supported | Exasol adds ~10 arms, most are 1–2 lines |
| `crates/dbt-adapter/src/column/column_builder.rs` | Column builder match arm, maps Arrow record batches to dbt column objects | `Exasol => Ok(Self::build_postgres_like(...))` |
| `crates/dbt-adapter/src/metadata/get_relation.rs` | Catalog lookup function, queries system tables to find a relation by name | `exasol_get_relation()`, queries `sys.exa_all_tables` / `sys.exa_all_views` |
| `crates/dbt-adapter/src/relation/relation_impl.rs` | Add your adapter to the `include_policy()` match, controls whether the database prefix is included and whether parts are quoted | `Policy::new(false, true, true)`, database disabled, schema + identifier quoted. Default `Policy::trues()` includes and quotes all three parts. |
| `crates/dbt-adapter/src/relation/factory.rs` | Add warehouse to `RelationStatic` arm in `create_static_relation` | Exasol added alongside Postgres, Redshift, DuckDB, etc. |
| `crates/dbt-adapter/src/sql_types.rs` | Metadata column name arms, `DATA_TYPE` and schema listing column names | Exasol uses standard `DATA_TYPE` column name |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/dbt_project.yml` | Macro plugin project definition | `dbt-exasol/dbt_project.yml` |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/macros/adapters.sql` | All required adapter macros | `dbt-exasol/macros/adapters.sql`, uses `sys.*` instead of `information_schema` |

## Reference: Useful commands

```shell
# Type check a specific crate
cargo build -p <crate-name>

# Build the CLI binary
cargo build --bin dbt

# Run a full dbt build against your warehouse
./target/debug/dbt build --project-dir <your-project>

# Free disk space
cargo clean
```

</div>
