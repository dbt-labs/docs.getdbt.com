import React from 'react';

function Alert({children, type}) {
  return (
      <div className={'alert alert-' + type}>
        <div style={{display: "inline"}}>
            <span>
                { type == 'info' ? 'ℹ️' : null }
                { type == 'danger' ? '❌' : null }
                { type == 'warning' ? '⚠️': null }
                { type == 'success' ? '✅' : null }
            </span>
        </div>&nbsp;
        {children}
      </div>
  );
}

export default Alert;

