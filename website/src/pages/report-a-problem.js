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
            heading="Report a problem with our website"
            subheading="Experiencing a problem on our website? Fill out the form below and we'll look into it."
            showGraphic
          />
          <section className="report-a-problem">
            <div>
              <HubSpotForm
                region="na1"
                portalId="8698602"
                formId="ca4d617f-af4f-4f9d-ba69-97dba802a5b1"
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
