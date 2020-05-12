---
id: setup
title: Setup
---

## First-time Setup

### Configuration Console

dbt Cloud ships with a configuration console that lets you self-manage settings, view the status of your deployment, and automatically install new versions of the software. If you are not sure how to access the Configuration Console (a.k.a kotsadm UI), go back to the appropriate installation section.

### Self-signed TLS Certificate Warning (Install into a VM only)

During the installation process, the application bundle will generate a self-signed certificate for connecting securely to the configuration console. You will need to follow the instructions to temporarily trust this self-signed certificate. This self-signed TLS certificate is only used during the initial setup.

<img src="/img/docs/dbt-cloud/on-premises/self-signed-cert.png" />

Next, you'll be asked to upload a TLS certificate to secure both the configuration console and the application itself. If you have not already generated this certificate, you should do so now, otherwise your users will see a warning in their browser every time they try to access the application. Note that this hostname must be a DNS name, and not an IP address, for routing to work properly. In addition, you will need to create a DNS record from your desired hostname to this Linux instance to route traffic via DNS.

<img src="/img/docs/dbt-cloud/on-premises/tls.png" />

Enter the desired hostname, and upload your TLS certificate to establish secure connections to this host. Then, press "Upload & Continue" to continue with setup.

### Upload License

The first time you log into the configuration console, you will need to upload your license file. This contains information about your subscription, as well as configuration for your specific installation. If you don't already have a license file, [contact sales](sales@getdbt.com).

After you upload the license, you will be redirected to the Config page. You can access this page at any time to reconfigure your dbt Cloud installation.

### Configure the Application

On the Config screen, you'll be prompted to provide configuration details for your dbt Cloud application. Follow the instructions on this page to configure the application. Most or all of the configuration values should be established from the [prerequisites section](/docs/dbt-cloud/on-premises/prerequisites). If anything is missing, please contact sales or the person on your team that set up the prerequisites.

After configuring the application, you will be taken to the **Version History** page where you can manage which version of dbt Cloud is deployed. A series of preflight checks will run on your newly configured version. If everything is configured correctly, it will say "Ready to Deploy." Click Deploy to start the application.

<img src="/img/docs/dbt-cloud/on-premises/version-history.png" />

You can skip to the Deployment section below to learn more about how dbt Cloud deployment management works.

### Create a dbt Cloud Account

Within your dbt Cloud installation, you can create multiple Accounts that can have different user groups assigned to them. To create your first account, navigate to the dbt Cloud backend at `https://<hostname>/backend`. This is an administrative site you can use to manage the dbt Cloud application. You can login with username "superuser" and the Django Superuser Password you entered in the configuration console.

After logging in, you can create a new account by:

- Under Database > Accounts, click + Add
- Enter a name for the account
- Under Concurrency, click Show. Enter how many concurrent jobs to allow for this account. If you aren't sure, pick 1 for now.
- Add users to the account (this is important -- if you don't add users, nobody will be able to access the account!)
- If using Enterprise SSO, follow the integration-specific guide for setting up this account.
- If using username / email login, you can invite users to this account by email from this page. Under Invites, enter the email address(es) of users you'd like to invite. When you save the account, these users will receive an invitation in their inbox.
- Save the new account.

### Account / User Concepts

Accounts and Users are separate constructs that can have a many-to-many relationship. When creating a new Account, you can add either existing or new users to the account. If one user has access to multiple accounts, they will be able to switch accounts from the dbt Cloud frontend upon login.

Each user can have a specific role on each account. For more information on each role, please see: https://docs.getdbt.com/docs/cloud-managing-permissions

### Deployments

A new version of dbt Cloud will appear on the Version History page in your Configuration Console anytime any of the following happen:

- A new version of the dbt Cloud code is released. This typically happens once per week, and each new version will be accompanied by a changelog.
- Any configuration change is applied to your application via the Configuration Console.
- Anytime an edit is applied to your Kubernetes configs via the overlays mechanism built into kots.

You can apply or roll back these changes at any time by clicking the Deploy and Rollback buttons on the right side of this screen.

### Github

This setup is only required for Github App usage. 

Log into the dbt Cloud configuration console, navigate to Settings, and check Enable under Github Integration.

Enter the following:

- Base URL: the base URL of your Github enterprise installation, e.g. github.mycompany.com
- API URL: the scheme-included API URL of your Github enterprise installation. Usually https://github.mycompany.com/api/v3
- App ID: copy from the "About" page of the newly created Github app
- Client ID: copy from the "About" page of the newly created Github app
- Client Secret: copy from the "About" page of the newly created Github app
- Configuration URL for your Github app: right click "Install app" on the "About" page, click "Copy Link Location," and paste in the value here.
- Install URL: right click "Public page" on the "About" page, click "Copy Link Location," and paste in the value here.
- Private Key PEM: on the "About" page of the newly created Github app, scroll down to the bottom of the page. Under "Private Keys," click "Generate a Private Key." Download the key, then open up the file and paste the contents into this field.

After you save your dbt Cloud configuration, you are ready to manage your Github integration. Your users can log into dbt Cloud, and navigate to Profile > Integrations to start connecting your Github account to dbt Cloud. See https://docs.getdbt.com/docs/cloud-installing-the-github-application for more details on how your users can start using the integration.
