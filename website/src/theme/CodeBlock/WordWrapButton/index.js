import React from 'react';

export default function WordWrapButton({className, onClick, isEnabled}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={isEnabled ? 'Disable word wrap' : 'Enable word wrap'}
      onClick={onClick}>
      {isEnabled ? 'Wrap on' : 'Wrap off'}
    </button>
  );
}

