---
title: "Multi-factor authentication"
description: "Configure dbt Cloud MFA"
id: "mfa"
sidebar: null
---

# Multi-factor authentication

:::important


dbt Cloud enforces multi-factor authentication (MFA) for all users with username and password credentials. If MFA is not set up, you will see a notification bar prompting you to configure one of the supported methods when you log in. If you do not, you will have to configure MFA upon subsequent logins, or you will be unable to access dbt Cloud.

:::

dbt Cloud provides multiple options for multi-factor authentication (MFA). MFA provides an additional layer of security to username and password logins for Developer and Team plan accounts. The available MFA methods are:

- SMS verification code (US-based phone numbers only)
- Authenticator app
- Webauthn-compliant security key

This is available across dbt Cloud plans for users with username and password logins only. 

## Configuration

You can only have one of the three MFA methods configured per user. These are enabled at the user level, not the account level.

1. Navigate to the **Account settings** and under **Your profile** click on **Password & Security**. Click **Enroll** next to the preferred method.
    
<Lightbox src="/img/docs/dbt-cloud/mfa-enrollment.png" title="List of available MFA enrollment methods in dbt Cloud." />

Choose the next steps based on your preferred enrollment selection:

<Expandable alt_header="SMS verification code">

2. Select the +1 country code, enter your phone number in the field, and click **Continue**.

<Lightbox src="/img/docs/dbt-cloud/sms-enter-phone.png" title="The phone number selection, including a dropdown for country code." />

3. You will receive an SMS message with a six digit code. Enter the code in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/enter-code.png" title="Enter the 6-digit code." />

</Expandable>

<Expandable alt_header="Authenticator app" >

2. Open your preferred authentication app (like Google Authenticator) and scan the QR code.

<Lightbox src="/img/docs/dbt-cloud/scan-qr.png" title="Example of the user generated QR code." />

3. Enter the code provide for "dbt Labs: YOUR_EMAIL_ADDRESS" from your authenticator app into the the field in dbt Cloud.

</Expandable>

<Expandable alt_header="Webauthn-compliant security key" >

2. Follow the instructions in the modal window and click **Use security key**.

<Lightbox src="/img/docs/dbt-cloud/create-security-key.png" title="Example of the Seciruty Key activation window." />

3. Scan the QR code or insert and touch activate your USB key to begin the process. Follow the on-screen prompts.

</Expandable>

4. You will be given a backup passcode, store it in a secure location. This key will be useful if the MFA method fails (like a lost or broken phone).

## Account Recovery

When setting up MFA, ensure that you store your recovery codes in a secure location, in case your MFA method fails. If you are unable to access your account, reach out to [support@getdbt.com](mailto:support@getdbt.com) for further support. You may need to create a new account if your account cannot be recovered. 

If possible, it's recommended to configure multiple MFA methods so that if one fails, there is a backup option.  

## Disclaimer

The terms below apply to dbt Cloud’s MFA via SMS program, that dbt Labs (“dbt Labs”, “we”, or “us”) uses to facilitate auto sending of authorization codes to users via SMS for dbt Cloud log-in requests.

Any clients of dbt Labs that use dbt Cloud Labs 2FA via SMS program (after password is input) are subject to the dbt Labs privacy policy, the client warranty in TOU Section 5.1 second paragraph that Client's use will comply with the Documentation (or similar language in the negotiated service agreement between the parties) and these terms:

(1) The message frequency is a maximum of 1 message per user login;

(2) Message and data rates may apply;

(3) Carriers are not liable for delayed or undelivered messages;

(4) For help, please reply HELP to the SMS number from which you receive the log-in authorization code(s);

(5) To opt-out of future SMS messages, please reply STOP to the SMS number from which you receive the log-in authorization code(s). We encourage you to enable an alternate 2FA method before opting-out of SMS messages or you might not be able to log into your account.

Further questions can be submitted to [support@getdbt.com](mailto:support@getdbt.com).
