import React from 'react';

import Link from '@docusaurus/Link';

const ENV = process ? process.env : {};

const docsFiles = require.context(
    '../../../docs/',
    true,
    /\.md$/
);

var slugs = {};
var sources = {};
docsFiles.keys().forEach(function(key) {
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
      console.error(message);
  }

  slugs[slug] = meta;
  sources[meta.source] = meta
});

function findSource(source_href) {
    var stripped_source_href = source_href.replace(/.md$/, '')
    if (!stripped_source_href.startsWith('/')) {
        stripped_source_href = '/' + stripped_source_href;
    }
    var found = null;
    for (var source in sources) {
        var stripped_source = source.replace(/.md$/, '')
        var is_match = stripped_source.endsWith(stripped_source_href);
        if (is_match && !found) {
            found = sources[source];
        } else if (is_match && found) {
            // The link is ambiguous. Pick one, but error?
            var msg = (
                `Ambiguous link slug: "${source_href}"\n`
                + `- Two matched:, "${found.id}", "${sources[source].id}"`
            );

            console.error(msg);
            if (ENV.DOCS_ENV == 'build') {
                throw new Error(`Ambiguous link detected: ${msg}`)
            }
        }
    }
    return found;
}

function expandRelativeLink(href, ignoreInvalid) {
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

    var isExternal = !!link.match(/https?:/) || !!link.match(/:/);

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
    } else if (!isExternal && !href.startsWith('/')) {
        if (ENV.DOCS_ENV == 'build' && !ignoreInvalid) {
            console.log(` - Broken link detected ${href}`);
            throw new Error("Broken link")
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

