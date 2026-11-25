import llmsContentSelectors from '../../plugins/llmsContentSelectors';

// The llms-txt plugin converts the first element matched by the first selector
// that matches anything (extractContent in the plugin's html-parser.js). Mirror
// that here to check which element each kind of page hands to the converter.
function selectContent(html) {
  document.body.innerHTML = html;
  for (const selector of llmsContentSelectors) {
    const element = document.querySelector(selector);
    if (element) return { selector, element };
  }
  return null;
}

describe('llms-txt content selectors', () => {
  it('puts the data-md-root marker ahead of the plugin defaults', () => {
    expect(llmsContentSelectors[0]).toBe('[data-md-root]');
    expect(llmsContentSelectors).toEqual(
      expect.arrayContaining(['.theme-doc-markdown', 'article', 'main']),
    );
  });

  it('converts the whole homepage, not just the first card', () => {
    const { selector, element } = selectContent(`
      <nav>Navbar</nav>
      <div class="container container--fluid home" data-md-root="true">
        <h1>The dbt Developer Hub</h1>
        <section><h2>New to dbt? Start here.</h2>
          <article><h3>Get started with dbt</h3></article>
          <article><h3>About dbt</h3></article>
        </section>
      </div>
      <footer>Footer</footer>
    `);
    expect(selector).toBe('[data-md-root]');
    expect(element.querySelector('h1')).toHaveTextContent('The dbt Developer Hub');
    expect(element.querySelectorAll('article')).toHaveLength(2);
    expect(element.textContent).not.toContain('Navbar');
  });

  it('leaves docs pages on the plugin default selector', () => {
    const { selector } = selectContent(`
      <main><div class="container"><div class="row"><div class="col">
        <article><div class="theme-doc-markdown markdown"><h1>Doc</h1></div></article>
      </div></div></div></main>
    `);
    expect(selector).toBe('.theme-doc-markdown');
  });
});
