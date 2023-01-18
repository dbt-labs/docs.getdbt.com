import React, { useEffect } from 'react'
import feedStyles from './styles.module.css';

export default function EventsFeed(styles = {}) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.addevent.com/libs/cal/js/cal.events.embed.t3.init.js';
    script.async = true;
    document.body.appendChild(script);
  }, [])
  return (
    <div className="dbt-events-feed" style={styles}>
      <div className={`ae-emd-cal-events ${feedStyles.aeEmbed}`} data-calendar="Tb314369" data-lbl-upcoming="Upcoming events" data-lbl-subscribe="Subscribe" data-no-events="No events found.." data-lbl-readmore="Read more" data-include-atc="true" data-include-stc="true" data-include-moupcpicker="true" data-include-location="false" data-include-timezone="false" data-include-organizer="false" data-include-countdown="false" data-include-description="false" data-include-timezone-select="false" data-default-view="upcoming" data-stayonpage="false" data-datetime-format="1" data-datetime-language="en_US" data-events-max="20" data-description-length="brief" ></div>
    </div>
  )
}
