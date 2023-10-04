import React from 'react';
import MDXHead from '@theme/MDXComponents/Head';
import MDXCode from '@theme/MDXComponents/Code';
import MDXPre from '@theme/MDXComponents/Pre';
import MDXDetails from '@theme/MDXComponents/Details';
import MDXHeading from '@theme/MDXComponents/Heading';
import MDXUl from '@theme/MDXComponents/Ul';
import MDXImg from '@theme/MDXComponents/Img';
import MDXA from '@theme/MDXComponents/A';
import Admonition from '@theme/Admonition';
import Mermaid from '@theme/Mermaid';

/* dbt Customizations:
 * Imports the following components below for export
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
import LoomVideo from '@site/src/components/loom';
import Snippet from '@site/src/components/snippet';
import YoutubeVideo from '@site/src/components/youtube';
import WistiaVideo from '@site/src/components/wistia';
import VersionBlock from '@site/src/components/versionBlock';
import Var from '@site/src/components/variable';
import Term from '@site/src/components/term';
import EventsFeed from '@site/src/components/events';
import { DiscourseFeed, DiscourseHelpFeed } from '@site/src/components/discourse';
import Hero from '@site/src/components/hero'
import Card from '@site/src/components/card'
import Callout from '@site/src/components/callout'
import BlogPostCard from '@site/src/components/blogPostCard';
import DocCarousel from '@site/src/components/docCarousel';
import PostCarousel from '@site/src/components/postCarousel';
import CommunitySpotlightCard from '@site/src/components/communitySpotlightCard';
import CommunitySpotlightList from '@site/src/components/communitySpotlightList';
import dbtEditor from '@site/src/components/dbt-editor';
import Mentorship from '@site/src/components/mentorship';

const MDXComponents = {
  head: MDXHead,
  code: MDXCode,
  a: MDXA,
  pre: MDXPre,
  details: MDXDetails,
  ul: MDXUl,
  img: MDXImg,
  h1: (props) => <MDXHeading as="h1" {...props} />,
  h2: (props) => <MDXHeading as="h2" {...props} />,
  h3: (props) => <MDXHeading as="h3" {...props} />,
  h4: (props) => <MDXHeading as="h4" {...props} />,
  h5: (props) => <MDXHeading as="h5" {...props} />,
  h6: (props) => <MDXHeading as="h6" {...props} />,
  admonition: Admonition,
  mermaid: Mermaid,

  BlogPostCard: BlogPostCard,
  Callout: Callout,
  Card: Card,
  Changelog: Changelog,
  CloudCore: CloudCore,
  Collapsible: Collapsible,
  DocCarousel: DocCarousel,
  FAQ: FAQ,
  FAQList: FAQList,
  File: File,
  Hero: Hero,
  Lightbox: Lightbox,
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
  CommunitySpotlightCard,
  CommunitySpotlightList,
  dbtEditor: dbtEditor,
  Mentorship: Mentorship,
};
export default MDXComponents;
