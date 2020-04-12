
import React from 'react';
import Link from '@site/src/components/link';

function isMarkdownLink(string) {
  const regex = /\[(.*?)\]\((.*?)\)/
  const linkMatch = string.match(regex)

  if (!linkMatch) {
      return null;
  } else {
      return {
          full: linkMatch[0],
          text: linkMatch[1],
          url:  linkMatch[2],
          index: linkMatch.index
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
        var after = lineBuffer.slice(res.index + res.full.length)
        tokens.push(makeToken(before))
        tokens.push(makeLink(res.text, res.url));
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
