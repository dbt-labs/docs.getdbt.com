import React from "react";
import Link from "@docusaurus/Link";

function isMarkdownLink(string) {
  const regex = /(?<escape>\\?)\[(?<text>.*?)\]\((?<url>.*?)\)/;
  const linkMatch = string.match(regex);

  if (!linkMatch) {
    return null;
  } else {
    var escape = linkMatch.groups.escape == "\\";
    var full = linkMatch[0];
    var original_length = full.length;

    if (escape) {
      full = full.substring(1);
    }

    return {
      text: linkMatch.groups.text,
      url: linkMatch.groups.url,
      full: full,
      index: linkMatch.index,
      escape: escape,
      original_length: original_length,
    };
  }
}

function makeToken(content, types) {
  if (!types) {
    types = ["text"];
  }

  return {
    types: types,
    content: content,
  };
}

function makeLink(text, url) {
  const link = (
    <Link className="code-link" href={url}>
      {text}
    </Link>
  );
  return makeToken(link);
}

/*
 * Rebuilding a line as plain tokens loses Prism's highlighting, so find
 * where a "#" comment starts and re-tag the rest of the line as a comment.
 * "#{" is skipped: that's string interpolation, not a comment.
 */
function commentStart(string) {
  const regex = /#(?!\{)/;
  const match = string.match(regex);

  return match ? match.index : -1;
}

/*
 * Push a plain text segment, splitting off a trailing comment if one
 * starts here. Returns true once the line is inside a comment, so
 * following segments stay comment-colored.
 */
function pushText(tokens, string, inComment) {
  if (!string) {
    return inComment;
  }

  if (inComment) {
    tokens.push(makeToken(string, ["comment"]));
    return true;
  }

  const hashIndex = commentStart(string);
  if (hashIndex === -1) {
    tokens.push(makeToken(string));
    return false;
  }

  if (hashIndex > 0) {
    tokens.push(makeToken(string.slice(0, hashIndex)));
  }
  tokens.push(makeToken(string.slice(hashIndex), ["comment"]));
  return true;
}

function replaceLinks(line) {
  /*
   * Loop until input line is empty!
   */

  var tokens = [];
  var inComment = false;
  let lineBuffer = line;
  while (lineBuffer.length > 0) {
    let res = isMarkdownLink(lineBuffer);
    if (!res) {
      // only include contents to end of line
      // if we've already found a link. Otherwise,
      // we just want to return null and escape below
      if (tokens.length > 0) {
        pushText(tokens, lineBuffer, inComment);
      }
      break;
    }

    var before = lineBuffer.slice(0, res.index);
    var after = lineBuffer.slice(res.index + res.original_length);

    inComment = pushText(tokens, before, inComment);
    if (res.escape) {
      tokens.push(makeToken(res.full, inComment ? ["comment"] : undefined));
    } else {
      // links stay clickable even inside a comment
      tokens.push(makeLink(res.text, res.url));
    }
    lineBuffer = after;
  }

  if (tokens.length == 0) {
    return null;
  } else {
    return tokens;
  }
}

export default function squashLinks(lineTokens) {
  const asString = lineTokens.map((t) => t.content).join("");
  const linked = replaceLinks(asString);

  if (linked) {
    return linked;
  } else {
    return lineTokens;
  }
}
