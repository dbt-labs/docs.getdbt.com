// ReleaseStatus.js
import React from 'react';
import './custom.css'; //  import path

function ReleaseStatus({ status }) {
  return (
    <div className={`release-status release-status-${status.toLowerCase()}`}>
      {status}
    </div>
  );
}

export default ReleaseStatus;
