To begin building models with natural language prompts in the <Constant name="visual_editor" />:

1. Click on the **dbt Copilot** icon in <Constant name="visual_editor" /> menu.
2. In the dbt Copilot prompt box, enter your prompt in natural language for <Constant name="copilot" /> to build the model(s) you want. You can also reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll pull in and reference the `orders` model.
3. Click **Generate** and dbt Copilot generates a summary of the model(s) you want to build. 
   - To start over, click on the **+** icon. To close the prompt box, click **X**.
   <Lightbox src="/img/docs/dbt-cloud/copilot-generate.jpg" width="40%" title="Enter a prompt in the dbt Copilot prompt box to build models using natural language" />
4. Click **Apply** to generate the model(s) in the <Constant name="visual_editor" />.
5. dbt Copilot displays a visual "diff" view to help you compare the proposed changes with your existing code. Review the diff view in the canvas to see the generated operators built by<Constant name="copilot" />:
   - White: Located in the top of the canvas and means existing set up or blank canvas that will be removed or replaced by the suggested changes.
   - Green: Located in the bottom of the canvas and means new code that will be added if you accept the suggestion. <br / >
   <Lightbox src="/img/docs/dbt-cloud/copilot-diff.jpg" width="100%" title="Visual diff view of proposed changes" />
6. Reject or accept the suggestions
7. In the **generated** operator box, click the play icon to preview the data
8. Confirm the results or continue building your model.
   <Lightbox src="/img/docs/dbt-cloud/copilot-output.jpg" width="100%" title="Use the generated operator with play icon to preview the data" />
9.  To edit the generated model, open **<Constant name="copilot" />** prompt box and type your edits. 
10. Click **Submit** and <Constant name="copilot" /> will generate the revised model. Repeat steps 5-8 until you're happy with the model.
