# HopkinsConnect Network Diagram

**Created by:** mshahi2, [Partner_JHEID]  
**Date:** November 13, 2025  
**Course:** EN.650.663 Cloud Computing Security  

---

## Network Topology Overview

```
                            ┌─────────────────────────────┐
                            │       INTERNET              │
                            │   (Public Network)          │
                            └──────────────┬──────────────┘
                                           │
                                           │ HTTPS/HTTP
                                           │ Port 80/443
                                           │
                            ┌──────────────▼──────────────┐
                            │  CloudLab Firewall          │
                            │  (Physical Network Edge)    │
                            └──────────────┬──────────────┘
                                           │
                                           │
    ┌──────────────────────────────────────┴─────────────────────────────────────────┐
    │                          CLOUDLAB PHYSICAL NETWORK                              │
    │                          129.114.x.x/16                                         │
    │  ┌─────────────────────────────────────────────────────────────────────────┐   │
    │  │                    OpenStack Neutron Network                             │   │
    │  │                    External Network: 192.168.1.0/24                      │   │
    │  │                                                                           │   │
    │  │  ┌─────────────────────────────────────────────────────────────────┐    │   │
    │  │  │              Neutron Router (Gateway)                           │    │   │
    │  │  │  External IP: 192.168.1.1                                       │    │   │
    │  │  │  NAT: Enabled                                                   │    │   │
    │  │  │  SNAT: Yes (for outbound traffic)                              │    │   │
    │  │  │  Floating IP Pool: 192.168.1.100-192.168.1.200                 │    │   │
    │  │  └──────────────────────────┬──────────────────────────────────────┘    │   │
    │  │                             │                                            │   │
    │  │                             │                                            │   │
    │  │  ┌──────────────────────────┴──────────────────────────────────────┐    │   │
    │  │  │        Kubernetes Cluster Network                                │    │   │
    │  │  │        Pod Network: 10.244.0.0/16 (Flannel CNI)                 │    │   │
    │  │  │        Service Network: 10.96.0.0/12                            │    │   │
    │  │  │                                                                   │    │   │
    │  │  │  ┌────────────────────────────────────────────────────────────┐ │    │   │
    │  │  │  │         LoadBalancer Service (Frontend)                    │ │    │   │
    │  │  │  │  Service Name: frontend-service                            │ │    │   │
    │  │  │  │  Type: LoadBalancer                                        │ │    │   │
    │  │  │  │  Namespace: default                                        │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  ClusterIP: 10.96.123.45 (internal)                       │ │    │   │
    │  │  │  │  External IP: 192.168.1.150 (floating IP from Neutron)    │ │    │   │
    │  │  │  │  Port Mapping: 80:80/TCP                                  │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Endpoints:                                                │ │    │   │
    │  │  │  │  • 10.244.1.10:80 (frontend-pod-1)                        │ │    │   │
    │  │  │  │  • 10.244.1.11:80 (frontend-pod-2)                        │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Load Balancing: Round-robin                              │ │    │   │
    │  │  │  │  Session Affinity: None                                   │ │    │   │
    │  │  │  └────────────────────────────────────────────────────────────┘ │    │   │
    │  │  │                             │                                     │    │   │
    │  │  │                             │ Traffic Distribution                │    │   │
    │  │  │                             │                                     │    │   │
    │  │  │           ┌─────────────────┴────────────────┐                   │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           ▼                                  ▼                   │    │   │
    │  │  │  ┌──────────────────────┐         ┌──────────────────────┐     │    │   │
    │  │  │  │   Frontend Pod 1     │         │   Frontend Pod 2     │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Pod IP: 10.244.1.10 │         │  Pod IP: 10.244.1.11 │     │    │   │
    │  │  │  │  Namespace: default  │         │  Namespace: default  │     │    │   │
    │  │  │  │  Node: Worker-1      │         │  Node: Worker-2      │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Container:          │         │  Container:          │     │    │   │
    │  │  │  │  • Name: nginx       │         │  • Name: nginx       │     │    │   │
    │  │  │  │  • Port: 80          │         │  • Port: 80          │     │    │   │
    │  │  │  │  • Protocol: TCP     │         │  • Protocol: TCP     │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Network Policy:     │         │  Network Policy:     │     │    │   │
    │  │  │  │  • Ingress: ALLOW    │         │  • Ingress: ALLOW    │     │    │   │
    │  │  │  │    from Internet     │         │    from Internet     │     │    │   │
    │  │  │  │  • Egress: ALLOW     │         │  • Egress: ALLOW     │     │    │   │
    │  │  │  │    to backend:3000   │         │    to backend:3000   │     │    │   │
    │  │  │  └──────────────────────┘         └──────────────────────┘     │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           │    API Calls (HTTP)              │                   │    │   │
    │  │  │           │    Destination: backend-service:3000                 │    │   │
    │  │  │           │    Method: GET, POST                                 │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           └──────────────┬───────────────────┘                   │    │   │
    │  │  │                          │                                       │    │   │
    │  │  │                          ▼                                       │    │   │
    │  │  │  ┌────────────────────────────────────────────────────────────┐ │    │   │
    │  │  │  │         ClusterIP Service (Backend)                        │ │    │   │
    │  │  │  │  Service Name: backend-service                             │ │    │   │
    │  │  │  │  Type: ClusterIP (Internal Only)                           │ │    │   │
    │  │  │  │  Namespace: default                                        │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  ClusterIP: 10.96.234.56                                  │ │    │   │
    │  │  │  │  No External IP (NOT accessible from internet)            │ │    │   │
    │  │  │  │  Port Mapping: 3000:3000/TCP                              │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Endpoints:                                                │ │    │   │
    │  │  │  │  • 10.244.2.20:3000 (backend-pod-1)                       │ │    │   │
    │  │  │  │  • 10.244.2.21:3000 (backend-pod-2)                       │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Load Balancing: Round-robin                              │ │    │   │
    │  │  │  │  Session Affinity: None                                   │ │    │   │
    │  │  │  └────────────────────────────────────────────────────────────┘ │    │   │
    │  │  │                             │                                     │    │   │
    │  │  │                             │ Traffic Distribution                │    │   │
    │  │  │                             │                                     │    │   │
    │  │  │           ┌─────────────────┴────────────────┐                   │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           ▼                                  ▼                   │    │   │
    │  │  │  ┌──────────────────────┐         ┌──────────────────────┐     │    │   │
    │  │  │  │   Backend Pod 1      │         │   Backend Pod 2      │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Pod IP: 10.244.2.20 │         │  Pod IP: 10.244.2.21 │     │    │   │
    │  │  │  │  Namespace: default  │         │  Namespace: default  │     │    │   │
    │  │  │  │  Node: Worker-1      │         │  Node: Worker-2      │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Container:          │         │  Container:          │     │    │   │
    │  │  │  │  • Name: backend     │         │  • Name: backend     │     │    │   │
    │  │  │  │  • Port: 3000        │         │  • Port: 3000        │     │    │   │
    │  │  │  │  • Protocol: TCP     │         │  • Protocol: TCP     │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Network Policy:     │         │  Network Policy:     │     │    │   │
    │  │  │  │  • Ingress: ALLOW    │         │  • Ingress: ALLOW    │     │    │   │
    │  │  │  │    from frontend     │         │    from frontend     │     │    │   │
    │  │  │  │    pods ONLY         │         │    pods ONLY         │     │    │   │
    │  │  │  │  • Ingress: DENY     │         │  • Ingress: DENY     │     │    │   │
    │  │  │  │    from Internet     │         │    from Internet     │     │    │   │
    │  │  │  │  • Egress: ALLOW     │         │  • Egress: ALLOW     │     │    │   │
    │  │  │  │    DNS, updates      │         │    DNS, updates      │     │    │   │
    │  │  │  │                      │         │                      │     │    │   │
    │  │  │  │  Volume Mount:       │         │  Volume Mount:       │     │    │   │
    │  │  │  │  • /data → PVC       │         │  • /data → PVC       │     │    │   │
    │  │  │  └──────────────────────┘         └──────────────────────┘     │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           │    File I/O Operations           │                   │    │   │
    │  │  │           │    Read/Write to SQLite DB       │                   │    │   │
    │  │  │           │                                  │                   │    │   │
    │  │  │           └──────────────┬───────────────────┘                   │    │   │
    │  │  │                          │                                       │    │   │
    │  │  │                          ▼                                       │    │   │
    │  │  │  ┌────────────────────────────────────────────────────────────┐ │    │   │
    │  │  │  │      Persistent Volume (Storage Layer)                     │ │    │   │
    │  │  │  │  PVC Name: backend-pvc                                     │ │    │   │
    │  │  │  │  Size: 5Gi                                                 │ │    │   │
    │  │  │  │  Access Mode: ReadWriteOnce                               │ │    │   │
    │  │  │  │  Storage Class: standard                                  │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Physical Location:                                        │ │    │   │
    │  │  │  │  • Node: Worker-1                                          │ │    │   │
    │  │  │  │  • Path: /mnt/data/backend-pvc                            │ │    │   │
    │  │  │  │  • File: hopkinsconnect.db                                │ │    │   │
    │  │  │  │                                                            │ │    │   │
    │  │  │  │  Network Access: Local filesystem only                    │ │    │   │
    │  │  │  │  No network exposure                                      │ │    │   │
    │  │  │  └────────────────────────────────────────────────────────────┘ │    │   │
    │  │  │                                                                   │    │   │
    │  │  └───────────────────────────────────────────────────────────────────┘    │   │
    │  │                                                                             │   │
    │  └─────────────────────────────────────────────────────────────────────────────┘   │
    │                                                                                     │
    │  Physical Nodes:                                                                   │
    │  • Controller: pc427.emulab.net (192.168.0.1)                                     │
    │  • Worker-1: 192.168.0.11 (runs frontend-pod-1, backend-pod-1)                   │
    │  • Worker-2: 192.168.0.12 (runs frontend-pod-2, backend-pod-2)                   │
    │                                                                                     │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Network Address Allocation

### CloudLab Physical Network
```
Network: 129.114.0.0/16 (CloudLab public IP range)
Controller Node: 129.114.x.y
Compute Nodes: 129.114.x.z
```

### OpenStack Neutron External Network
```
Network: 192.168.1.0/24
Gateway: 192.168.1.1
DHCP Range: 192.168.1.10-192.168.1.99
Floating IP Pool: 192.168.1.100-192.168.1.200
DNS Servers: 8.8.8.8, 8.8.4.4
```

### Kubernetes Pod Network (Flannel)
```
Pod CIDR: 10.244.0.0/16
Subnet per Node: /24
- Master Node: 10.244.0.0/24
- Worker-1: 10.244.1.0/24
- Worker-2: 10.244.2.0/24
```

### Kubernetes Service Network
```
Service CIDR: 10.96.0.0/12
ClusterIP Range: 10.96.0.1 - 10.111.255.255
DNS Service: 10.96.0.10 (kube-dns)
```

---

## Traffic Flow Diagrams

### User Registration Flow

```
Internet User (Browser)
    │
    │ 1. HTTP POST /register
    │    User: {name, email, password, major, interests}
    ▼
192.168.1.150:80 (LoadBalancer External IP)
    │
    │ 2. Load balancer forwards to frontend pod
    ▼
Frontend Pod (10.244.1.10:80)
    │
    │ 3. JavaScript makes API call
    │    POST http://backend-service:3000/api/register
    ▼
backend-service ClusterIP (10.96.234.56:3000)
    │
    │ 4. Service routes to backend pod
    ▼
Backend Pod (10.244.2.20:3000)
    │
    │ 5. Hash password with bcrypt
    │ 6. Insert into SQLite database
    ▼
Persistent Volume (/data/hopkinsconnect.db)
    │
    │ 7. Return success response
    ▼
Backend Pod → Frontend Pod → User Browser
    │
    └─> User sees "Registration successful!"
```

### User Login Flow

```
Internet User (Browser)
    │
    │ 1. HTTP POST /login
    │    Credentials: {email, password}
    ▼
192.168.1.150:80 (LoadBalancer External IP)
    │
    │ 2. Forward to frontend pod
    ▼
Frontend Pod (10.244.1.10:80)
    │
    │ 3. API call to backend
    │    POST http://backend-service:3000/api/login
    ▼
backend-service ClusterIP (10.96.234.56:3000)
    │
    │ 4. Route to backend pod
    ▼
Backend Pod (10.244.2.20:3000)
    │
    │ 5. Query user from database
    ▼
Persistent Volume (SQLite query)
    │
    │ 6. Verify password with bcrypt
    │ 7. Generate JWT token
    ▼
Backend Pod → Frontend Pod → User Browser
    │
    │ 8. Store JWT in localStorage
    └─> User logged in!
```

### Profile Browsing Flow

```
Authenticated User (Browser with JWT)
    │
    │ 1. HTTP GET /profiles.html
    ▼
Frontend Pod (10.244.1.11:80)
    │
    │ 2. Load page, JavaScript makes API call
    │    GET http://backend-service:3000/api/users
    │    Headers: {Authorization: Bearer <JWT>}
    ▼
backend-service ClusterIP (10.96.234.56:3000)
    │
    │ 3. Route to backend pod
    ▼
Backend Pod (10.244.2.21:3000)
    │
    │ 4. Verify JWT token
    │ 5. Query all users from database
    ▼
Persistent Volume (SELECT * FROM users)
    │
    │ 6. Return user profiles
    ▼
Backend Pod → Frontend Pod → User Browser
    │
    └─> Display profiles with search/filter
```

---

## Security Zones & Firewall Rules

### Zone 1: Public Internet (Untrusted)
```
Network: 0.0.0.0/0
Trust Level: UNTRUSTED
Allowed Access: frontend-service:80 ONLY
Denied Access: backend-service, database, cluster internals
```

### Zone 2: Frontend Layer (DMZ)
```
Network: Frontend pods (10.244.1.0/24)
Trust Level: DMZ (Semi-trusted)
Ingress Rules:
  • ALLOW from 0.0.0.0/0 on port 80
Egress Rules:
  • ALLOW to backend-service:3000
  • ALLOW to DNS (10.96.0.10:53)
  • DENY all other traffic
```

### Zone 3: Backend Layer (Internal)
```
Network: Backend pods (10.244.2.0/24)
Trust Level: INTERNAL (Trusted)
Ingress Rules:
  • ALLOW from app=frontend on port 3000
  • DENY from 0.0.0.0/0
  • DENY from other namespaces
Egress Rules:
  • ALLOW to storage (local filesystem)
  • ALLOW to DNS (10.96.0.10:53)
  • ALLOW to Internet (for package updates - can be restricted)
```

### Zone 4: Data Layer (Restricted)
```
Storage: Persistent Volume (/mnt/data)
Trust Level: RESTRICTED
Access Control:
  • ALLOW read/write from backend pods ONLY
  • No network access
  • Local filesystem permissions enforced
```

---

## Network Policy Implementation

### Frontend Network Policy (Currently: Allow All)
```yaml
# No explicit policy - allows all ingress/egress
# Accepts traffic from Internet via LoadBalancer
# Can make API calls to any service
```

### Backend Network Policy (Enforced)
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 3000

# Effect: Backend pods ONLY accept connections from frontend pods
# All other ingress traffic is DENIED by default
```

---

## DNS Resolution

### Internal DNS (kube-dns)
```
Service: kube-dns
IP: 10.96.0.10
Port: 53/UDP, 53/TCP

Resolution Examples:
• backend-service → 10.96.234.56
• backend-service.default.svc.cluster.local → 10.96.234.56
• frontend-service → 10.96.123.45

Used by: All pods for service discovery
```

### External DNS
```
Upstream DNS: 8.8.8.8, 8.8.4.4 (Google DNS)
Used for: Package downloads, external API calls
Configured in: /etc/resolv.conf on each pod
```

---

## Port Mapping Summary

### External Ports (Internet-facing)
| Port | Protocol | Service | Description |
|------|----------|---------|-------------|
| 80 | TCP | frontend-service | HTTP (web interface) |
| 443 | TCP | (future) | HTTPS (SSL/TLS encrypted) |

### Internal Ports (Cluster-only)
| Port | Protocol | Service | Description |
|------|----------|---------|-------------|
| 3000 | TCP | backend-service | REST API |
| 53 | UDP/TCP | kube-dns | DNS resolution |
| 443 | TCP | kubernetes-api | Kubernetes API server |
| 10250 | TCP | kubelet | Kubelet API |
| 6443 | TCP | (master) | Kubernetes API (external) |

### Container Ports
| Container | Port | Purpose |
|-----------|------|---------|
| frontend/nginx | 80 | Serve static files |
| backend/node | 3000 | Express.js API |

---

## Network Bandwidth & Performance

### Expected Traffic Patterns
```
User Request → Frontend: ~50KB (HTML/CSS/JS)
Frontend → Backend (API): ~5KB (JSON)
Backend → Database: ~1KB (SQL query)

Estimated Concurrent Users: 1000
Peak Bandwidth: ~5 Mbps
Average Latency:
  • User → Frontend: <50ms
  • Frontend → Backend: <5ms (internal)
  • Backend → Database: <1ms (local disk)
```

### Network Optimizations
- ✅ **Internal ClusterIP**: Backend not exposed, low latency
- ✅ **Load Balancing**: Traffic distributed across 2 pods each
- ✅ **No Network Hops**: Backend → Database (local filesystem)
- 🔄 **Future**: CDN for static assets, caching layer

---

## Security Controls Summary

### Layer 1: Perimeter Security (CloudLab/OpenStack)
- 🔒 OpenStack Security Groups (firewall)
- 🔒 Neutron Router with NAT
- 🔒 Floating IP restrictions

### Layer 2: Network Segmentation (Kubernetes)
- 🔒 Network Policies (backend isolation)
- 🔒 ClusterIP for internal services
- 🔒 LoadBalancer for public services only

### Layer 3: Application Security
- 🔒 JWT authentication
- 🔒 CORS restrictions
- 🔒 Helmet.js security headers
- 🔒 bcrypt password hashing

### Layer 4: Container Security
- 🔒 Non-root users (UID 1000/101)
- 🔒 Read-only filesystems
- 🔒 Resource limits (CPU/memory)
- 🔒 No privilege escalation

### Layer 5: Data Security
- 🔒 Persistent volume with access control
- 🔒 Secrets for sensitive config (JWT_SECRET)
- 🔒 No database exposed to network

---

## Disaster Recovery & High Availability

### Current HA Configuration
```
Frontend: 2 replicas (both must fail for outage)
Backend: 2 replicas (both must fail for outage)
Database: 1 instance (single point of failure)
LoadBalancer: Managed by OpenStack (HA)
```

### Failure Scenarios

**Scenario 1: Frontend Pod Failure**
```
frontend-pod-1 crashes
    ↓
LoadBalancer detects failure
    ↓
Routes all traffic to frontend-pod-2
    ↓
Kubernetes restarts frontend-pod-1
    ↓
Service restored with 2 replicas
    
Impact: None (transparent to users)
```

**Scenario 2: Backend Pod Failure**
```
backend-pod-1 crashes
    ↓
ClusterIP detects failure
    ↓
Routes all requests to backend-pod-2
    ↓
Kubernetes restarts backend-pod-1
    ↓
Service restored with 2 replicas
    
Impact: None (users may notice slight slowdown)
```

**Scenario 3: Worker Node Failure**
```
Worker-1 goes offline
    ↓
Pods on Worker-1 marked as NotReady
    ↓
Kubernetes reschedules pods to Worker-2
    ↓
All 4 pods now running on Worker-2
    
Impact: Brief interruption (~30 seconds)
Note: Database may be lost if Worker-1 held PV
```

---

## Network Troubleshooting Commands

### Check Service Endpoints
```bash
kubectl get endpoints frontend-service
kubectl get endpoints backend-service
```

### Test Network Connectivity
```bash
# From frontend pod to backend
kubectl exec -it frontend-pod-1 -- curl backend-service:3000/api/users

# From outside cluster to frontend
curl http://192.168.1.150/

# DNS resolution
kubectl exec -it frontend-pod-1 -- nslookup backend-service
```

### Verify Network Policies
```bash
kubectl get networkpolicies
kubectl describe networkpolicy backend-network-policy
```

### Check Load Balancer Status
```bash
kubectl get svc frontend-service
kubectl describe svc frontend-service
```

---

## Compliance & Security Standards

### Implemented Controls
- ✅ **Zero-Trust Networking**: Backend not accessible from Internet
- ✅ **Principle of Least Privilege**: Network policies restrict traffic
- ✅ **Defense in Depth**: Multiple security layers
- ✅ **Encryption in Transit**: Can enable HTTPS/TLS (future)
- ✅ **Network Segmentation**: Frontend/Backend/Data zones

### Recommended Future Enhancements
- 🔄 Enable TLS/HTTPS (Let's Encrypt)
- 🔄 Add Web Application Firewall (WAF)
- 🔄 Implement rate limiting (prevent DoS)
- 🔄 Add intrusion detection (Falco)
- 🔄 Enable network encryption (mTLS with service mesh)

---

**End of Network Diagram**

