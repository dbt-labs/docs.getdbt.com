import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";
import {
  getCommonProperties,
  generateBlogPostingSchema,
  generateHowToSchema,
  generateTechArticleSchema,
  generateWebPageSchema,
} from "./schemaGenerators";

export default function StructuredData({
  type,
  title,
  description,
  authors,
  date,
  dateModified,
  url,
  imageUrl,
  tags,
  totalTime,
}) {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // Determine the schema type based on route if not explicitly provided
  let schemaType = type;
  if (!schemaType) {
    // Check route to determine appropriate schema type
    if (location.pathname.includes("/guides/")) {
      schemaType = "HowTo";
    } else if (location.pathname.startsWith("/docs")) {
      schemaType = "TechArticle";
    } else {
      schemaType = "WebPage";
    }
  }

  // Get common properties shared across all schema types
  const commonProperties = getCommonProperties({
    title,
    description,
    url,
    date,
    dateModified,
    tags,
    siteConfig,
  });

  // Generate schema based on type
  let jsonLd;

  if (schemaType === "BlogPosting") {
    jsonLd = generateBlogPostingSchema({
      title,
      authors,
      imageUrl,
      commonProperties,
    });
  } else if (schemaType === "HowTo") {
    jsonLd = generateHowToSchema({
      totalTime,
      commonProperties,
    });
  } else if (schemaType === "TechArticle") {
    jsonLd = generateTechArticleSchema({
      commonProperties,
    });
  } else if (schemaType === "WebPage") {
    jsonLd = generateWebPageSchema({
      commonProperties,
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
