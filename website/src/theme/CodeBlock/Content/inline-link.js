
import React from 'react';
import Link from '@docusaurus/Link';

function isMarkdownLink(string) {
  const regex = /(?<escape>\\?)\[(?<text>.*?)\]\((?<url>.*?)\)/
  const linkMatch = string.match(regex)

  if (!linkMatch) {
      return null;
  } else {
      var escape = linkMatch.groups.escape == '\\';
      var full = linkMatch[0];
      var original_length = full.length;

      if (escape) {
          full = full.substring(1)
      }

      return {
          text: linkMatch.groups.text,
          url:  linkMatch.groups.url,
          full: full,
          index: linkMatch.index,
          escape: escape,
          original_length: original_length,
      }
  }
}

function makeToken(content, types) {
    if (!types) {
        types = ['text']
    }

    return {
        types: types,
        content: content
    }
}

function makeLink(text, url) {
    const link = <Link className="code-link" href={url}>{text}</Link>;
    return makeToken(link);
}

function replaceLinks(line) {
    /*
     * Loop until input line is empty!
     */

    var tokens = [];
    let lineBuffer = line;
    while (lineBuffer.length > 0) {
        let res = isMarkdownLink(lineBuffer);
        if (!res) {
            // only include contents to end of line
            // if we've already found a link. Otherwise,
            // we just want to return null and escape below
            if (tokens.length > 0) {
                tokens.push(makeToken(lineBuffer));
            }
            break;
        }

        var before = lineBuffer.slice(0, res.index)
        var after = lineBuffer.slice(res.index + res.original_length)
        tokens.push(makeToken(before))
        if (res.escape) {
            tokens.push(makeToken(res.full));
        } else {
            tokens.push(makeLink(res.text, res.url));
        }
        lineBuffer = after
    }

    if (tokens.length == 0) {
        return null;
    } else {
        return tokens
    }
}

export default function squashLinks(lineTokens) {
  const asString = lineTokens.map(t => t.content).join("")
  const linked = replaceLinks(asString)

  if (linked) {
      return linked;
  } else {
      return lineTokens;
  }
}
