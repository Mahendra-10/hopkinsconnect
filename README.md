# HopkinsConnect

A secure cloud-based collaboration platform for Johns Hopkins University students, deployed on OpenStack and Kubernetes.

## Overview

HopkinsConnect is a web application that enables JHU students to discover and connect with peers for academic, research, and entrepreneurial opportunities. The platform provides user profile management, profile discovery, and a global message board with five categories: Research Collaboration, Startup Co-founders, Class Projects, Study Groups, and Other.

## Architecture

- **Infrastructure:** CloudLab → OpenStack (DevStack) → Kubernetes (v1.23.3)
- **Container Runtime:** Fedora CoreOS
- **CNI:** Flannel
- **Backend:** Node.js/Express with SQLite database
- **Frontend:** HTML/CSS/JavaScript with Nginx

## Repository Structure

```
hopkinsconnect/
├── backend/                 # Backend application (Node.js/Express)
│   ├── server.js           # Main server file
│   ├── database.js         # SQLite database wrapper
│   ├── Dockerfile          # Backend container image
│   └── package.json        # Node.js dependencies
├── frontend/                # Frontend application
│   ├── public/             # Static files (HTML, CSS, JS)
│   ├── Dockerfile          # Frontend container image
│   └── nginx.conf          # Nginx configuration
├── kubernetes/              # Kubernetes manifests
│   ├── deployments/       # Deployment configurations
│   ├── services/          # Service definitions
│   ├── security/          # Network policies and secrets
│   └── storage/           # Persistent volume configurations
├── deploy-local.sh         # Local deployment script
└── DEPLOY.sh               # Main deployment script
```

## Prerequisites

- Kubernetes cluster (v1.23.3 or compatible)
- kubectl configured to access the cluster
- Docker (for building images)
- Access to Docker Hub (or container registry)

## Quick Start

### 1. Build and Push Container Images

```bash
# Build backend image
cd backend
docker build --platform linux/amd64 -t mahendra10/hopkinsconnect-backend:v1 .
docker push mahendra10/hopkinsconnect-backend:v1

# Build frontend image
cd ../frontend
docker build --platform linux/amd64 -t mahendra10/hopkinsconnect-frontend:v1 .
docker push mahendra10/hopkinsconnect-frontend:v1
```

### 2. Deploy to Kubernetes

```bash
# Option 1: Use the main deployment script
./DEPLOY.sh

# Option 2: Deploy manually
kubectl apply -f kubernetes/storage/persistent-volume.yaml
kubectl apply -f kubernetes/security/secrets.yaml
kubectl apply -f kubernetes/deployments/backend-deployment.yaml
kubectl apply -f kubernetes/deployments/frontend-deployment.yaml
kubectl apply -f kubernetes/services/backend-service.yaml
kubectl apply -f kubernetes/services/frontend-service.yaml
kubectl apply -f kubernetes/security/network-policy.yaml
```

### 3. Access the Application

```bash
# Get the frontend service URL
kubectl get svc frontend-service

# If using LoadBalancer, wait for EXTERNAL-IP
# If using NodePort, access via: http://<node-ip>:<nodeport>
```

## Security Features

- **Container Security:** Non-root execution, no privilege escalation, all capabilities dropped
- **Network Policies:** Microsegmentation - backend only accessible from frontend
- **Secrets Management:** JWT tokens stored in Kubernetes Secrets
- **Resource Limits:** CPU and memory limits to prevent DoS attacks
- **Web Security:** XSS prevention, SQL injection protection, security headers
- **RBAC:** Least privilege access control

## Configuration

### Environment Variables

Backend requires:
- `JWT_SECRET`: Secret key for JWT token generation (stored in Kubernetes Secrets)
- `PORT`: Server port (default: 3000)
- `DB_PATH`: Database file path (default: ./data/hopkinsconnect.db)

### Kubernetes Secrets

Create secrets before deployment:

```bash
kubectl create secret generic hopkinsconnect-secrets \
  --from-literal=jwt-secret='your-secret-key-here'
```

## Deployment Scripts

- **DEPLOY.sh**: Main deployment script with error handling and status checks
- **deploy-local.sh**: Simplified local deployment script

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Check Services
```bash
kubectl get svc
kubectl describe svc <service-name>
```

### Check Network Policies
```bash
kubectl get networkpolicy
kubectl describe networkpolicy hopkinsconnect-network-policy
```

### Check Persistent Volumes
```bash
kubectl get pv,pvc
kubectl describe pv backend-pv
```

## Security Analysis

This deployment has been analyzed using:
- **Static Analysis:** kubesec (K8s manifests), Trivy (container images)
- **Dynamic Analysis:** kubectl (runtime audit), NMAP, Nikto
- **Penetration Testing:** kube-hunter

See security analysis reports for detailed findings and remediation steps.

## Team

- Mahendra Shahi (mshahi2@jh.edu)
- Abdulaziz

## Course

EN.650.663 - Cloud Computing Security, Fall 2025  
Johns Hopkins University

## License

This project is for educational purposes only.

