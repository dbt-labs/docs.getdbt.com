import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import IntroText from "@site/src/components/IntroText";
import QuickstartTOC from "@site/src/components/quickstartTOC";
import {QuickstartGuideTitle} from "../../../components/quickstartGuideCard";
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

  const { metadata, frontMatter } = useDoc();
  const isQuickstartGuide = metadata?.id?.startsWith("guides/");

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}

      {frontMatter.intro_text && (
        <IntroText>{frontMatter.intro_text}</IntroText>
      )}

      {isQuickstartGuide ? (
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

      <Feedback />
    </div>
  );
}
