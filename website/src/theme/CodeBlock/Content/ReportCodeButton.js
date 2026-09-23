import React, {useCallback} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import tooltipStyles from './ReportCodeButton.module.css';

const REPO_ISSUES_URL = 'https://github.com/dbt-labs/docs.getdbt.com/issues/new';

/**
 * ReportCodeButton
 * Sits in a code block's button group (next to copy / word-wrap) and opens a
 * prefilled GitHub issue so readers can report incorrect code in one click.
 * The page URL and code language are filled in for us, and the code snippet is
 * included so maintainers can find it fast.
 */
export default function ReportCodeButton({className, code, language}) {
  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    const pageUrl = window.location.href;
    const langLabel = language ? ` (${language})` : '';
    const title = `Incorrect code${langLabel} on ${window.location.pathname}`;
    const body = [
      '## What page?',
      pageUrl,
      '',
      '## What code is wrong?',
      'Describe what is incorrect and what the code should be.',
      '',
      '## Code snippet',
      '```' + (language || ''),
      (code || '').trim(),
      '```',
    ].join('\n');

    const url = `${REPO_ISSUES_URL}?title=${encodeURIComponent(
      title,
    )}&body=${encodeURIComponent(body)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }, [code, language]);

  const label = translate({
    id: 'theme.CodeBlock.reportCode',
    message: 'Report incorrect code',
    description: 'The label for the report incorrect code button',
  });

  return (
    <span className={tooltipStyles.reportWrap}>
      <button
        type="button"
        aria-label={label}
        className={clsx('clean-btn', className)}
        onClick={handleClick}>
        <svg viewBox="0 0 512 512" width="1.125rem" height="1.125rem" aria-hidden="true">
          <path
            fill="currentColor"
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          />
        </svg>
      </button>
      <span className={tooltipStyles.tooltip} role="tooltip">
        {label}
      </span>
    </span>
  );
}
