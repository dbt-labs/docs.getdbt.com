import React from 'react';

import Link from '@docusaurus/Link';

const docsFiles = require.context(
    '../../../docs/',
    true,
    /\.md$/
);

var slugs = {};
docsFiles.keys().forEach(function(key, i) {
  var doc = docsFiles(key);
  var meta = doc.metadata;
  if (!meta) {
      // how?
      return
  }

  var slugParts = meta.id.split("/");
  var slug = slugParts[slugParts.length - 1];

  if (slugs[slug]) {
      var message = `Duplicate slug found: ${slug}\n`;
      message += ` - ${meta.source}\n`;
      message += ` - ${slugs[slug].source}`;
      //throw new Error(message);
      console.error(message);
  }

  slugs[slug] = meta;
});


function expandRelativeLink(href, ignoreInvalid) {
    var env = process ? process.env : {};
    if (!href) {
        //throw new Error(`Broken link detected (href is undefined)`)
        // how does this happen?
        return {bad: true, link: href};
    }

    var [link, hash] = href.split("#")

    if (!link && hash) {
        // relative in-page link, it's fine
        return {bad: false, link: href};
    } else if (link && !hash) {
        // hash is missing, that's also very ok
        hash = ''
    }

    if (slugs[link]) {
        return {
            bad: false,
            link: `${slugs[link].permalink}#${hash}`
        }
    } else if (link.indexOf("/") == -1) {
        if (env.DOCS_ENV == 'build' && !ignoreInvalid) {
            throw new Error(`Broken link detected ${href}`)
        } else {
            return {
                bad: true,
                link: href
            }
        }
    }

    return {bad: false, link: href};
}


function CheckedLink({children, href, ignoreInvalid}) {
  var style = {};
  const {bad, link} = expandRelativeLink(href, ignoreInvalid);
  if (bad) {
      style['borderBottom'] = '2px dashed #ff6961'
  }

  return (
      <Link style={style} href={link}>{children}</Link>
  );
}

export default CheckedLink;

