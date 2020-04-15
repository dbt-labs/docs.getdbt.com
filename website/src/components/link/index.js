import React from 'react';

import Link from '@docusaurus/Link';

const docsFiles = require.context(
    '../../../docs/',
    true,
    /\.md$/
);

var slugs = {};
var sources = {};
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
  sources[meta.source] = meta
});

function findSource(source_href) {
    var stripped_source_href = source_href.replace(/.md$/, '')
    var found = null;
    for (var source in sources) {
        var stripped_source = source.replace(/.md$/, '')
        if (stripped_source.endsWith(stripped_source_href)) {
            found = sources[source];
            break;
        }
    }
    return found;
}

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

    var tmp = document.createElement('a');
    tmp.href = link;
    var isExternal = tmp.hostname != window.location.hostname;

    var sourceLink = findSource(link);
    if (sourceLink) {
        return {
            bad: false,
            link: `${sourceLink.permalink}#${hash}`
        }
    } else if (slugs[link]) {
        return {
            bad: false,
            link: `${slugs[link].permalink}#${hash}`
        }
    } else if (!isExternal) {
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


function CheckedLink({children, href, ignoreInvalid, className}) {
  var style = {};
  const {bad, link} = expandRelativeLink(href, ignoreInvalid);
  if (bad) {
      style['borderBottom'] = '2px dashed #ff6961'
  }

  return (
      <Link className={className} style={style} href={link}>{children}</Link>
  );
}

export default CheckedLink;

