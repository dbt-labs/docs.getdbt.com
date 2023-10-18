import React from 'react';

const files = require.context(
  '../../../docs/faqs',
  true,
  /\.md$/
);

var faqs = [];
files.keys().forEach(function (key, i) {
  if (key.endsWith('index.md')) {
    return;
  }

  var faq = files(key);
  var meta = faq.metadata;
  var el = faq.default({});

  faqs.push(
    <div key={key} style={{ marginBottom: '10px' }}>
      <h2>
        <a className='hash-link-faq' href={meta.permalink}>#</a>
        {i + 1}. {meta.title}
      </h2>
      <div>
        {el}
      </div>
    </div>
  );
});

function FAQList({ style }) {
  return (
    <div style={style}>
      {faqs}
    </div>
  );
}

export default FAQList;
