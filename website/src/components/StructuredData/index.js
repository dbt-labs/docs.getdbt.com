import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
export default function StructuredData({
  title,
  description,
  authors,
  date,
  url,
  imageUrl,
  tags,
}) {
  const {siteConfig} = useDocusaurusContext();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author:
      authors?.map((author) => ({
        "@type": "Person",
        name: author.name,
      })) || [],
    datePublished: date,
    dateModified: date,
    image: imageUrl,
    url: url,
    keywords: tags?.map((tag) => tag.label).join(","),
    publisher: {
      "@type": "Organization",
      name: "dbt Labs",
      logo: {
        "@type": "ImageObject",
        url: siteConfig.url + "/img/dbt-logo.svg",
      },
    },
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
