import React from "react";

/**
 * Renders a page's `agent_guidance` frontmatter as instructions for AI
 * assistants. The element is `hidden`, so readers never see it on the page;
 * the `data-md-only` marker tells plugins/rehypeMdOnly.js to un-hide it in the
 * generated per-page .md and llms-full.txt.
 *
 * Frontmatter accepts a map of short instructions (keys are labels for
 * authors only) or a plain list:
 *
 *   agent_guidance:
 *     pacing: Give one step per reply.
 *     safety: Never ask for passwords or keys in chat.
 */
export default function AgentGuidance({ guidance, isGuide }) {
  const items = (Array.isArray(guidance) ? guidance : Object.values(guidance ?? {}))
    .filter((item) => typeof item === "string" && item.trim());

  if (items.length === 0) {
    return null;
  }

  return (
    <div hidden data-md-only="true">
      <blockquote>
        <p>
          <strong>Using this {isGuide ? "guide" : "page"} with an AI assistant</strong>
        </p>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </blockquote>
    </div>
  );
}
