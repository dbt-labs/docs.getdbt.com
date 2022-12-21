---
id: installation
title: On-Premises Installation (dbt Cloud)
---

:::note 📌

We no longer support new on-premises deployments, and instead have moved to a [Single Tenant](/docs/deploy/single-tenant) model hosted in the cloud

:::

Before proceeding with installation, please make sure to review the [prerequisites](/docs/dbt-cloud/on-premises/prerequisites) and [system requirements](/docs/dbt-cloud/on-premises/system-requirements).

### Installation into an existing Kubernetes cluster

Installation into an existing Kubernetes cluster requires two steps. First, you will install a kubectl plugin (kots) that allows you to dynamically apply dbt Cloud configurations into your existing cluster, as well as overlay your own custom Kubernetes patches. Second, you will install [kotsadm](https://github.com/replicatedhq/kotsadm), an installable admin console for managing Kubernetes appliances, including dbt Cloud. (Later in this document, we will refer to the kotsadm UI as the "Configuration Console.") Both of the required tools are open source.

Both of the following commands must be run on the same machine, where the machine has access to the Kubernetes cluster where you want to run dbt Cloud.

First, install the kubectl plugin by running the following command.

```bash
curl https://kots.io/install | bash
```

Second, install kotsadm into your cluster by running:

```bash
kubectl kots install dbt-cloud-v1
```

The installer will immediately prompt you for a namespace to deploy both kotsadm and dbt Cloud into. You can select any namespace you like. All resources (except for a `ClusterRole` for kotsadm) will be installed into the namespace you select.

Next, you will be prompted for a password to use to secure the admin console. Record the generated password somewhere safe, as you will need it to manage the dbt Cloud appliance. **If you lose this password, you will lose access to the admin console!**

After installation is complete, you can serve the admin console on a local machine by running:

```
kubectl kots admin-console --namespace <your-dbt-cloud-namespace>
```

This will serve up the admin console at `localhost:8800` on the machine running the command.

### Installation into a VM

SSH into the dbt Cloud VM. You can install the entire dbt Cloud application by running the following command:

```bash
curl -sSL https://kurl.sh/dbt-cloud-v1 | sudo bash
```

This runs a shell script produced by [kURL](https://kurl.sh/docs/) which will:

- bootstrap a self-contained Kubernetes cluster onto your instance,
- install the kots admin console,
- and, install the dbt Cloud application.

If your machine has multiple IP addresses, the installer will prompt you to select an IP address on which to host the kots admin console. Choose a private IP suitable for your installation. **It is not recommended to host the kots admin console on a public IP address.**

This will take a few minutes. After it is complete, you will see the following output:

```
        Installation
          Complete ✔

Kotsadm: http://<IP address of instance>:8800
Login with password (will not be shown again): <password>
```

Record the generated password somewhere safe. You will need it to log into the admin console. **If you lose this password, you will lose access to the admin console!**
