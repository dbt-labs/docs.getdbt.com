With dbt <Term id="managed" /> inference, you can switch between the supported managed models at any using the model picker dropdown next to the **Agent mode** control (where you choose **Ask for approval** or **Edit files automatically**). 

- In [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) and the [<Constant name="wizard" /> home tab](/docs/platform/wizard-home), open the model picker dropdown next to the **Agent mode** control in the <Constant name="wizard" /> panel, then select a model.
- The picker lists the managed models available to you. Refer to the [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for the available models and their token rates.
- If you [bring your own key (BYOK)](/docs/dbt-ai/wizard-byok), <Constant name="wizard" /> uses the provider and model you configured with your key rather than the managed model picker.

<Lightbox src="/img/docs/dbt-platform/wizard-model-picker.png" width="95%" title="The model picker dropdown next to the Agent mode control in the Wizard panel." />
