import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';

// Recovery links surfaced on the 404 page. These give both people and agents
// a clear "where to look next" map (docs index, sitemap, and the llms.txt
// feeds) so a broken or guessed URL doesn't turn into a dead end.
const recoveryLinks = [
  {to: '/docs/introduction', label: 'Docs home', external: false},
  {to: '/guides', label: 'Guides', external: false},
  {to: '/reference/references-overview', label: 'Reference', external: false},
  {to: '/blog', label: 'Developer blog', external: false},
  {to: '/sitemap.xml', label: 'Sitemap (sitemap.xml)', external: true},
  {to: '/llms.txt', label: 'llms.txt', external: true},
  {to: '/llms-full.txt', label: 'llms-full.txt', external: true},
];

export default function NotFoundContent({className}) {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              DAG! Page not found
            </Translate>
          </Heading>
          <p>
            We couldn't find that page. It may have moved, been renamed, or
            never existed. No worries, nothing is broken on your end -- the URL just doesn't
            match a page in the dbt Developer Hub.
          </p>
          <p>Here's where to look next:</p>
          <ul>
            {recoveryLinks.map(({to, label, external}) => (
              <li key={to}>
                {external ? (
                  <a href={to}>{label}</a>
                ) : (
                  <Link to={to}>{label}</Link>
                )}
              </li>
            ))}
          </ul>
          <p>
            You can also search the whole site with the search bar in the top
            navigation (or press <kbd>⌘</kbd> <kbd>K</kbd>). Machine-readable
            indexes of every page live at <a href="/llms.txt">/llms.txt</a> and{' '}
            <a href="/sitemap.xml">/sitemap.xml</a>.
          </p>
          <p>
            Building an agent or script? Every docs page also has a plain
            markdown version — just add <code>.md</code> at the end of any docs URL (for
            example <a href="/docs/introduction.md">/docs/introduction.md</a>) to
            fetch the raw markdown instead of the rendered HTML page.
          </p>
        </div>
      </div>
    </main>
  );
}
