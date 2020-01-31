import React from 'react';
import styles from './styles.module.css';

const files = require.context(
    '../../../docs/tutorial/faqs',
    true,
    /\.md$/
);

var faqs = [];
files.keys().forEach(function(key, i) {
  if (key.endsWith('index.md')) {
    return;
  }

  var faq = files(key);
  var meta = faq.metadata;
  var el = faq.default({});

  faqs.push(
     <div key={key} style={{marginBottom: '10px'}}>
        <h3>
            <a className='hash-link' href={meta.permalink}>#</a>
            {i+1}. {meta.title}
        </h3>
        <div>
            {el}
        </div>
    </div>
  );
});

function FAQList({children, style}) {
  return (
    <div style={style}>
        {faqs}
    </div>
  );
}

export default FAQList;
