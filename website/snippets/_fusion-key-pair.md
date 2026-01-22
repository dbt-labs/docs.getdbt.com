We recommend using PKCS#8 format with AES-256 encryption for key pair authentication with Fusion. Fusion doesn't support legacy 3DES encryption or headerless key formats. Using older key formats may cause authentication failures.

If you encounter the `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8` error, then your private key is in the wrong format. You have two options:

- (Recommended fix) Re-export your key with modern encryption:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8
  ```

- (Temporary workaround) Add the `BEGIN` header and `END` footer to your PEM body:

  ```
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < Your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```