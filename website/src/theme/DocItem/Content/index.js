import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import IntroText from "@site/src/components/IntroText";
/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/

/* dbt Customizations:
 * Import custom CommunitySpotlightCard component
 * Get metadata from useDoc within DocItemContent component
 * Check if spotlight member page
 * If so, use component rather than header
 */
import CommunitySpotlightCard from "@site/src/components/communitySpotlightCard";
import QuickstartTOC from "@site/src/components/quickstartTOC";
import {QuickstartGuideTitle} from "../../../components/quickstartGuideCard";
import styles from "./styles.module.css";
import { Feedback } from "../../../components/feedback";


function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();

  const shouldRender = 
  metadata?.id?.includes("guides/") || 
  (
    !frontMatter.hide_title && typeof contentTitle === "undefined"
  );
  
  if (!shouldRender) {
    return null;
  }

  return contentTitle || metadata.title;
}
export default function DocItemContent({ children }) {
  const syntheticTitle = useSyntheticTitle();

  // dbt Custom
  const { metadata, frontMatter } = useDoc();
  const isSpotlightMember = metadata?.id?.includes("community/spotlight/");
  const isQuickstartGuide = metadata?.id?.startsWith("guides/");

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
      {syntheticTitle && !isSpotlightMember && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}

      {/* Render IntroText if frontMatter.intro_text exists */}
      {frontMatter.intro_text && (
        <IntroText>{frontMatter.intro_text}</IntroText>
      )}

      {/* Wrap with small container if spotlight member page */}
      {isSpotlightMember ? (
        <div className={styles.spotlightMemberContain}>
          <CommunitySpotlightCard
            frontMatter={frontMatter}
            isSpotlightMember={true}
          />
          <MDXContent>{children}</MDXContent>
        </div>
      ) : isQuickstartGuide ? (
        <>
          <QuickstartGuideTitle frontMatter={frontMatter} />
          <div className={clsx("quickstart-container")}>
            <QuickstartTOC />
            <div className={clsx("step-container")}>
              <MDXContent>{children}</MDXContent>
            </div>
          </div>
        </>
      ) : (
        <MDXContent>{children}</MDXContent>
      )}

      {!isSpotlightMember ? <Feedback /> : null}
    </div>
  );
}
