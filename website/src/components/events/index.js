import React from 'react';
import feedStyles from './styles.module.css';

const WEBINARS_URL = 'https://www.getdbt.com/resources/webinars';

/**
 * Embeds the dbt Labs webinars hub (upcoming and on-demand sessions).
 * Used on /community/events and available as <EventsFeed /> in MDX.
 */
export default function EventsFeed() {
  return (
    <div className={feedStyles.webinarsWrap}>
      <iframe
        src={WEBINARS_URL}
        title="dbt Labs webinars and events"
        className={feedStyles.webinarsEmbed}
        loading="lazy"
      />
      <p className={feedStyles.webinarsFallback}>
        If the page does not appear,{' '}
        <a href={WEBINARS_URL} target="_blank" rel="noopener noreferrer">
          open the webinars page on getdbt.com
        </a>
        .
      </p>
    </div>
  );
}
