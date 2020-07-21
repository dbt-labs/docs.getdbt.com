---
title: On-premises FAQs
---

## Customizations

### Adding custom ingresses

All ingress to dbt Cloud goes through a component called the **API Gateway**. The Kubernetes deployment that makes up the API Gateway has the label `name: api-gateway` and serves up all traffic on port 8000. Within your dbt Cloud installation, you can create custom services and ingresses to these pods by targeting that set of labels with custom services.

**Example: on an embedded cluster, add a service that does _not_ terminate TLS**

This example only applies to an embedded cluster (dbt Cloud installed onto a VM). Note that exposing dbt Cloud traffic over http is insecure, and not recommended.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-http-only
  labels:
    name: api-gateway-http-only
spec:
  ports:
    - name: http
      port: 8000
      targetPort: 8000
      nodePort: <port-to-expose-over-http>
  selector:
    name: api-gateway
  type: NodePort
```

**Example: on an existing cluster, add a service that terminates TLS**

This example only applies to an existing cluster (dbt Cloud installed onto pre-existing Kubernetes). It requires that you have a valid [TLS secret](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls) available in the same Kubernetes namespace as the dbt Cloud application.

We recommend the [nginx ingress controller](https://kubernetes.github.io/ingress-nginx/deploy/) as a simple way to deploy ingresses that terminate TLS in your cluster. You will need to follow the installation instructions to install the controller before proceeding.

Replace `<hostname-to-terminate-tls>` with the "hostname" setting from your dbt Cloud instance. Then, apply the YAML manifest below to the namespace where dbt Cloud is installed.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
  name: nginx-ingress
spec:
  tls:
    - hosts:
      - "<hostname-to-terminate-tls>"
      # This assumes tls-secret exists and the SSL
      # certificate contains a CN for
      # "<hostname-to-terminate-tls>"
      secretName: "<tls-secret>"
  rules:
    - host: "<hostname-to-terminate-tls>"
      http:
        paths:
          - backend:
              serviceName: api-gateway
              servicePort: 8000
            path: /
```

For more examples of using the nginx ingress controller, see [the Examples section](https://kubernetes.github.io/ingress-nginx/examples/tls-termination/) of their documentation.
