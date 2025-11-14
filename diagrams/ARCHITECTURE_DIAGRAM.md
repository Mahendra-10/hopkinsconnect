# HopkinsConnect Architecture Diagram

**Created by:** mshahi2, [Partner_JHEID]  
**Date:** November 13, 2025  
**Course:** EN.650.663 Cloud Computing Security  

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDLAB INFRASTRUCTURE                             │
│                         (Bare Metal Research Platform)                           │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                            OPENSTACK CLOUD                                 │  │
│  │                    (Controller + 2 Compute Nodes)                          │  │
│  │                                                                             │  │
│  │  Components:                                                                │  │
│  │  • Keystone (Authentication)                                                │  │
│  │  • Nova (Compute Service)                                                   │  │
│  │  • Neutron (Networking)                                                     │  │
│  │  • Magnum (Container Orchestration)                                         │  │
│  │  • Heat (Orchestration)                                                     │  │
│  │  • Horizon (Dashboard)                                                      │  │
│  │  • Glance (Image Service)                                                   │  │
│  │                                                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐  │  │
│  │  │              KUBERNETES CLUSTER (via Magnum)                        │  │  │
│  │  │              Cluster: hopkinsconnect-k8s                            │  │  │
│  │  │              COE: Kubernetes 1.27                                   │  │  │
│  │  │              Network Driver: Flannel                                │  │  │
│  │  │                                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │                    CONTROL PLANE                             │  │  │  │
│  │  │  │  • Master Node (m1.medium flavor)                           │  │  │  │
│  │  │  │  • API Server                                               │  │  │  │
│  │  │  │  • etcd (cluster state)                                     │  │  │  │
│  │  │  │  • Scheduler                                                │  │  │  │
│  │  │  │  • Controller Manager                                       │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                               │                                     │  │  │
│  │  │                               │                                     │  │  │
│  │  │  ┌────────────────────────────┴──────────────────────────────┐     │  │  │
│  │  │  │                    WORKER NODES                            │     │  │  │
│  │  │  │  • Worker-1 (m1.small flavor)                             │     │  │  │
│  │  │  │  • Worker-2 (m1.small flavor)                             │     │  │  │
│  │  │  │  • kubelet, kube-proxy running on each                    │     │  │  │
│  │  │  └────────────────────────────────────────────────────────────┘     │  │  │
│  │  │                               │                                     │  │  │
│  │  │                               │                                     │  │  │
│  │  │  ═════════════════════════════════════════════════════════════     │  │  │
│  │  │                    APPLICATION LAYER                                │  │  │
│  │  │  ═════════════════════════════════════════════════════════════     │  │  │
│  │  │                                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │                 FRONTEND TIER                                │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │         LoadBalancer Service                           │  │  │  │  │
│  │  │  │  │  Type: LoadBalancer                                    │  │  │  │  │
│  │  │  │  │  External IP: [Assigned by Neutron]                    │  │  │  │  │
│  │  │  │  │  Port: 80 → 80                                         │  │  │  │  │
│  │  │  │  │  Public Internet Access                                │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘  │  │  │  │
│  │  │  │                         │                                      │  │  │  │
│  │  │  │                         ▼                                      │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │      Frontend Deployment (2 Replicas)                  │  │  │  │  │
│  │  │  │  │  ┌──────────────┐       ┌──────────────┐              │  │  │  │  │
│  │  │  │  │  │ Frontend     │       │ Frontend     │              │  │  │  │  │
│  │  │  │  │  │ Pod 1        │       │ Pod 2        │              │  │  │  │  │
│  │  │  │  │  │              │       │              │              │  │  │  │  │
│  │  │  │  │  │ Image:       │       │ Image:       │              │  │  │  │  │
│  │  │  │  │  │ nginx:alpine │       │ nginx:alpine │              │  │  │  │  │
│  │  │  │  │  │              │       │              │              │  │  │  │  │
│  │  │  │  │  │ Container:   │       │ Container:   │              │  │  │  │  │
│  │  │  │  │  │ - Nginx 1.24 │       │ - Nginx 1.24 │              │  │  │  │  │
│  │  │  │  │  │ - HTML/CSS/JS│       │ - HTML/CSS/JS│              │  │  │  │  │
│  │  │  │  │  │ - Port 80    │       │ - Port 80    │              │  │  │  │  │
│  │  │  │  │  │              │       │              │              │  │  │  │  │
│  │  │  │  │  │ Security:    │       │ Security:    │              │  │  │  │  │
│  │  │  │  │  │ - Read-only  │       │ - Read-only  │              │  │  │  │  │
│  │  │  │  │  │   filesystem │       │   filesystem │              │  │  │  │  │
│  │  │  │  │  │ - Non-root   │       │ - Non-root   │              │  │  │  │  │
│  │  │  │  │  │   user (101) │       │   user (101) │              │  │  │  │  │
│  │  │  │  │  │              │       │              │              │  │  │  │  │
│  │  │  │  │  │ Resources:   │       │ Resources:   │              │  │  │  │  │
│  │  │  │  │  │ - CPU: 100m  │       │ - CPU: 100m  │              │  │  │  │  │
│  │  │  │  │  │ - Mem: 128Mi │       │ - Mem: 128Mi │              │  │  │  │  │
│  │  │  │  │  └──────────────┘       └──────────────┘              │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                               │                                     │  │  │
│  │  │                               │ HTTP API Calls                      │  │  │
│  │  │                               │ (to backend-service:3000)           │  │  │
│  │  │                               │                                     │  │  │
│  │  │  ┌────────────────────────────┴──────────────────────────────────┐ │  │  │
│  │  │  │                 BACKEND TIER                                   │ │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐   │ │  │  │
│  │  │  │  │         ClusterIP Service                              │   │ │  │  │
│  │  │  │  │  Type: ClusterIP (Internal Only)                       │   │ │  │  │
│  │  │  │  │  ClusterIP: 10.96.x.x                                  │   │ │  │  │
│  │  │  │  │  Port: 3000 → 3000                                     │   │ │  │  │
│  │  │  │  │  No External Access                                    │   │ │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘   │ │  │  │
│  │  │  │                         │                                      │ │  │  │
│  │  │  │                         ▼                                      │ │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐   │ │  │  │
│  │  │  │  │      Backend Deployment (2 Replicas)                   │   │ │  │  │
│  │  │  │  │  ┌──────────────┐       ┌──────────────┐               │   │ │  │  │
│  │  │  │  │  │ Backend      │       │ Backend      │               │   │ │  │  │
│  │  │  │  │  │ Pod 1        │       │ Pod 2        │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Image:       │       │ Image:       │               │   │ │  │  │
│  │  │  │  │  │ node:18-slim │       │ node:18-slim │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Application: │       │ Application: │               │   │ │  │  │
│  │  │  │  │  │ - Node.js 18 │       │ - Node.js 18 │               │   │ │  │  │
│  │  │  │  │  │ - Express.js │       │ - Express.js │               │   │ │  │  │
│  │  │  │  │  │ - SQLite DB  │       │ - SQLite DB  │               │   │ │  │  │
│  │  │  │  │  │ - Port 3000  │       │ - Port 3000  │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Features:    │       │ Features:    │               │   │ │  │  │
│  │  │  │  │  │ - JWT Auth   │       │ - JWT Auth   │               │   │ │  │  │
│  │  │  │  │  │ - bcrypt     │       │ - bcrypt     │               │   │ │  │  │
│  │  │  │  │  │ - Helmet.js  │       │ - Helmet.js  │               │   │ │  │  │
│  │  │  │  │  │ - CORS       │       │ - CORS       │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Security:    │       │ Security:    │               │   │ │  │  │
│  │  │  │  │  │ - Non-root   │       │ - Non-root   │               │   │ │  │  │
│  │  │  │  │  │   user (1000)│       │   user (1000)│               │   │ │  │  │
│  │  │  │  │  │ - Secrets via│       │ - Secrets via│               │   │ │  │  │
│  │  │  │  │  │   env vars   │       │   env vars   │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Resources:   │       │ Resources:   │               │   │ │  │  │
│  │  │  │  │  │ - CPU: 200m  │       │ - CPU: 200m  │               │   │ │  │  │
│  │  │  │  │  │ - Mem: 256Mi │       │ - Mem: 256Mi │               │   │ │  │  │
│  │  │  │  │  │              │       │              │               │   │ │  │  │
│  │  │  │  │  │ Volume Mount:│       │ Volume Mount:│               │   │ │  │  │
│  │  │  │  │  │ /data → PVC  │       │ /data → PVC  │               │   │ │  │  │
│  │  │  │  │  └──────────────┘       └──────────────┘               │   │ │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘   │ │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘ │  │  │
│  │  │                               │                                     │  │  │
│  │  │                               │ File I/O                            │  │  │
│  │  │                               ▼                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │                 DATA PERSISTENCE LAYER                       │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │     Persistent Volume Claim (PVC)                      │  │  │  │  │
│  │  │  │  │  Name: backend-pvc                                     │  │  │  │  │
│  │  │  │  │  Storage: 5Gi                                          │  │  │  │  │
│  │  │  │  │  Access Mode: ReadWriteOnce                            │  │  │  │  │
│  │  │  │  │  Storage Class: standard (default)                     │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘  │  │  │  │
│  │  │  │                         │                                      │  │  │  │
│  │  │  │                         ▼                                      │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │     SQLite Database File                               │  │  │  │  │
│  │  │  │  │  Location: /data/hopkinsconnect.db                     │  │  │  │  │
│  │  │  │  │                                                         │  │  │  │  │
│  │  │  │  │  Tables:                                                │  │  │  │  │
│  │  │  │  │  • users (id, name, email, password_hash, major,       │  │  │  │  │
│  │  │  │  │    interests, bio, created_at)                         │  │  │  │  │
│  │  │  │  │  • posts (id, user_id, title, message, category,       │  │  │  │  │
│  │  │  │  │    created_at)                                         │  │  │  │  │
│  │  │  │  │                                                         │  │  │  │  │
│  │  │  │  │  Size: ~100MB estimated for 1000 users                 │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                                     │  │  │
│  │  │  ═════════════════════════════════════════════════════════════     │  │  │
│  │  │                    SECURITY LAYER                                   │  │  │
│  │  │  ═════════════════════════════════════════════════════════════     │  │  │
│  │  │                                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │           Kubernetes Secrets                                 │  │  │  │
│  │  │  │  Name: hopkinsconnect-secrets                                │  │  │  │
│  │  │  │  Type: Opaque                                                │  │  │  │
│  │  │  │  Data:                                                       │  │  │  │
│  │  │  │  • JWT_SECRET: [base64 encoded secret key]                  │  │  │  │
│  │  │  │                                                              │  │  │  │
│  │  │  │  Mounted as environment variables in backend pods           │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │           Network Policies                                   │  │  │  │
│  │  │  │  Name: backend-network-policy                                │  │  │  │
│  │  │  │  Type: Ingress restriction                                   │  │  │  │
│  │  │  │                                                              │  │  │  │
│  │  │  │  Rules:                                                      │  │  │  │
│  │  │  │  • Allow: Frontend pods → Backend pods (port 3000)           │  │  │  │
│  │  │  │  • Deny: All other ingress traffic                          │  │  │  │
│  │  │  │  • Label Selector: app=backend                              │  │  │  │
│  │  │  │                                                              │  │  │  │
│  │  │  │  Effect: Zero-trust network segmentation                    │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │           Security Context                                   │  │  │  │
│  │  │  │  • Non-root containers (UID 1000/101)                        │  │  │  │
│  │  │  │  • Read-only root filesystem (frontend)                      │  │  │  │
│  │  │  │  • No privilege escalation                                   │  │  │  │
│  │  │  │  • Resource limits enforced                                  │  │  │  │
│  │  │  │  • Drop all capabilities                                     │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                                     │  │  │
│  │  └─────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                             │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
                                        ▲
                                        │
                                        │
                                ┌───────┴────────┐
                                │  Internet      │
                                │  Users         │
                                │  (HTTPS/HTTP)  │
                                └────────────────┘
```

---

## Technology Stack Summary

### Infrastructure Layer
- **Platform**: CloudLab (Bare Metal Cloud for Research)
- **Cloud OS**: OpenStack (DevStack deployment)
- **Container Orchestration**: Kubernetes 1.27 (via OpenStack Magnum)
- **Network Plugin**: Flannel (Overlay Network)

### Application Layer
- **Frontend**: Nginx + Static HTML/CSS/JavaScript
- **Backend**: Node.js 18 + Express.js
- **Database**: SQLite (file-based)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Security Layer
- **Network Security**: Kubernetes Network Policies
- **Secrets Management**: Kubernetes Secrets
- **Container Security**: Non-root users, resource limits, read-only filesystem
- **HTTP Security**: Helmet.js middleware
- **CORS**: Configured for frontend-backend communication

---

## Component Details

### Frontend (2 Replicas)
- **Purpose**: Serve user interface and static assets
- **Technology**: Nginx web server
- **Features**: 
  - User registration and login
  - Profile browsing and search
  - Message board
- **Security**: Read-only filesystem, non-root user

### Backend (2 Replicas)
- **Purpose**: REST API for business logic and data management
- **Technology**: Node.js + Express
- **Endpoints**:
  - POST /api/register (user registration)
  - POST /api/login (authentication)
  - GET /api/users (list profiles)
  - POST /api/posts (create message)
  - GET /api/posts (retrieve messages)
- **Security**: JWT authentication, bcrypt hashing, Helmet.js headers

### Database (Persistent)
- **Type**: SQLite (single file database)
- **Storage**: 5Gi Persistent Volume
- **Tables**: users, posts
- **Backup**: Manual snapshot recommended

---

## High Availability & Scalability

### Current Configuration
- **Frontend**: 2 replicas (can handle ~1000 concurrent users)
- **Backend**: 2 replicas (load balanced)
- **Database**: Single instance (SQLite limitation)

### Scaling Recommendations
- **Horizontal**: Increase replica count for frontend/backend
- **Vertical**: Upgrade to PostgreSQL/MySQL for production
- **Load Balancing**: Automatic via Kubernetes Services
- **Auto-scaling**: Can configure HPA (Horizontal Pod Autoscaler)

---

## Security Features Implemented

1. ✅ **Authentication**: JWT-based stateless authentication
2. ✅ **Password Security**: bcrypt hashing (10 rounds)
3. ✅ **Network Isolation**: Backend not accessible from internet
4. ✅ **Zero-Trust Networking**: Network policies restrict pod-to-pod traffic
5. ✅ **Secrets Management**: JWT secret stored in Kubernetes Secrets
6. ✅ **Container Security**: Non-root users, resource limits
7. ✅ **HTTP Security**: Helmet.js sets secure headers
8. ✅ **CORS**: Configured to prevent unauthorized cross-origin requests

---

## Deployment Flow

```
Developer → Git Push → GitHub Repository
                            ↓
                    Build Docker Images
                            ↓
                    Push to Container Registry
                            ↓
                    Apply Kubernetes Manifests
                            ↓
                    Kubernetes Scheduler
                            ↓
            ┌───────────────┴───────────────┐
            ↓                               ↓
    Frontend Pods Created          Backend Pods Created
            ↓                               ↓
    LoadBalancer Service           ClusterIP Service
            ↓                               ↓
    Accessible from Internet        Internal Only
```

---

## Monitoring & Logging (Future Enhancement)

- **Recommended Tools**:
  - Prometheus (metrics collection)
  - Grafana (visualization)
  - ELK Stack (centralized logging)
  - Kubernetes Dashboard (cluster management)

---

**End of Architecture Diagram**

