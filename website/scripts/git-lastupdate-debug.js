// Temporary diagnostic: report the build environment's git state so we can
// tell whether Vercel's shallow clone can be deepened at build time.
// Writes to static/git-debug.json, which the deployed site serves at
// /git-debug.json. Remove once the last-updated fix is settled.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
	try {
		return execSync(cmd, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
	} catch (err) {
		return `ERROR: ${err.message.split("\n")[0]}`;
	}
}

const sample = "docs/reference/database-permissions/databricks-permissions.md";

const before = {
	isShallow: run("git rev-parse --is-shallow-repository"),
	commitCount: run("git rev-list --count HEAD"),
	sampleDate: run(`git log -1 --format=%cd -- ${sample}`),
};

const fetchResult = run("git fetch --unshallow --tags 2>&1") || "(no output)";

const after = {
	isShallow: run("git rev-parse --is-shallow-repository"),
	commitCount: run("git rev-list --count HEAD"),
	sampleDate: run(`git log -1 --format=%cd -- ${sample}`),
};

const out = { before, fetchResult, after, generatedAt: new Date().toISOString() };
const dest = path.join(__dirname, "..", "static", "git-debug.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log("git-debug:", JSON.stringify(out));
