import React, { useEffect } from 'react'
import feedStyles from './styles.module.css';

export default function DiscourseFeed(styles = {}) {
  return (
    <section className={feedStyles.discourseSection}>
      <h1>dbt Discourse</h1>
      <div className={feedStyles.discoursePosts}>
        <h2>Latest posts</h2>
        <ul>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
        </ul>
        <a class={`button button--primary ${feedStyles.discourseCta}`} href="https://discourse.getdbt.com/" title="See all latest posts" target="_blank">See all latest posts</a>
      </div>
      <div className={feedStyles.discoursePosts}>
        <h2>Fun title</h2>
        <ul>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
        </ul>
        <a class={`button button--primary ${feedStyles.discourseCta}`} href="https://discourse.getdbt.com/" title="See all latest posts" target="_blank">See all latest posts</a>
      </div>
      <div className={feedStyles.discoursePosts}>
        <h2>Another fun title</h2>
        <ul>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
          <li>
            <a href="#" title="title">Local Variable/set variable usage in config block</a>
            <span> - by username</span>
          </li>
        </ul>
        <a class={`button button--primary ${feedStyles.discourseCta}`} href="https://discourse.getdbt.com/" title="See all latest posts" target="_blank">See all latest posts</a>
      </div>
    </section>
  )
}
