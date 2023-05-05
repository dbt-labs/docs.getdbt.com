This guide assumes the names for the secret keys are: `DBT_CLOUD_SERVICE_TOKEN` and `DBT_WEBHOOK_KEY`. If you're using different names, make sure you update all references to it in the sample code.

This guide uses a short-lived code action to store the secrets, but you can also use a tool like Postman to interact with the [REST API](https://store.zapier.com/) or create a separate Zap and call the [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Create a Storage by Zapier connection
If you haven't already got one, go to <https://zapier.com/app/connections/storage> and create a new connection. Remember the UUID secret you generate for later. 

#### b. Add a temporary code step
Choose **Run Python** as the Event. Run the following code: 
```python 
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_WEBHOOK_KEY', 'abc123') #replace with webhook secret
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #replace with your dbt Cloud API token
```
Test the step. You can delete this Action when the test succeeds. The key will remain stored as long as it is accessed at least once every three months.