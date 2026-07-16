Run the following command, replacing `<client-id>`, `<client-secret>`, `<application-ID-URI>`, and `<tenant-id>` with your actual values:

```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'client_id=<client-id> \
  &scope=<application-ID-URI>/.default \
  &client_secret=<client-secret> \
  &grant_type=client_credentials' \
  'https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token'
```

The response will include an `access_token`. You can decode this token using [jwt.io](https://jwt.io) to view the `sub` claim value.

