/**
 * Schema generators for different structured data types
 */

/**
 * Generate common properties shared across all schema types
 */
export function getCommonProperties({ title, description, url, date, dateModified, tags, siteConfig }) {
  const properties = {
    "@context": "https://schema.org",
    name: title,
    description: description,
    url: url,
    inLanguage: "en-US",
    mainEntityOfPage: url,
    keywords: tags?.map((tag) => (typeof tag === 'string' ? tag : tag.label)).join(","),
    publisher: {
      "@type": "Organization",
      name: "dbt Labs",
      logo: {
        "@type": "ImageObject",
        url: siteConfig.url + "/img/dbt-logo.svg",
      },
    },
  };

  // Add dates if provided
  if (date) {
    properties.datePublished = date;
  }
  if (dateModified) {
    properties.dateModified = dateModified;
  } else if (date) {
    // Fallback to datePublished if dateModified not provided
    properties.dateModified = date;
  }

  return properties;
}

/**
 * Generate BlogPosting schema
 */
export function generateBlogPostingSchema({ title, authors, imageUrl, commonProperties }) {
  return {
    ...commonProperties,
    "@type": "BlogPosting",
    headline: title,
    author:
      authors?.map((author) => ({
        "@type": "Person",
        name: author.name,
      })) || [],
    image: imageUrl,
  };
}

/**
 * Generate HowTo schema
 */
export function generateHowToSchema({ totalTime, commonProperties }) {
  const schema = {
    ...commonProperties,
    "@type": "HowTo",
    author: {
      "@type": "Organization",
      name: "dbt Labs",
    },
  };

  // Add totalTime if provided (should be in ISO 8601 duration format, e.g., "PT30M")
  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

/**
 * Generate TechArticle schema
 */
export function generateTechArticleSchema({ commonProperties }) {
  return {
    ...commonProperties,
    "@type": "TechArticle",
    author: {
      "@type": "Organization",
      name: "dbt Labs",
    },
  };
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema({ commonProperties }) {
  return {
    ...commonProperties,
    "@type": "WebPage",
    author: {
      "@type": "Organization",
      name: "dbt Labs",
    },
  };
}
