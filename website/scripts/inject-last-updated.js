// Stamp each doc's real "last updated" date into its frontmatter at build time.
//
// Why: Docusaurus derives last-updated dates from git history, but Vercel's
// build uses a shallow clone (~20 commits), so any page older than that
// boundary resolves to the wrong date. Vercel won't serve deeper history to
// the build, so we fetch the real last-commit date per file from the GitHub
// GraphQL API (batched) and write it into the native `last_update` frontmatter
// field. Docusaurus reads frontmatter over git, so this fixes the footer date
// and the structured-data date with no component changes.
//
// Ephemeral: this edits files in the build sandbox only; nothing is committed.
// Safe by design: any failure (no token, API error, unparseable file) is
// caught and the build continues — a page just falls back to git as before.
//
// Requires the GITHUB_TOKEN env var in the Vercel project. When it expires
// (fine-grained tokens last up to a year), dates silently go stale — watch for
// the "TOKEN REJECTED" warning in the build log. Rotation + verification steps:
// see scripts/inject-last-updated.md.
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const OWNER = "dbt-labs";
const REPO = "docs.getdbt.com";
const REPO_PREFIX = "website/docs/";
const DOCS_DIR = path.join(__dirname, "..", "docs");
const BATCH = 50;

// The commit being built (present on the remote); falls back to the branch.
const REF =
	process.env.VERCEL_GIT_COMMIT_SHA ||
	process.env.VERCEL_GIT_COMMIT_REF ||
	"current";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function walk(dir, acc = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fp = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(fp, acc);
		else if (/\.mdx?$/.test(entry.name)) acc.push(fp);
	}
	return acc;
}

function repoPath(fp) {
	return REPO_PREFIX + path.relative(DOCS_DIR, fp).split(path.sep).join("/");
}

async function graphql(query) {
	const res = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});
	if (res.status === 401 || res.status === 403) {
		const err = new Error(`GitHub GraphQL HTTP ${res.status} (token rejected)`);
		err.tokenRejected = true;
		throw err;
	}
	if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}`);
	const json = await res.json();
	if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
	return json.data;
}

async function fetchDates(files) {
	const dates = new Map();
	for (let i = 0; i < files.length; i += BATCH) {
		const chunk = files.slice(i, i + BATCH);
		const fields = chunk
			.map(
				(fp, idx) =>
					`f${idx}: history(first: 1, path: ${JSON.stringify(
						repoPath(fp)
					)}) { nodes { committedDate } }`
			)
			.join("\n");
		const query = `query { repository(owner: ${JSON.stringify(
			OWNER
		)}, name: ${JSON.stringify(REPO)}) { object(expression: ${JSON.stringify(
			REF
		)}) { ... on Commit { ${fields} } } } }`;
		let data;
		try {
			data = await graphql(query);
		} catch (err) {
			if (err.tokenRejected) {
				console.warn(
					"[last-updated] TOKEN REJECTED: GITHUB_TOKEN is missing scope or expired. " +
						"Dates will fall back to git (wrong on Vercel). " +
						"Rotate it — see website/scripts/inject-last-updated.md."
				);
				return dates; // no point retrying every batch with a bad token
			}
			console.warn(`[last-updated] batch at ${i} failed: ${err.message}`);
			continue;
		}
		const obj = data && data.repository && data.repository.object;
		if (!obj) continue;
		chunk.forEach((fp, idx) => {
			const node = obj[`f${idx}`];
			const date = node && node.nodes && node.nodes[0] && node.nodes[0].committedDate;
			if (date) dates.set(fp, date.slice(0, 10)); // YYYY-MM-DD
		});
	}
	return dates;
}

(async () => {
	if (!TOKEN) {
		console.log("[last-updated] No GITHUB_TOKEN set; skipping (dates fall back to git).");
		return;
	}
	try {
		const files = walk(DOCS_DIR);
		const dates = await fetchDates(files);
		let stamped = 0;
		for (const fp of files) {
			const date = dates.get(fp);
			if (!date) continue;
			const raw = fs.readFileSync(fp, "utf8");
			if (!raw.startsWith("---")) continue; // only files with frontmatter
			let parsed;
			try {
				parsed = matter(raw);
			} catch {
				continue;
			}
			if (parsed.data.last_update) continue; // respect manual overrides
			parsed.data.last_update = { date };
			fs.writeFileSync(fp, matter.stringify(parsed.content, parsed.data));
			stamped++;
		}
		console.log(`[last-updated] stamped ${stamped}/${files.length} docs from ${REF}`);
	} catch (err) {
		console.warn(`[last-updated] skipped: ${err.message}`);
	}
})();
