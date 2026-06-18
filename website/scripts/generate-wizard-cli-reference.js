#!/usr/bin/env node
/*
 * Generates the wizard CLI + slash-command reference by shelling out to the
 * installed wizard binary's --help on every subcommand and parsing the
 * clap-formatted output into Markdown tables.
 *
 * Outputs two committed partials:
 *   website/docs/docs/dbt-ai/_wizard-cli-full-generated.md   (full CLI reference)
 *   website/docs/docs/dbt-ai/_wizard-slash-commands-generated.md
 *
 * IMPORTANT — this script is NOT wired into `prestart`/`prebuild`.
 * The generated files above are committed and treated as the source of truth
 * (their content is reviewed and confirmed by engineering before merge). If the
 * generator ran automatically on `npm start`/`npm run build`, it would rewrite
 * the files against whatever wizard binary happens to be installed locally or
 * in CI (which drifts from the confirmed version), producing spurious diffs.
 *
 * Regenerate deliberately, only when intentionally bumping the documented
 * wizard version, and review the diff before committing:
 *   cd website && npm run generate:wizard-cli
 * Make sure your local `dbt-wizard --version` is the version you intend to
 * document first. See the PR that froze these files for the full workflow.
 */

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const OUT_DIR = path.join(__dirname, '..', 'docs', 'docs', 'dbt-ai');
const OUT_SLASH = path.join(OUT_DIR, '_wizard-slash-commands-generated.md');
const OUT_FULL = path.join(OUT_DIR, '_wizard-cli-full-generated.md');

// GitHub repo + path containing the wizard Rust source that the slash-command
// and CLI references are generated from. These are placeholders until the dbt
// monorepo location is finalized — override them with env vars when running:
//   WIZARD_SOURCE_REPO=dbt-labs/<repo> WIZARD_SLASH_CMD_PATH=<path> npm run generate:wizard-cli
// If the repo can't be fetched, the existing committed files are kept as-is.
const GH_REPO = process.env.WIZARD_SOURCE_REPO || 'dbt-labs/wizard-repo-name';
const GH_REF = process.env.WIZARD_SOURCE_REF || 'main'; // HEAD of main tracks the latest binary
const SLASH_CMD_PATH =
  process.env.WIZARD_SLASH_CMD_PATH || 'wizard/tui/src/slash_command.rs';
const SLASH_CMD_FILE = process.env.WIZARD_SLASH_CMD_FILE || '';

function resolveBinary() {
  for (const candidate of ['dbt-wizard', 'codex']) {
    const r = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}

// Confirm the binary actually responds to --help before we start walking
// the command tree. If it errors out, fail loudly — a half-empty help dump
// would silently produce a doc page missing real commands.
function validateBinary(bin) {
  const r = spawnSync(bin, ['--help'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 4 * 1024 * 1024,
  });
  if (r.status !== 0 || !r.stdout || !/Commands:/.test(r.stdout)) {
    const msg =
      `[generate-wizard-cli] FATAL: \`${bin} --help\` did not return a usable command list.\n` +
      `  exit=${r.status}\n  stderr=${(r.stderr || '').slice(0, 500)}\n` +
      `  Install/upgrade the wizard binary and retry.`;
    throw new Error(msg);
  }
  return r.stdout;
}

function help(bin, args) {
  try {
    return execFileSync(bin, [...args, '--help'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 4 * 1024 * 1024,
    });
  } catch (e) {
    // Real subcommands always emit help; an empty result means the path
    // doesn't exist. Return '' and let the caller skip it.
    return e.stdout ? e.stdout.toString() : '';
  }
}

// Split clap --help into named sections by their header labels.
function splitSections(text) {
  const headers = ['Usage:', 'Arguments:', 'Options:', 'Commands:'];
  const lines = text.split('\n');
  const sections = { description: [], Usage: [], Arguments: [], Options: [], Commands: [] };
  let current = 'description';
  for (const line of lines) {
    const h = headers.find((x) => line.trimEnd() === x || line.startsWith(x));
    if (h) {
      current = h.replace(':', '');
      continue;
    }
    sections[current].push(line);
  }
  return sections;
}

// Parse an Options: or Arguments: block into entry objects.
// clap formats one entry as:
//   `  -x, --xxx <VAL>` on its own line, then description indented further.
function parseEntries(blockLines) {
  const entries = [];
  let cur = null;
  const flush = () => {
    if (cur) {
      cur.desc = cur.desc.replace(/\s+/g, ' ').trim();
      entries.push(cur);
    }
    cur = null;
  };
  for (const raw of blockLines) {
    if (!raw.trim()) {
      flush();
      continue;
    }
    // Entry header: starts at column 2-6 with `-` or `<` or `[`.
    const m = raw.match(/^( {2,6})([-<[].*)$/);
    if (m && raw.search(/\S/) <= 6) {
      flush();
      cur = { signature: m[2].trim(), desc: '' };
    } else if (cur) {
      cur.desc += ' ' + raw.trim();
    }
  }
  flush();
  return entries;
}

function parseCommandsBlock(blockLines) {
  const cmds = [];
  let cur = null;
  const flush = () => {
    if (!cur) return;
    let desc = cur.desc.replace(/\s+/g, ' ').trim();
    const alias = desc.match(/\[aliases:\s*([^\]]+)\]/);
    desc = desc.replace(/\s*\[aliases:[^\]]+\]\s*$/, '').trim();
    cmds.push({ name: cur.name, desc, aliases: alias ? alias[1].trim() : null });
    cur = null;
  };

  for (const raw of blockLines) {
    if (!raw.trim()) continue;
    // `  cmd  Description  [aliases: x]`
    const m = raw.match(/^\s{2}(\S+)\s{2,}(.*)$/);
    if (m) {
      flush();
      const name = m[1];
      if (name === 'help') continue;
      cur = { name, desc: m[2].trim() };
    } else if (cur && /^\s{4,}\S/.test(raw)) {
      cur.desc += ' ' + raw.trim();
    }
  }
  flush();
  return cmds;
}

function extractDefault(desc) {
  const m = desc.match(/\[default:\s*([^\]]+)\]/);
  return m ? m[1].trim() : '';
}

function extractPossibleValues(desc) {
  const m = desc.match(/\[possible values:\s*([^\]]+)\]/);
  return m ? m[1].trim() : '';
}

function cleanDesc(desc) {
  return desc
    .replace(/\[default:[^\]]+\]/g, '')
    .replace(/\[possible values:[^\]]+\]/g, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\s+/g, ' ')
    .trim();
}

// Replace internal "Codex" product-name references with "wizard" in generated
// markdown. The source comments are written from the constants below (which
// point at the dbt monorepo), so they never contain "codex" to begin with —
// which means we can safely sanitize every line, including comments.
//
// Covers product-name shapes the upstream binary emits:
//   - SCREAMING_SNAKE env vars: CODEX_HOME, CODEX_ACCESS_TOKEN → DBT_WIZARD_*
//   - the bare word CODEX → DBT_WIZARD
//   - the product name "Codex" / "Codex Cloud" → "wizard"
//   - lowercase `codex` (binary/identifier) → wizard
//
function sanitizeCodexRefs(md) {
  return md
    .split('\n')
    .map((line) =>
      line
        .replace(/\bCODEX_/g, 'DBT_WIZARD_')
        .replace(/\bCODEX\b/g, 'DBT_WIZARD')
        .replace(/\bCodex Cloud\b/g, 'wizard cloud')
        .replace(/\bCodex\b/g, 'wizard')
        .replace(/`codex(\s)/g, '`wizard$1')
        .replace(/`codex`/g, '`wizard`')
        .replace(/\bcodex\b/g, 'wizard'),
    )
    .join('\n');
}

function mdEscape(s) {
  return s.replace(/\|/g, '\\|');
}

function mdTextEscape(s) {
  return mdEscape(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderOptionsTable(entries) {
  if (!entries.length) return '_No options._\n';
  const rows = [
    '| Flag | Default | Description |',
    '|------|---------|-------------|',
  ];
  for (const e of entries) {
    const def = extractDefault(e.desc) || '—';
    const pv = extractPossibleValues(e.desc);
    let desc = cleanDesc(e.desc);
    if (pv) desc += ` Values: \`${pv}\`.`;
    rows.push(`| \`${mdEscape(e.signature)}\` | ${mdEscape(def)} | ${mdEscape(desc)} |`);
  }
  return rows.join('\n') + '\n';
}

function renderArgsTable(entries) {
  if (!entries.length) return '';
  const rows = [
    '| Argument | Description |',
    '|----------|-------------|',
  ];
  for (const e of entries) {
    rows.push(`| \`${mdEscape(e.signature)}\` | ${mdEscape(cleanDesc(e.desc))} |`);
  }
  return '**Arguments:**\n\n' + rows.join('\n') + '\n';
}

// Walk command tree depth-first; one section per node.
function walk(bin, displayName, pathParts, parentDesc, results, visited) {
  const key = pathParts.join(' ');
  if (visited.has(key)) return;
  visited.add(key);

  const out = help(bin, pathParts.slice(1));
  if (!out) return;
  const sections = splitSections(out);
  const description = sections.description.join('\n').trim();
  const usageBlock = sections.Usage.map((l) => l.trim()).filter(Boolean);
  const args = parseEntries(sections.Arguments);
  const opts = parseEntries(sections.Options);
  const subs = parseCommandsBlock(sections.Commands);

  // Replace the binary name in usage lines with the docs display name.
  // Clap may emit either the install name (`dbt-wizard`) or the crate's
  // internal name (`codex`); handle both.
  const binName = path.basename(bin);
  const aliases = [binName, 'codex', 'dbt-wizard'];
  const usageRendered = usageBlock.map((l) => {
    let out = l;
    for (const a of aliases) {
      out = out.replace(new RegExp(`^${a}\\b`), displayName);
      out = out.replace(new RegExp(`\\b${a}\\b`, 'g'), displayName);
    }
    return out;
  });

  results.push({
    pathParts: [displayName, ...pathParts.slice(1)],
    description,
    usage: usageRendered,
    args,
    opts,
    subs,
  });

  for (const sub of subs) {
    walk(bin, displayName, [...pathParts, sub.name], sub.desc, results, visited);
  }
}


// ---------------------------------------------------------------------------
// Slash command generator — fetches slash_command.rs from GitHub and parses
// the SlashCommand enum to produce the TUI slash commands reference partial.
// ---------------------------------------------------------------------------

function slashCommandSourceLabel() {
  if (SLASH_CMD_FILE) {
    return SLASH_CMD_FILE.replace(/^.*?\btui\//, 'tui/');
  }
  return `${GH_REPO} ${SLASH_CMD_PATH.replace(/^.*?\btui\//, 'tui/')}`;
}

function fetchSlashCommandSource() {
  if (SLASH_CMD_FILE) {
    try {
      return fs.readFileSync(SLASH_CMD_FILE, 'utf8');
    } catch (e) {
      console.warn(
        `[generate-wizard-cli] WARNING: Could not read WIZARD_SLASH_CMD_FILE=${SLASH_CMD_FILE}: ${e.message}`,
      );
    }
  }

  const r = spawnSync(
    'gh',
    ['api', `repos/${GH_REPO}/contents/${SLASH_CMD_PATH}?ref=${GH_REF}`, '--jq', '.content'],
    { encoding: 'utf8' },
  );
  if (r.status !== 0 || !r.stdout.trim()) {
    return null;
  }
  // gh returns base64 with newlines; Node's Buffer handles that.
  return Buffer.from(r.stdout.trim(), 'base64').toString('utf8');
}

function parseSlashCommands(src) {
  const commands = [];
  // Extract the enum body between `pub enum SlashCommand {` and the closing `}`
  const enumMatch = src.match(/pub enum SlashCommand \{([\s\S]+?)\n\}/);
  if (!enumMatch) return commands;
  const enumBody = enumMatch[1];

  // Extract description() match arms
  const descMap = {};
  for (const m of src.matchAll(/((?:SlashCommand::\w+\s*(?:\|\s*)?)+)\s*=>\s*(?:\{\s*)?"([^"]+)"/g)) {
    const variants = [...m[1].matchAll(/SlashCommand::(\w+)/g)].map((variant) => variant[1]);
    for (const variant of variants) descMap[variant] = m[2];
  }

  // Extract supports_inline_args variants
  const inlineBody = src.match(/fn supports_inline_args[\s\S]+?matches!\s*\(\s*self,\s*([\s\S]+?)\)\s*\}/)?.[1] ?? '';
  const inlineSet = new Set(
    [...inlineBody.matchAll(/SlashCommand::(\w+)/g)].map((m) => m[1]),
  );

  // Extract available_during_task variants from match arms.
  const duringBody = src.match(/fn available_during_task[\s\S]+?match self \{([\s\S]+?)\}\s*\}/)?.[1] ?? '';
  const duringSet = new Set();
  for (const m of duringBody.matchAll(/((?:\s*\|?\s*SlashCommand::\w+\s*)+)=>\s*(true|false)/g)) {
    if (m[2] !== 'true') continue;
    for (const variant of m[1].matchAll(/SlashCommand::(\w+)/g)) {
      duringSet.add(variant[1]);
    }
  }

  // Hidden commands — always skip these variants
  const hidden = new Set(['Login', 'Logout', 'Rollout', 'TestApproval', 'MemoryDrop', 'MemoryUpdate']);
  // Windows-only — document as footnote
  const windowsOnly = new Set(['SandboxReadRoot']);

  // Walk enum variants in declaration order
  let pendingAttrs = [];
  for (const line of enumBody.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    if (trimmed.startsWith('#[strum(')) {
      pendingAttrs.push(trimmed);
      continue;
    }

    // Collect strum attributes from preceding lines (simple approach: scan block)
    // Variant line examples:
    //   Model,
    //   #[strum(serialize = "setup-default-sandbox")]
    //   ElevateSandbox,
    //   #[strum(to_string = "autoreview")]
    //   AutoReview,
    const variantMatch = trimmed.match(/^(\w+),?$/);
    if (!variantMatch) continue;
    const variant = variantMatch[1];
    const attrs = pendingAttrs;
    pendingAttrs = [];
    if (hidden.has(variant)) continue;

    const fallbackName = variant.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    const attrText = attrs.join(' ');
    const toString = attrText.match(/to_string\s*=\s*"([^"]+)"/)?.[1];
    const serializes = [...attrText.matchAll(/serialize\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
    const cmdName = toString ?? serializes[0] ?? fallbackName;
    const aliases = [...new Set(serializes.filter((alias) => alias !== cmdName))];

    const desc = descMap[variant] ?? '';
    const inlineArgs = inlineSet.has(variant);
    const duringTask = duringSet.has(variant);
    const isWindowsOnly = windowsOnly.has(variant);

    commands.push({ variant, cmdName, aliases, desc, inlineArgs, duringTask, isWindowsOnly });
  }
  return commands;
}

// Groups match the order and content of _wizard-slash-commands-generated.md
const SLASH_GROUPS = [
  { label: 'Model and AI', prose: 'Control the AI model, provider, speed, and response style.', variants: ['Model', 'Providers', 'Fast', 'Personality'] },
  { label: 'Session management', prose: 'Start, resume, branch, and clean up sessions.', variants: ['New', 'Clear', 'Resume', 'Fork', 'Compact', 'Rename', 'Init'] },
  { label: 'Review and context', prose: 'Pull information into the session or trigger a code review.', variants: ['Review', 'Diff', 'Mention', 'Copy', 'Raw', 'Overview', 'Ide'] },
  { label: 'Permissions and safety', prose: 'Control what Wizard is allowed to execute.', variants: ['Approvals', 'Permissions', 'ElevateSandbox', 'SandboxReadRoot'] },
  { label: 'Customization', prose: 'Appearance, keybindings, and UI preferences.', variants: ['Theme', 'Keymap', 'Vim', 'Statusline', 'Title', 'Experimental', 'AutoReview', 'Pets'] },
  { label: 'Skills and extensions', prose: 'Manage capabilities Wizard can use during a session.', variants: ['Skills', 'Hooks', 'Mcp', 'Apps', 'Plugins'] },
  { label: 'Long-running tasks', prose: 'Manage multi-turn goals, parallel agents, and branched conversations.', variants: ['Plan', 'Goal', 'Agent', 'MultiAgents', 'Side', 'Btw', 'Collab'] },
  { label: 'Background terminals', prose: 'Inspect and control shell processes Wizard has running in the background.', variants: ['Ps', 'Stop'] },
  { label: 'Memory', prose: 'Control how Wizard stores and uses memory across sessions.', variants: ['Memories'] },
  { label: 'Session info', prose: 'Inspect the current session state without changing anything.', variants: ['Status', 'Config', 'DebugConfig', 'Feedback'] },
  { label: 'Exit', variants: ['Quit', 'Exit'] },
  { label: 'Realtime (experimental)', variants: ['Realtime', 'Settings'] },
];

function buildAliasMap(commands) {
  // Map primary variant → aliases declared on the same enum variant.
  const aliases = {};
  for (const c of commands) {
    if (c.aliases?.length) aliases[c.variant] = c.aliases.map((alias) => `/${alias}`).join(', ');
  }
  return aliases;
}

// Derive the kebab-case anchor for a group label, e.g. "Model and AI" → "model-and-ai".
function groupAnchor(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Capitalize the first letter of a description string.
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function renderSlashCommandsMarkdown(commands, srcRef) {
  const lines = [];
  lines.push('<!-- AUTOGENERATED by website/scripts/generate-wizard-cli-reference.js -->');
  lines.push(`<!-- Source: ${slashCommandSourceLabel()} -->`);
  lines.push('<!-- Do not edit by hand; rerun `npm run generate:wizard-cli` in website/ to refresh -->');
  lines.push('');

  lines.push('## Slash commands');
  lines.push('');
  lines.push(
    'Type `/` in the composer to open the command picker. Use arrow keys to navigate or keep typing to filter. ' +
    'Press **Tab** to queue a command while a task is running — it executes at the end of the current turn.',
  );
  lines.push('');

  const aliasMap = buildAliasMap(commands);
  const byVariant = Object.fromEntries(commands.map((c) => [c.variant, c]));

  // Build variant → section anchor map for master-table links.
  const variantToAnchor = {};
  for (const group of SLASH_GROUPS) {
    const anchor = groupAnchor(group.label);
    for (const v of group.variants) variantToAnchor[v] = anchor;
  }

  // Master table
  lines.push('### All slash commands');
  lines.push('');
  lines.push('<SimpleTable>');
  lines.push('');
  lines.push('| Command | Alias | Purpose | Available during task |');
  lines.push('|---------|-------|---------|----------------------|');
  for (const c of commands) {
    const alias = aliasMap[c.variant] ? `\`${aliasMap[c.variant]}\`` : '—';
    const anchor = variantToAnchor[c.variant] ?? c.cmdName.replace(/-/g, '');
    lines.push(
      `| [\`/${c.cmdName}\`](#${anchor}) | ${alias} | ${mdTextEscape(capitalize(c.desc))} | ${c.duringTask ? '✓' : '✗'} |`,
    );
  }
  lines.push('');
  lines.push('</SimpleTable>');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Grouped sections
  for (const group of SLASH_GROUPS) {
    const groupCmds = group.variants.map((v) => byVariant[v]).filter(Boolean);
    if (!groupCmds.length) continue;

    const anchor = groupAnchor(group.label);
    lines.push(`### ${group.label} {#${anchor}}`);
    lines.push('');
    if (group.prose) {
      lines.push(group.prose);
      lines.push('');
    }
    lines.push('<SimpleTable>');
    lines.push('');
    lines.push('| Command | Inline args | Description |');
    lines.push('|---------|-------------|-------------|');
    for (const c of groupCmds) {
      const aliasNote = aliasMap[c.variant] ? ` (alias: ${aliasMap[c.variant]})` : '';
      lines.push(
        `| \`/${c.cmdName}\`${mdEscape(aliasNote)} | ${c.inlineArgs ? 'Yes' : '—'} | ${mdTextEscape(capitalize(c.desc))} |`,
      );
    }
    lines.push('');
    lines.push('</SimpleTable>');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return sanitizeCodexRefs(lines.join('\n'));
}

function generateSlashCommands() {
  console.log('[generate-wizard-cli] loading slash_command.rs…');
  const src = fetchSlashCommandSource();
  if (!src) {
    const reason = `Could not fetch ${SLASH_CMD_PATH} from ${GH_REPO} via gh CLI or read WIZARD_SLASH_CMD_FILE. Is gh authenticated?`;
    console.warn(`[generate-wizard-cli] WARNING: ${reason}`);
    // If the output file already exists, keep it so the live page stays intact
    // for users. Only write a stub when there is no existing file to fall back on.
    if (fs.existsSync(OUT_SLASH)) {
      console.warn('[generate-wizard-cli] Keeping existing slash commands file — update the script when the source path changes.');
      return;
    }
    const stub = [
      '<!-- AUTOGENERATED by website/scripts/generate-wizard-cli-reference.js -->',
      `<!-- ${reason} -->`,
      '',
      ':::warning Auto-generated slash commands reference unavailable',
      `The slash commands reference is generated from \`${SLASH_CMD_PATH}\` in the wizard source repo (${GH_REPO}),`,
      'but the file could not be loaded at build time. Set `WIZARD_SLASH_CMD_FILE` to a local `slash_command.rs` or run `gh auth login` and re-run `npm run generate:wizard-cli`.',
      ':::',
      '',
    ].join('\n');
    fs.writeFileSync(OUT_SLASH, stub);
    return;
  }

  const commands = parseSlashCommands(src);
  console.log(`[generate-wizard-cli] parsed ${commands.length} slash commands`);
  const md = renderSlashCommandsMarkdown(commands, GH_REF);
  fs.writeFileSync(OUT_SLASH, md);
  console.log(`[generate-wizard-cli] wrote ${OUT_SLASH}`);
}

// ---------------------------------------------------------------------------
// Full CLI reference generator — richer format with a Type column.
// ---------------------------------------------------------------------------

function inferType(signature) {
  if (!/</.test(signature)) return 'boolean';
  const val = (signature.match(/<([^>]+)>/) ?? [])[1]?.toLowerCase() ?? '';
  if (/file|path|dir/.test(val)) return 'path';
  if (/mode|policy|provider|color/.test(val)) return 'enum';
  return 'string';
}

function renderFullCliMarkdown(nodes, version, rootSubs) {
  const lines = [];
  lines.push('<!-- AUTOGENERATED by website/scripts/generate-wizard-cli-reference.js -->');
  lines.push(
    `<!-- Source: \`dbt-wizard --help\` + ${GH_REPO} cli/src/main.rs, tui/src/cli.rs, utils/cli/src/config_override.rs -->`,
  );
  lines.push(`<!-- Wizard version: ${version} -->`);
  lines.push('<!-- Do not edit by hand; rerun `npm run generate:wizard-cli` in website/ to refresh -->');
  lines.push("import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';");
  lines.push('');
  lines.push('## How to read this reference');
  lines.push('');
  lines.push('- **Flag** — the full flag as typed. Short flags (e.g. `-m`) are listed in the Short column.');
  lines.push('- **Type** — `boolean` (presence/absence), `string`, `path`, or an enumeration of allowed values.');
  lines.push('- **Description** — what the flag does and when to use it.');
  lines.push("- Global flags apply to the base interactive `wizard` command. Subcommands can have different flag sets; use each command's section for automation.");
  lines.push('');
  lines.push('<WizardFeedbackCallout />');
  lines.push('');

  const root = nodes[0];

  // Global flags
  lines.push('## Global flags {#global-flags}');
  lines.push('');
  lines.push('These flags work on the base interactive `wizard` command.');
  lines.push('');
  lines.push('| Flag | Short | Type | Description |');
  lines.push('|------|-------|------|-------------|');
  for (const opt of root.opts) {
    if (/^-h,|^--help|^-V,|^--version/.test(opt.signature)) continue;
    const shortMatch = opt.signature.match(/^(-[a-zA-Z]),\s/);
    const short = shortMatch ? `\`${shortMatch[1]}\`` : '—';
    const type = inferType(opt.signature);
    const pv = extractPossibleValues(opt.desc);
    let desc = cleanDesc(opt.desc);
    if (pv) desc += ` Values: \`${pv}\`.`;
    lines.push(`| \`${mdEscape(opt.signature)}\` | ${short} | ${type} | ${mdEscape(desc)} |`);
  }
  lines.push('');

  // Build alias lookup from the parsed Commands: block of root --help
  const aliasByCmd = Object.fromEntries(
    (rootSubs || []).map((c) => [c.name, c.aliases]),
  );

  // Command overview table — Command | Aliases | Description, hyphen-preserving anchors
  lines.push('## Commands');
  lines.push('');
  lines.push('| Command | Aliases | Description |');
  lines.push('|---------|---------|-------------|');
  for (const node of nodes.slice(1)) {
    if (node.pathParts.length !== 2) continue;
    const cmd = node.pathParts[1];
    const alias = aliasByCmd[cmd] ? `\`${aliasByCmd[cmd]}\`` : '—';
    lines.push(
      `| [\`${cmd}\`](#${cmd}) | ${alias} | ${mdEscape(node.description || '')} |`,
    );
  }
  lines.push('');

  // Per-subcommand sections with hyphen-preserving anchors
  for (const node of nodes.slice(1)) {
    if (node.pathParts.length !== 2) continue;
    const cmd = node.pathParts[1];
    lines.push(`## ${cmd} {#${cmd}}`);
    lines.push('');
    if (node.description) {
      lines.push(node.description);
      lines.push('');
    }
    if (node.usage.length) {
      lines.push('```bash');
      for (const u of node.usage) lines.push(u);
      lines.push('```');
      lines.push('');
    }
    if (node.args.length) lines.push(renderArgsTable(node.args));
    if (node.opts.length) {
      lines.push('| Flag | Short | Type | Description |');
      lines.push('|------|-------|------|-------------|');
      for (const opt of node.opts) {
        if (/^-h,|^--help|^-V,|^--version/.test(opt.signature)) continue;
        const shortMatch = opt.signature.match(/^(-[a-zA-Z]),\s/);
        const short = shortMatch ? `\`${shortMatch[1]}\`` : '—';
        const type = inferType(opt.signature);
        const pv = extractPossibleValues(opt.desc);
        let desc = cleanDesc(opt.desc);
        if (pv) desc += ` Values: \`${pv}\`.`;
        lines.push(`| \`${mdEscape(opt.signature)}\` | ${short} | ${type} | ${mdEscape(desc)} |`);
      }
      lines.push('');
    }
  }

  return sanitizeCodexRefs(lines.join('\n'));
}

function generateFullCliReference(bin, version) {
  console.log('[generate-wizard-cli] generating full CLI reference…');
  const results = [];
  walk(bin, 'wizard', [path.basename(bin)], '', results, new Set());

  // Parse the root help once more to pull aliases for each top-level command.
  const rootHelp = help(bin, []);
  const rootSubs = parseCommandsBlock(splitSections(rootHelp).Commands);

  const topLevelCmds = results.slice(1).filter((n) => n.pathParts.length === 2).map((n) => n.pathParts[1]);
  console.log(`[generate-wizard-cli] discovered ${topLevelCmds.length} top-level commands from the live binary: ${topLevelCmds.join(', ')}`);

  fs.writeFileSync(OUT_FULL, renderFullCliMarkdown(results, version, rootSubs));
  console.log(`[generate-wizard-cli] wrote ${OUT_FULL}`);
}

// ---------------------------------------------------------------------------

function main() {
  const allowStub = process.env.WIZARD_CLI_ALLOW_STUB === '1';
  const bin = resolveBinary();
  if (!bin) {
    const reason = 'Wizard binary not found on PATH.';
    // If the committed generated files already exist (e.g. Vercel CI, a dev
    // machine without the binary) keep them and exit cleanly — the committed
    // content is correct and there is nothing to regenerate.
    const filesExist = [OUT_FULL, OUT_SLASH].every(fs.existsSync);
    if (filesExist) {
      console.warn(`[generate-wizard-cli] ${reason} Keeping committed generated files.`);
      return;
    }
    if (!allowStub) {
      console.error(
        `[generate-wizard-cli] FATAL: ${reason}\n` +
        `  Install the wizard CLI before regenerating docs (commands generated from a stub will be wrong).\n` +
        `  To intentionally emit stub files (e.g. CI without the binary), set WIZARD_CLI_ALLOW_STUB=1.`,
      );
      process.exit(1);
    }
    console.warn(`[generate-wizard-cli] ${reason} Emitting stub (WIZARD_CLI_ALLOW_STUB=1).`);
    return;
  }

  // Pre-flight: confirm the binary actually responds with a command list.
  // Throws and exits non-zero on failure — this is what stops the script
  // from regenerating docs against a broken / partially-installed binary.
  validateBinary(bin);

  let version = 'unknown';
  try {
    version = execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim();
  } catch (_) {
    // version flag not supported; use default
  }

  console.log(`[generate-wizard-cli] using ${bin} (${version})`);

  generateFullCliReference(bin, version);
  generateSlashCommands();
}

if (require.main === module) {
  main();
}

module.exports = {
  buildAliasMap,
  fetchSlashCommandSource,
  parseCommandsBlock,
  parseSlashCommands,
  renderSlashCommandsMarkdown,
  sanitizeCodexRefs,
};
