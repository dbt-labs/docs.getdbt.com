#!/usr/bin/env node
// Flags image references (markdown, <img>, <Lightbox>, etc.) that point to a
// local /static asset that doesn't exist. Catches typo'd paths that
// lychee-action / the docs link checker can't see because they're JSX props,
// not real <a>/<img> tags in the rendered HTML.

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const STATIC_DIR = path.join(REPO_ROOT, "website", "static");
const SCAN_DIRS = [
	path.join(REPO_ROOT, "website", "docs"),
	path.join(REPO_ROOT, "website", "snippets"),
	path.join(REPO_ROOT, "website", "blog"),
];

const FILE_EXTENSIONS = new Set([".md", ".mdx"]);

// Matches src="..." / src='...' on any tag or component (<img>, <Lightbox>,
// custom components, etc.) plus standard markdown image syntax ![alt](path).
const SRC_ATTR_RE = /\bsrc\s*=\s*["']([^"']+)["']/g;
const MARKDOWN_IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function walk(dir, files = []) {
	if (!fs.existsSync(dir)) return files;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full, files);
		} else if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
			files.push(full);
		}
	}
	return files;
}

function isLocalStaticPath(ref) {
	if (!ref) return false;
	// Skip external URLs, mailto, anchors, and dynamic JS expressions
	// (e.g. `${variable}` template strings some components use).
	if (/^(https?:)?\/\//.test(ref)) return false;
	if (/^(mailto:|#|data:)/.test(ref)) return false;
	if (ref.includes("${") || ref.includes("{")) return false;
	return ref.startsWith("/");
}

function lineNumberAt(content, index) {
	return content.slice(0, index).split("\n").length;
}

function checkFile(filePath, errors) {
	const content = fs.readFileSync(filePath, "utf8");
	const relFile = path.relative(REPO_ROOT, filePath);

	for (const re of [SRC_ATTR_RE, MARKDOWN_IMAGE_RE]) {
		re.lastIndex = 0;
		let match;
		while ((match = re.exec(content)) !== null) {
			const ref = match[1];
			if (!isLocalStaticPath(ref)) continue;

			const assetPath = path.join(STATIC_DIR, ref.replace(/^\//, ""));
			if (!fs.existsSync(assetPath)) {
				errors.push({
					file: relFile,
					line: lineNumberAt(content, match.index),
					ref,
				});
			}
		}
	}
}

function main() {
	const argFiles = process.argv.slice(2);
	const files = argFiles.length
		? argFiles
				.map((f) => path.resolve(REPO_ROOT, f))
				.filter((f) => FILE_EXTENSIONS.has(path.extname(f)) && fs.existsSync(f))
		: SCAN_DIRS.flatMap((dir) => walk(dir));
	const errors = [];

	for (const file of files) {
		checkFile(file, errors);
	}

	if (errors.length > 0) {
		console.error(`Found ${errors.length} broken image path(s):\n`);
		for (const { file, line, ref } of errors) {
			console.error(`  ${file}:${line}  ->  ${ref}`);
		}
		console.error(
			"\nFix the path above, or add the missing asset under website/static.",
		);
		process.exit(1);
	}

	console.log(`Checked ${files.length} files. No broken image paths found.`);
}

main();
