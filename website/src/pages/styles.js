
import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Changelog from '@site/src/components/changelog';
import CloudCore from '@site/src/components/cloudcore';
import Collapsible from '@site/src/components/collapsible';
import FAQ from '@site/src/components/faqs';
import File from '@site/src/components/file';
import Lightbox from '@site/src/components/lightbox';
import LoomVideo from '@site/src/components/loom';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YoutubeVideo from '@site/src/components/youtube';

function Styles() {
  return (
    <Layout permalink="/">
        <div className="container">
            <div className='section' style={{marginTop: '40px'}}>
                <p>
                The following components are baked into the Markdown compilation context,
                so there is no need to import them from Markdown files. Simply add the components
                inline to use them.
                </p>
            </div>
            <div className='section' style={{marginTop: '40px'}}>
                <h1>Linked Markdown Code Blocks</h1>
<pre>{`
\`\`\`
[view the intro](docs/introduction)
\`\`\`
`}</pre>
            <CodeBlock>
[view the intro](docs/introduction)
            </CodeBlock>
            <br/>
            <p>Use a backslash to escape linking:</p>
<pre>{`
\`\`\`yml
description: "this is \\[an escaped link](docs.getdbt.com)"
\`\`\`
`}</pre>
            <CodeBlock>
description: "this is \[an escaped link](docs.getdbt.com)"
            </CodeBlock>
            </div>
            <div className='section' style={{marginTop: '40px'}}>
                <h1>Changelog</h1>
<pre>{`<Changelog>
    <p>This functionality has changed in dbt v0.16.0</p>
</Changelog>
`}</pre>
                <Changelog>This functionality has changed in dbt v0.16.0</Changelog>
            </div>
            <div className='section' style={{marginTop: '40px'}}>
                <h1>CloudCore</h1>
<pre>{`<CloudCore>
    <div>
        <p>The first div contains Cloud info</p>
    </div>
    <div>
        <p>The second div contains Core info</p>
    </div>
</CloudCore>
`}</pre>
                <CloudCore>
                    <div>
                        <p>The first div contains Cloud info</p>
                    </div>
                    <div>
                        <p>The second div contains Core info</p>
                    </div>
                </CloudCore>
            </div>
            <div className='section' style={{marginTop: '40px'}}>
                <h1>Collapsible</h1>
<pre>{`<Collapsible header="The header info">
    <div>
        <p>Shows and hides children elements</p>
    </div>
</Collapsible>
`}</pre>
                <Collapsible header="The header info">
                    <div>
                        <p>Shows and hides children elements</p>
                    </div>
                </Collapsible>
            </div>
            <div className='section' style={{marginTop: '40px'}}>
                <h1>FAQList</h1>
<pre>{`<FAQList />`}</pre>
                    <p>(Not shown)</p>
            </div>

            <div className='section' style={{marginTop: '40px'}}>
                <h1>FAQ</h1>
<pre>{`<FAQ path='Troubleshooting/sql-errors' alt_header="a header" />`}</pre>
                <FAQ path='Troubleshooting/sql-errors' />
                <FAQ path='Troubleshooting/sql-errors' alt_header="an overriden header" />
            </div>

            <div className='section' style={{marginTop: '40px'}}>
                <h1>File</h1>
<pre>{`<File name="~/.dbt/profiles.yml">

\`\`\`yml
password: hunter2
\`\`\`


</File>
`}</pre>
                <File name="~/.dbt/profiles.yml">
                    <pre>
                        password: hunter2
                    </pre>
                </File>
            </div>

            <div className='section' style={{marginTop: '40px'}}>
                <h1>Lightbox</h1>
                <pre>{`<Lightbox src="/img/dbt-logo.svg" title="The dbt logo" />`}</pre>
                <Lightbox src="/img/dbt-logo.svg" title="The dbt logo" />
            </div>

            <div className='section' style={{marginTop: '40px'}}>
                <h1>Markdown Links</h1>
                  Refer to the <a href="https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md#Links" target="_blank" rel="noreferrer">Links section</a> of the Content Style Guide to read about how you can use links in the dbt product documentation.
            </div>

            <div className='section' style={{marginTop: '40px'}}>
                <h1>LoomVideo</h1>
                <pre>{`<LoomVideo id="09919ddb02e44015878c9e93e15fe792" />`}</pre>
                <LoomVideo id="09919ddb02e44015878c9e93e15fe792" />
            </div>

            <div className='section' style={{marginTop: '40px'}}>
            <h1>Tabs</h1>
<pre>{`
<Tabs
  defaultValue="default"
  values={[
    { label: 'Default', value: 'default', },
    { label: 'Snowflake', value: 'snowflake', },
  ]
}>
<TabItem value="default">

\`\`\`sql
select id from customers
\`\`\`

</TabItem>
<TabItem value="snowflake">

\`\`\`sql
select "ID" from customers
\`\`\`

</TabItem>
</Tabs>
`}</pre>
<Tabs
  defaultValue="default"
  values={[
    { label: 'Default', value: 'default', },
    { label: 'Snowflake', value: 'snowflake', },
  ]
}>
<TabItem value="default">

<pre>
select id from customers
</pre>

</TabItem>
<TabItem value="snowflake">

<pre>
select "ID" from customers
</pre>

</TabItem>
</Tabs>
</div>
        <div className='section' style={{marginTop: '40px'}}>
                <h1>YoutubeVideo</h1>
                <pre>{`<YoutubeVideo id="5yyGT1k2xzY" />`}</pre>
                <YoutubeVideo id="5yyGT1k2xzY" />
            </div>
        </div>
    </Layout>
  );
}

export default Styles;
