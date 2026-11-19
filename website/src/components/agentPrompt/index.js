import React, { useEffect, useRef, useState } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./styles.module.css";

/**
 * A callout with a "Copy prompt" button. The prompt text itself stays hidden.
 *
 * Two modes:
 *
 * 1. Page has `agent_guidance` frontmatter (no children): the prompt is built
 *    from it, so the rules are written once. The generated .md already shows
 *    the guidance under the title, so the prompt is dropped from the .md
 *    (data-md-hide) and an agent never sees the rules twice.
 *
 *      <AgentPrompt />
 *
 * 2. No `agent_guidance`: the children are the prompt. They're hidden on the
 *    page and un-hidden in the .md (data-md-only), so an agent that fetches
 *    the .md still gets the instructions.
 *
 *      <AgentPrompt>
 *      Walk me through this page one step at a time.
 *      </AgentPrompt>
 *
 * If a page has both, the frontmatter wins and children are ignored.
 * The callout itself (heading, button) is always dropped from the .md.
 */

// Three four-point stars. Drawn with currentColor so the CSS sets the color,
// and a round stroke softens the tips.
function star(cx, cy, r) {
  const k = r * 0.2;
  return [
    `M${cx} ${cy - r}`,
    `Q${cx + k} ${cy - k} ${cx + r} ${cy}`,
    `Q${cx + k} ${cy + k} ${cx} ${cy + r}`,
    `Q${cx - k} ${cy + k} ${cx - r} ${cy}`,
    `Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`,
  ].join("");
}

const STARS = [
  { d: star(9, 13, 7.5), className: styles.starLarge },
  { d: star(19, 6, 4), className: styles.starTop },
  { d: star(18, 18.5, 3.5), className: styles.starBottom },
];

function SparklesIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    >
      {STARS.map(({ d, className: starClass }) => (
        <path key={d} d={d} className={`${styles.star} ${starClass}`} />
      ))}
    </svg>
  );
}

const DEFAULT_HEADING = "Follow along with an AI assistant";
const DEFAULT_DESCRIPTION =
  "Copy and paste this prompt into your AI assistant to guide you through each step";

function getGuidanceItems(guidance) {
  return (Array.isArray(guidance) ? guidance : Object.values(guidance ?? {}))
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());
}

function buildPrompt({ title, mdUrl, items }) {
  return [
    `Walk me through "${title}".`,
    `Read ${mdUrl} and treat it as the source of truth for the steps, code, and settings.`,
    `Follow these rules:\n${items.map((item) => `- ${item}`).join("\n")}`,
  ].join("\n\n");
}

// textContent drops the breaks between paragraphs and list items, so walk the
// top-level blocks and join them ourselves.
function blocksToText(root) {
  return Array.from(root.children)
    .flatMap((el) => {
      if (el.tagName === "UL" || el.tagName === "OL") {
        return Array.from(el.children).map((li) => `- ${li.textContent.trim()}`);
      }
      return [el.textContent.trim()];
    })
    .filter(Boolean)
    .join("\n\n");
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Permission denied or blocked: fall through to the legacy path.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch (e) {
    return false;
  }
}

export default function AgentPrompt({
  children,
  heading = DEFAULT_HEADING,
  description = DEFAULT_DESCRIPTION,
}) {
  const { metadata, frontMatter } = useDoc();
  const sourceRef = useRef(null);
  const fallbackRef = useRef(null);
  const timerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState("");

  useEffect(() => {
    if (showFallback) {
      fallbackRef.current?.select();
    }
  }, [showFallback, fallbackText]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const items = getGuidanceItems(frontMatter.agent_guidance);
  const fromFrontmatter = items.length > 0;

  if (!fromFrontmatter && !children) {
    return null;
  }

  const mdUrl = `https://docs.getdbt.com${metadata.permalink.replace(/\/$/, "")}.md`;
  const generated = fromFrontmatter
    ? buildPrompt({ title: metadata.title, mdUrl, items })
    : null;

  async function handleCopy() {
    const text = generated ?? blocksToText(sourceRef.current);
    const ok = await copyToClipboard(text);

    if (ok) {
      setShowFallback(false);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      return;
    }

    // Last resort: show the text, selected, so the reader can copy it by hand.
    setFallbackText(text);
    setShowFallback(true);
  }

  return (
    <>
      <div className={styles.callout} data-md-hide="true">
        <div className={styles.lead}>
          <SparklesIcon className={styles.icon} />
          <div className={styles.text}>
            <span className={styles.heading}>{heading}</span>
            <span className={styles.description}>{description}</span>
          </div>
        </div>
        <button type="button" className={styles.button} onClick={handleCopy}>
          {copied ? "Copied" : "Copy prompt"}
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {copied ? "Prompt copied to clipboard" : ""}
        </span>
        {showFallback && (
          <div className={styles.fallback}>
            <label htmlFor="agent-prompt-fallback">
              Your browser blocked copying. Select the text and copy it with Ctrl+C or Cmd+C.
            </label>
            <textarea
              id="agent-prompt-fallback"
              ref={fallbackRef}
              className={styles.fallbackText}
              readOnly
              rows={8}
              value={fallbackText}
            />
          </div>
        )}
      </div>

      {fromFrontmatter ? (
        <div hidden data-md-hide="true">{generated}</div>
      ) : (
        <div hidden data-md-only="true" ref={sourceRef}>
          {children}
        </div>
      )}
    </>
  );
}
