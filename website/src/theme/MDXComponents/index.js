/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { isValidElement } from "react";
import Head from "@docusaurus/Head";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Details from "@theme/Details";
import "./styles.css"; // MDX elements are wrapped through the MDX pragma. In some cases (notably usage
// with Head/Helmet) we need to unwrap those elements.

/*
 * docs.getdbt.com additions:
 */
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem'
import Changelog from '@site/src/components/changelog';
import CloudCore from '@site/src/components/cloudcore';
import WHCode from '@site/src/components/whcode';
import Collapsible from '@site/src/components/collapsible';
import FAQ from '@site/src/components/faqs';
import FAQList from '@site/src/components/faqList';
import File from '@site/src/components/file';
import Lightbox from '@site/src/components/lightbox';
import Link from '@site/src/components/link';
import LoomVideo from '@site/src/components/loom';
import Snippet from '@site/src/components/snippet';
import YoutubeVideo from '@site/src/components/youtube';
import WistiaVideo from '@site/src/components/wistia';
import VersionBlock from '@site/src/components/versionBlock';
import Var from '@site/src/components/variable';
import Term from '@site/src/components/term';
import EventsFeed from '@site/src/components/events';
import { DiscourseFeed, DiscourseHelpFeed }  from '@site/src/components/discourse';
import Hero from '@site/src/components/hero'
import Card from '@site/src/components/card'
import Callout from '@site/src/components/callout'
import BlogPostCard from '@site/src/components/blogPostCard';
import PostCarousel from '@site/src/components/postCarousel';

function unwrapMDXElement(element) {
  if (element?.props?.mdxType && element?.props?.originalType) {
    const { mdxType, originalType, ...newProps } = element.props;
    return React.createElement(element.props.originalType, newProps);
  }

  return element;
}

const MDXComponents = {
  head: (props) => {
    const unwrappedChildren = React.Children.map(props.children, (child) =>
      unwrapMDXElement(child)
    );
    return <Head {...props}>{unwrappedChildren}</Head>;
  },
  code: (props) => {
    const inlineElements = [
      "a",
      "b",
      "big",
      "i",
      "span",
      "em",
      "strong",
      "sup",
      "sub",
      "small",
    ];
    const shouldBeInline = React.Children.toArray(props.children).every(
      (el) =>
        (typeof el === "string" && !el.includes("\n")) ||
        (React.isValidElement(el) && inlineElements.includes(el.props.mdxType))
    );
    return shouldBeInline ? <code {...props} /> : <CodeBlock {...props} />;
  },
  a: (props) => <Link {...props} />,
  pre: (props) => (
    <CodeBlock // If this pre is created by a ``` fenced codeblock, unwrap the children
      {...(isValidElement(props.children) &&
      props.children.props.originalType === "code"
        ? props.children?.props
        : { ...props })}
    />
  ),
  details: (props) => {
    const items = React.Children.toArray(props.children); // Split summary item from the rest to pass it as a separate prop to the
    // Details theme component

    const summary = items.find((item) => item?.props?.mdxType === "summary");
    const children = <>{items.filter((item) => item !== summary)}</>;
    return (
      <Details {...props} summary={summary}>
        {children}
      </Details>
    );
  },
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,

  BlogPostCard: BlogPostCard,
  Callout: Callout,
  Card: Card,
  Changelog: Changelog,
  CloudCore: CloudCore,
  Collapsible: Collapsible,
  FAQ: FAQ,
  FAQList: FAQList,
  File: File,
  Hero: Hero,
  Lightbox: Lightbox,
  Link: Link,
  LoomVideo: LoomVideo,
  PostCarousel: PostCarousel,
  Tabs: Tabs,
  TabItem: TabItem,
  Snippet: Snippet,
  WistiaVideo: WistiaVideo,
  WHCode: WHCode,
  YoutubeVideo: YoutubeVideo,
  VersionBlock: VersionBlock,
  Var: Var,
  Term: Term,
  EventsFeed: EventsFeed,
  DiscourseFeed: DiscourseFeed,
  DiscourseHelpFeed: DiscourseHelpFeed,
  Card: Card,
};
export default MDXComponents;
