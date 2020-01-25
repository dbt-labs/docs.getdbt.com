import React from 'react';

import styles from './styles.module.css';

function Lightbox({children, src, title}) {
  return (
    <div className='text-left'>
        <a href="#" data-featherlight={src}>
            <img
                data-toggle="lightbox"
                width="300px"
                alt={title}
                src={src}
                className="docImage" />
        </a>
    </div>
  );
}

export default Lightbox;

