Set an expiration when you create the token so a token stops working on its own, even if you forget about it. You can't change it later, so if you need a different expiry, create a new token. The expiration options are:

- **No expiry** (default)
- **7 days**
- **14 days**
- **30 days**
- **90 days**
- **365 days**

The **Expires** column on the **{props.pageName}** page shows the date and time each token stops working, in GMT. Existing tokens without an expiration don’t expire. You can’t add an expiration to an existing token, so to set one, create a new token and replace the old one in your system.

<Lightbox src="/img/docs/dbt-platform/api-tokens/token-list-expires-column.png" width="95%" title="The Expires column shows when each token stops working" />

After the expiration date, requests that use the token will fail. Create {props.newToken} and update your systems before then.
