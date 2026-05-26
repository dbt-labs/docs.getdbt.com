import React from 'react';
import Lifecycle from '@site/src/components/lifeCycle';

export default function ReleaseNote({ status, children }) {
  return (
    <div
      className="rn-entry"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.375rem',
        marginBottom: '0.4rem',
      }}
    >
      <Lifecycle status={status} size="70" />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
