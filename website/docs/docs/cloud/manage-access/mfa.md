---
title: "Multi-factor authentication"
description: "Configure dbt Cloud MFA"
id: "mfa"
sidebar: null
---

dbt Cloud provides multiple options for multi-factor authentication (MFA). MFA provides an additional layer of security on top of username and password. The available MFA methods are:
- SMS verification code
- Authenticator app
- Webauthn-compliant security key

## Configuration

You can only have one of the three MFA methods configured per user. These are enabled at the user level, not the account level.

1. Navigate to the **Account settings** and under **Your profile** click on **Password & Security**. Click **Enroll** next to the preferred method.

<Lightbox src="/img/docs/dbt-cloud/mfa-enrollment.png" title="Select MFA enrollment method" />

Choose the next steps based on your preferred enrollment selection:

<expandable alt_header="SMS verification code" >

2. Select your country code, enter your phone number in the field, and click **Continue**.

<Lightbox src="/img/docs/dbt-cloud/sms-enter-phone.png" title="Enter your phone number information" />

3. You will receive an SMS message with a six digit code. Enter the code in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/enter-code.png" title="Enter the 6-digit code" />

</expandable>

<expandable alt_header="Authenticator app" >

2. Open your preferred authentication app (like Google Authenticator) and scan the QR code.

<Lightbox src="/img/docs/dbt-cloud/scan-qr.png" title="Scan the QR code" />

3. Enter the code provide for "dbt Labs: YOUR_EMAIL_ADDRESS" from your authenticator app into the the field in dbt Cloud.

</expandable>

<expandable alt_header="Webauthn-compliant security key" >

2. Follow the instructions in the modal window and click **Use security key**.

<Lightbox src="/img/docs/dbt-cloud/create-security-key.png" title="Scan the QR code" />

3. Scan the QR code or insert and touch activate your USB key to begin the process. Follow the on-screen prompts. 

</expandable>

4. Store the backup passcode in a secure location. This key will be usefull if the MFA method fails (like a lost or broken phone).


## Terms of Use

The terms below apply to dbt Cloud’s MFA via SMS program, that dbt Labs (“dbt Labs”, “we”, or “us”) uses to facilitate auto sending of authorization codes to users via SMS for dbt Cloud log-in requests. 

Any clients of dbt Labs that use dbt Cloud Labs 2FA via SMS program (after password is input) are subject to the [dbt Labs privacy policy](https://www.getdbt.com/cloud/privacy-policy), the client warranty in [Terms of Service](https://www.getdbt.com/terms-of-service) Section 5.1 second paragraph that Client's use will comply with the Documentation (or similar language in the negotiated service agreement between the parties) and these terms: 

(1) The message frequency is a maximum of 1 message per user login; 

(2) Message and data rates may apply; 

(3) Carriers are not liable for delayed or undelivered messages; 

(4) For help, please reply HELP to the SMS number from which you receive the log-in authorization code(s); 

(5) To opt-out of future SMS messages, please reply STOP to the SMS number from which you receive the log-in authorization code(s). We encourage you to enable an alternate 2FA method before opting-out of SMS messages or you might not be able to log into your account. 

Further questions can be submitted to [support@getdbt.com](mailto:support@getdbt.com).

