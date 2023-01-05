import React from "react";
import Layout from "@theme/Layout";
import Hero from "@site/src/components/hero";
import { HubSpotForm } from "@site/src/components/hubspotForm";

function ReportAProblem() {
  return (
    <>
      <Layout>
        <div
          className="container container--fluid home"
          style={{ padding: "0", background: "#FFF" }}
        >
          <Hero
            heading="Report a problem"
            subheading="Lorem ipsum, report a problem about the docs site subtext belongs here."
            showGraphic
          />
          <section className="report-a-problem">
            <div>
              <HubSpotForm
                region="na1"
                portalId="21770202"
                formId="51549be8-d959-419b-950d-bd2b085942fc"
                sfdcCampaignId="7014v0000022cGhAAI"
                containerId="report-hubspot-form"
              />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

export default ReportAProblem;
