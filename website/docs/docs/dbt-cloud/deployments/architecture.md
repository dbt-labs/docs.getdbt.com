---
id: deployment-architecture
title: Architecture
---

This page is intended to help both practitioners seeking to understand the architecture and data flow of the hosted dbt Cloud product as well as administrators running customer managed instances of dbt Cloud.

### Application Data Flows

Whether installed in a hosted or customer managed environment, the dbt Cloud application is comprised of a set of static components, as well as a set of dynamic components. The static components are constantly running to serve highly available dbt Cloud functionality, for example, the dbt Cloud web application. The dynamic components are created just-in-time to fill background jobs or a user request to use the IDE. These components are enumerated below.

<img src="/img/docs/dbt-cloud/on-premises/data-flows.png" />

#### Static Application Components

- **api gateway**: The api gateway is the entrypoint for all client requests to dbt Cloud. The api gateway serves static content, and contains logic for routing requests within the dbt Cloud application.
- **app**: The app is the dbt Cloud application server. It consists of a Django application capable of serving dbt Cloud REST API requests.
- **scheduler**: The scheduler is a continuously running process that orchestrates background jobs in dbt Cloud. It consists of two components: the scheduler container which provisions dynamic resources just-in-time, and the background cleanup container which performs maintenance tasks on the dbt Cloud database, including flushing logs from dbt runs out into the object store.

#### Dynamic Application Components

- **dbt run**: A "run" in dbt Cloud represents a series of background invocations of dbt that are triggered either on a cron scheduler, manually by a user, or via dbt Cloud's API.
- **dbt develop**: This is a server capable of serving dbt IDE requests for a single user. dbt Cloud will create one of these for each user that is actively using the dbt IDE.

#### Application Critical Components

In addition to the application components, there are a few critical dependencies of the application components that are required in order for the dbt Cloud application to function.

- **PostgreSQL database**: dbt Cloud uses a PostgreSQL database as its backend. This can be a cloud-hosted database, for example, AWS RDS, Azure Database, Google Cloud SQL (recommended for production deployments); or, it can be embedded into the dbt Cloud Kubernetes appliance (not recommended for production deployments).
- **Object Storage**: dbt Cloud requires an S3-compatible Object Storage system for persisting run logs and artifacts.
- **Storage Volumes**: dbt Cloud requires a Kubernetes storage provider capable of creating dynamic persistent volumes that can be mounted to multiple containers in R/W mode.

### Data Warehouse Interaction

dbt Cloud's primary role is as a data processor, not a data store. The dbt Cloud application enables users to dispatch SQL to the warehouse for transformation purposes. However, it is possible for users to dispatch SQL that returns customer data into the dbt Cloud application. This data is never persisted and will only exist in memory on the instance in question. In order to properly lock down customer data, it is critical that proper data warehouse permissioning is applied to prevent improper access or storage of sensitive data.

### Deployment Architecture

The following two sections describe the network architectures for _hosted_ and _customer managed_ deployments. Note that both categories have many similar components with the main difference being that hosted deployments leverage AWS infrastructure and customer managed can be deployed in any cloud based or on-premise infrastructure.

#### Hosted Network Architecture

The following diagram shows the network architecture for the _Production_ and _Single Tenant_ deployment types. While many of the specifications of the components differ between the Production and Single Tenant offerings Read below for more information on each of the components and how they might differ between the two deployment models. 

<img src="/img/docs/dbt-cloud/deployment/aws-network-architecture.png" />

- **VPC**: In both hosted deployments, the dbt Cloud application infrastructure lives in an [AWS VPC](https://aws.amazon.com/vpc/) managed by Fishtown Analytics. One of the key differences between the Production and Single Tenant deployment is that the Single Tenant deployment provides a dedicated VPC for a single customer.
- **EKS**: Hosted environments leverage [AWS Elastic Kubernetes Service](https://aws.amazon.com/eks/) to manage dbt Cloud application resources. EKS provides a high degree of reliability and scalability for the dbt Cloud application.
- **CLB**: One or more [AWS Classic Load Balancers](https://aws.amazon.com/elasticloadbalancing/) living in a public subnet are leveraged in the hosted deployment environments to distribute incoming traffic across multple EC2 instances in the EKS cluster.
- **EC2**: The hosted dbt Cloud deployments leverage a cluster of [AWS EC2](https://aws.amazon.com/ec2/) worker nodes to run the dbt Cloud application.
- **EBS**: In order to store application data, dbt Cloud leverages [AWS Elastic Block Store](https://aws.amazon.com/ebs/) mounted to the EC2 instances described above.
- **EFS**: An [AWS Elastic File System](https://aws.amazon.com/efs/) is provisioned for hosted deployments to store and manage local files from the dbt Cloud IDE.
- **S3**: [AWS Simple Storage Service (S3)](https://aws.amazon.com/s3/) is used to store dbt Cloud application logs and artifacts (such as those generated from dbt job runs). 
- **RDS**: The hosted dbt Cloud application leverages [AWS Postgres RDS](https://aws.amazon.com/rds/postgresql/) to store application information such as accounts, users, environments, etc. Note that as explained in the [Data Warehouse Interaction](#data-warehouse-interaction) section above, no data from an associated warehouse is ever stored in this database.


#### Customer Managed (General) Network Architecture

The following diagram illustrates a general network architecture that applies to _On-premise_ and _Airgapped_ deployment models. Note that in a customer managed model, the architecture may be augmented or modified (for example if using a VM) but the below describes the basic infrastructure needed to host the dbt Cloud application in a cloud environment such as AWS, GCP, or Azure.

<img src="/img/docs/dbt-cloud/deployment/generic-network-architecture.png" />

- **VPC**: In a customer managed cloud environment, the dbt Cloud infrastructure would live in a VPC administered by the customer.
- **Kubernetes**: The on premise dbt Cloud application is build to be deployed in a Kubernetes environment with the [KOTS](https://kots.io/) configuration manager. While the dbt Cloud cluster can be installed in a VM, it is still creating a Kubernetes cluster to manage the provisioning and upgrading of dbt Cloud application resources. It is highly recommended that dbt Cloud be installed in _native kubernetes_ rather than a VM environment as a VM throttles the scalability and reliability provided by native Kubernetes and often adds an extra layer of network complexity.
- **Load Balancer**: While not necessarily required, it is highly recommended that a load balancer be leveraged to direct traffic between multiple compute nodes.
- **Compute**: dbt Cloud requires at least one compute instance to run on. It is recommended that at least two instances be provisioned with a load balancer as mentioned above.
- **App Storage - Block**: The dbt Cloud application leverages block storage for general application functionality. This storage is usually bound to the corresponding compute instances that are configured within the Kubernetes cluster.
- **App Storage - File**: In order to save files from the IDE, a file storage system is required. This can be figured manually or using a Kubernetes provisioner.
- **Object Storage**: dbt Cloud requires object storage, such as AWS S3 or Azure Blob, be configured to store application logs and artifacts.
- **Relational Database**: A relational database is required by the dbt Cloud application to store application information such as accounts, users, environments, etc. Note that as explained in the [Data Warehouse Interaction](#data-warehouse-interaction) section above, no data from an associated warehouse is ever stored in this database.
