
import React from 'react';
import Link from '@site/src/components/link';

function isMarkdownLink(string) {
  const regex = /\[(.*?)\]\((.*?)\)/
  const linkMatch = string.match(regex)

  if (!linkMatch) {
      return null;
  } else {
      const [ _, text, url ] = linkMatch
      return (<Link className="code-link" href={url}>{text}</Link>);
  }
}

function consumeLink(tokens) {
    /*
     * Accepts a list of tokens
     * Returns a list with two sets of tokens:
     *    1) consumed tokens
     *    2) remaining tokens
     */

    let tokenBuffer = [];
    let stringBuffer = "";
    let i = 0;
    for (let i=0; i < tokens.length; i++) {
        let token = tokens[i];
        tokenBuffer.push(token);
        stringBuffer += token.content;
        let link = isMarkdownLink(stringBuffer);
        if (link) {
            let linkToken = tokenBuffer[0];
            linkToken.content = link;

            let rest = tokens.slice(i + 1);
            console.log("linkToken", linkToken);
            console.log("rest", rest);
            return [ [linkToken], rest ];
        }
    };

    return [ tokenBuffer, [] ]

}

export default function squashLinks(lineTokens) {
  let squashed = [];
  let rest = lineTokens;

  while (rest.length > 0) {
      let [ consumed, remaining ] = consumeLink(rest);
      console.log("meep", consumed, remaining)
      rest = remaining;
      squashed = squashed.concat(consumed);
  }

  return squashed;
}
