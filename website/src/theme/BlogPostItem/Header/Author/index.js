import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
function MaybeLink(props) {
  if (props.href || props.slug) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

/* dbt Customizations:
 * Gets 'key' from author props
 * Does not use 'MaybeLink', instead
 * always uses link and sets url to /author/{key}
*/

export default function BlogPostItemHeaderAuthor({author, className}) {
  const {name, url, imageURL, email, key, job_title, organization} = author;
  const link = url || (email && `mailto:${email}`) || undefined;
  return (
    <div className={clsx('avatar margin-bottom--sm', className)}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img className="avatar__photo" src={imageURL} alt={name} />
        </MaybeLink>
      )}

      {name && (
        <div
          className="avatar__intro"
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person">
          <div className="avatar__name">
            <Link href={`/author/${key}`} itemProp="url">
              <span itemProp="name">{name}</span>
            </Link>
          </div>
          {job_title && organization && (
            <small className="avatar__subtitle" itemProp="description">
              {job_title && job_title} {organization && `@ ${organization}`} 
            </small>
          )}
        </div>
      )}
    </div>
  );
}
