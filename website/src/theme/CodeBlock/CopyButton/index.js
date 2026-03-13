import React, {useState} from 'react';

export default function CopyButton({className, code}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }
    } catch (e) {
      // ignore copy failures
    }
  };

  return (
    <button
      type="button"
      className={className}
      aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
      onClick={handleClick}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

