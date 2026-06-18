#!/usr/bin/env node
/**
 * Monthly editorial sweep.
 *
 * Deterministic tools (Vale, lychee, regex) find small editorial issues.
 * Findings are grouped into three categories, one PR per category:
 *
 *   links        broken links (report only — needs a human to pick the right URL)
 *   typos        spelling / typos (report only — Vale flags but can't auto-correct)
 *   brand-style  brand-term + style-guide violations (dbt Cloud, DBT, Coalesce,
 *                em dashes in bullets, Latin abbreviations, sentence-case headers).
 *                Only the unambiguous ones (e.g. DBT -> dbt) are auto-fixed into a
 *                PR; the rest are reported for manual review.
 *
 * Subcommands:
 *   detect             regex detectors + ingest vale.json / lychee output ->
 *                      findings.json (+ deterministic fixes.json)
 *   apply <category>   apply that category's safe fixes to the working tree
 *   summary            build the Slack payload + markdown summary
 *
 * Scope: by default only files changed in the last 30 days, so the sweep catches
 * newly introduced issues instead of re-opening PRs for the same old content.
 * Set SWEEP_FULL_REPO=1 to scan every doc.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const OUT_DIR = path.join(process.cwd(), "sweep-output");
const FINDINGS = path.join(OUT_DIR, "findings.json");
const FIXES = path.join(OUT_DIR, "fixes.json");
// Living docs only. Blog posts are point-in-time (old product names were
// correct when published), so they're intentionally excluded.
const DOCS_GLOBS = ["website/docs", "website/snippets"];

const CATEGORIES = ["links", "typos", "brand-style"];

function ensureOut() {
	if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function readJSON(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"));
	} catch {
		return fallback;
	}
}

/** Files changed in the last 30 days (Markdown/MDX only), or all docs when SWEEP_FULL_REPO=1. */
function targetFiles() {
	const isMd = (f) =>
		/\.(md|mdx)$/.test(f) && DOCS_GLOBS.some((g) => f.startsWith(g));

	if (process.env.SWEEP_FULL_REPO === "1") {
		const out = execSync(
			`git ls-files '${DOCS_GLOBS.map((g) => g + "/**").join("' '")}'`,
			{ encoding: "utf8", maxBuffer: 1 << 26 },
		);
		return out.split("\n").filter(isMd);
	}

	try {
		const base = execSync(`git rev-list -1 --before='30 days ago' HEAD`, {
			encoding: "utf8",
		}).trim();
		if (base) {
			const out = execSync(`git diff --name-only ${base} HEAD`, {
				encoding: "utf8",
				maxBuffer: 1 << 26,
			});
			return out
				.split("\n")
				.filter(isMd)
				.filter((f) => fs.existsSync(f));
		}
	} catch {
		/* fall through to full scan */
	}
	return execSync(`git ls-files '${DOCS_GLOBS.map((g) => g + "/**").join("' '")}'`, {
		encoding: "utf8",
		maxBuffer: 1 << 26,
	})
		.split("\n")
		.filter(isMd);
}

/* ------------------------------------------------------------------ detect */

// Brand + style rules from the dbt Labs style guide. `replace: null` means
// "flag for human review" (no safe automatic substitution).
const BRAND_RULES = [
	{ re: /\bdbt Cloud\b/g, rule: "brand:dbt-cloud", msg: '"dbt Cloud" is retired — use "dbt platform" (confirm with PMM in Fusion/platform copy)', replace: null },
	{ re: /\bDBT\b/g, rule: "brand:DBT-caps", msg: '"DBT" should be lowercase "dbt"', replace: "dbt" },
	{ re: /\bCoalesce\b/g, rule: "brand:coalesce", msg: '"Coalesce" was retired Jan 31 2026 — flag for review', replace: null },
	{ re: /\b(e\.g\.|i\.e\.)/g, rule: "style:latin-abbr", msg: 'avoid Latin abbreviations — use "for example" / "that is"', replace: null },
];

const BULLET = /^\s*([-*+]|\d+\.)\s/;

function detect() {
	ensureOut();
	const findings = [];
	const files = targetFiles();

	for (const file of files) {
		let text;
		try {
			text = fs.readFileSync(file, "utf8");
		} catch {
			continue;
		}
		const lines = text.split("\n");
		let inFence = false;

		lines.forEach((line, i) => {
			if (/^\s*```/.test(line)) inFence = !inFence;
			if (inFence) return; // never touch code blocks

			// Em dash inside a bullet item -> brand-style (needs judgment to rewrite)
			if (BULLET.test(line) && line.includes("—")) {
				findings.push({
					category: "brand-style",
					file,
					line: i + 1,
					rule: "style:emdash-in-bullet",
					message: "em dash in a bullet point — rewrite with a comma, colon, or parentheses",
					text: line.trim(),
				});
			}

			for (const { re, rule, msg, replace } of BRAND_RULES) {
				re.lastIndex = 0;
				if (re.test(line)) {
					findings.push({
						category: "brand-style",
						file,
						line: i + 1,
						rule,
						message: msg,
						text: line.trim(),
						autofix: replace,
					});
				}
			}
		});
	}

	// Ingest Vale JSON output (vale --output=JSON ... > sweep-output/vale.json)
	const vale = readJSON(path.join(OUT_DIR, "vale.json"), null);
	if (vale && typeof vale === "object") {
		for (const [file, alerts] of Object.entries(vale)) {
			for (const a of alerts) {
				const category = /Typos/i.test(a.Check) ? "typos" : "brand-style";
				findings.push({
					category,
					file,
					line: a.Line,
					rule: `vale:${a.Check}`,
					message: a.Message,
				});
			}
		}
	}

	// Ingest lychee output (lychee --format json ... > sweep-output/lychee.json)
	const lychee = readJSON(path.join(OUT_DIR, "lychee.json"), null);
	if (lychee && lychee.fail_map) {
		for (const [file, links] of Object.entries(lychee.fail_map)) {
			for (const l of links) {
				findings.push({
					category: "links",
					file: file.replace(/^.*?website\//, "website/"),
					line: 0,
					rule: "lychee:broken-link",
					message: `broken link: ${l.url || l} (${(l.status && l.status.text) || "unreachable"})`,
				});
			}
		}
	}

	fs.writeFileSync(FINDINGS, JSON.stringify(findings, null, 2));

	// Deterministic, unambiguous fixes only (e.g. DBT -> dbt). Everything else
	// is left as a report-only finding for the docs team to handle by hand.
	const fixes = findings
		.filter((f) => f.autofix)
		.map((f) => ({
			category: f.category,
			file: f.file,
			find: matchableSnippet(f),
			replace: matchableSnippet(f, f.autofix),
			reason: f.message,
		}))
		.filter((f) => f.find && f.find !== f.replace);
	fs.writeFileSync(FIXES, JSON.stringify(fixes, null, 2));

	console.log(
		`detect: ${findings.length} findings, ${fixes.length} safe fixes across ${files.length} files`,
	);
}

/* ------------------------------------------------------------------- apply */

function apply(category) {
	if (!CATEGORIES.includes(category)) {
		console.error(`apply: unknown category "${category}"`);
		process.exit(1);
	}
	const fixes = readJSON(FIXES, []).filter((f) => f.category === category);
	let applied = 0;
	const byFile = {};
	for (const f of fixes) (byFile[f.file] ||= []).push(f);

	for (const [file, fileFixes] of Object.entries(byFile)) {
		let content;
		try {
			content = fs.readFileSync(file, "utf8");
		} catch {
			continue;
		}
		for (const f of fileFixes) {
			if (occurrences(content, f.find) === 1) {
				content = content.replace(f.find, f.replace);
				applied++;
			}
		}
		fs.writeFileSync(file, content);
	}
	console.log(`apply(${category}): ${applied} edits across ${Object.keys(byFile).length} files`);
}

/* ----------------------------------------------------------------- summary */

function summary() {
	const findings = readJSON(FINDINGS, []);
	const fixes = readJSON(FIXES, []);
	const prs = readJSON(path.join(OUT_DIR, "prs.json"), {}); // { category: url }

	const counts = {};
	for (const c of CATEGORIES) counts[c] = { findings: 0, fixes: 0 };
	for (const f of findings) (counts[f.category] ||= { findings: 0, fixes: 0 }).findings++;
	for (const f of fixes) (counts[f.category] ||= { findings: 0, fixes: 0 }).fixes++;

	const total = findings.length;
	const totalFixes = fixes.length;
	const scope = process.env.SWEEP_FULL_REPO === "1" ? "full repo" : "files changed in the last 30 days";

	const labels = {
		links: "🔗 Broken links",
		typos: "✏️ Typos",
		"brand-style": "🎨 Brand & style",
	};

	const lines = [];
	for (const c of CATEGORIES) {
		const k = counts[c];
		let line = `*${labels[c]}* — ${k.findings} found`;
		if (prs[c]) line += `, fix PR opened: ${prs[c]}`;
		else if (k.fixes > 0) line += `, ${k.fixes} fixes staged`;
		else if (k.findings > 0) line += " (needs manual review)";
		lines.push(line);
	}

	const headline =
		total === 0
			? "✅ Monthly docs editorial sweep — all clear, nothing to flag."
			: `📋 Monthly docs editorial sweep — ${total} small issues found, ${totalFixes} auto-fixed into PRs.`;

	// Markdown for logs / PR bodies
	const md =
		`${headline}\n\nScope: ${scope}.\n\n` + lines.map((l) => "- " + l.replace(/\*/g, "")).join("\n") + "\n";
	fs.writeFileSync(path.join(OUT_DIR, "summary.md"), md);

	// Slack blocks payload
	const payload = {
		blocks: [
			{ type: "header", text: { type: "plain_text", text: "Monthly docs editorial sweep" } },
			{ type: "section", text: { type: "mrkdwn", text: `${headline}\n_Scope: ${scope}._` } },
			{ type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: "Auto-generated draft PRs — the docs team reviews and approves. Run manually anytime via the *Run workflow* button.",
					},
				],
			},
		],
	};
	fs.writeFileSync(path.join(OUT_DIR, "slack.json"), JSON.stringify(payload, null, 2));
	console.log(md);
}

/* ------------------------------------------------------------------ helpers */

function occurrences(haystack, needle) {
	if (!needle) return 0;
	let n = 0,
		i = 0;
	while ((i = haystack.indexOf(needle, i)) !== -1) {
		n++;
		i += needle.length;
	}
	return n;
}

// Build a minimal unique snippet for a deterministic finding (the trimmed line).
function matchableSnippet(finding, replacement) {
	if (!finding.text) return null;
	if (!replacement) return finding.text;
	// apply the single rule's substitution to the line
	if (finding.rule === "brand:DBT-caps") return finding.text.replace(/\bDBT\b/g, "dbt");
	return finding.text;
}

/* --------------------------------------------------------------------- main */

(async () => {
	const cmd = process.argv[2];
	switch (cmd) {
		case "detect":
			return detect();
		case "apply":
			return apply(process.argv[3]);
		case "summary":
			return summary();
		default:
			console.error("usage: editorial-sweep.js detect|apply <category>|summary");
			process.exit(1);
	}
})();
