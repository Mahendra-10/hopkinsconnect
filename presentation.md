# HopkinsConnect: Cloud Application Deployment and Security Analysis
## Presentation Outline

**Team:** Mahendra and Abdulaziz  
**Assignment:** Homework 6 - Cloud Application Deployment and Security Analysis

---

## Slide 1: Title Slide
**Content:**
- Title: "HopkinsConnect: Secure Cloud Application Deployment"
- Subtitle: "OpenStack + Kubernetes Security Analysis"
- Team members: Mahendra and Abdulaziz
- Course: Cloud Security
- Date

**Screenshots:** None (title slide)

---

## Slide 2: Agenda
**Content:**
- Application Overview
- Deployment Architecture
- Security Configuration
- Security Analysis & Findings
- Lessons Learned & Future Work

**Screenshots:** None

---

## PART 1: APPLICATION OVERVIEW AND DEPLOYMENT

---

## Slide 3: Application Use Case - What It Does
**Content:**
- **HopkinsConnect**: Web-based collaboration platform for JHU students
- **Key Features:**
  - User Profile Management
  - Profile Discovery & Search
  - Global Message Board (5 categories)
- **Target Users:** Undergraduate/graduate students, PhD candidates, entrepreneurs

**Screenshots:**
- **Figure 1**: Application screenshot showing message board with posts
- **Figure 2**: Application screenshot showing search functionality

**Visual:** Show the actual working application interface

---

## Slide 4: Problem Statement
**Content:**
- **Primary Problem:** JHU students work in isolated silos despite shared interests
- **Current Solutions:** Email lists, random encounters, LinkedIn (inefficient)
- **Our Solution:** Centralized platform for collaboration discovery

**Screenshots:** None (text-based slide)

---

## Slide 5: Three-Tier Infrastructure Stack
**Content:**
- **Layer 1:** CloudLab Physical Infrastructure (d710 controller)
- **Layer 2:** OpenStack Cloud Platform (Zed/DevStack)
- **Layer 3:** Kubernetes Container Orchestration (v1.23.3)

**Screenshots:**
- **Figure 3**: OpenStack cluster list showing `hopkinsconnect-k8s` in CREATE_COMPLETE/HEALTHY status
- **Figure 6**: Kubernetes nodes showing master node in Ready state

**Visual:** Architecture diagram showing the three layers

---

## Slide 6: OpenStack Services Used
**Content:**
- **Nova**: Compute service (VM lifecycle)
- **Neutron**: Network service (virtual networking)
- **Magnum**: Container orchestration (K8s cluster provisioning)
- **Heat**: Orchestration engine
- **Glance**: Image service (Fedora CoreOS)
- **Keystone**: Identity service

**Screenshots:**
- **Figure 4**: Detailed cluster information (master/node config, Fedora CoreOS, floating IP)
- **Figure 5**: OpenStack VMs showing Kubernetes master node VM (m1.medium flavor)

---

## Slide 7: Deployment Tools & Technologies
**Content:**
- **Containerization:** Docker 27.4.1 (multi-arch builds)
- **Registry:** Docker Hub (mahendra10/hopkinsconnect-*:v1)
- **Orchestration:** kubectl + Kubernetes v1.23.3
- **Networking:** Flannel CNI (10.100.0.0/16)
- **Runtime:** Fedora CoreOS 35.20220116.3.0

**Screenshots:** None (table/chart format)

---

## Slide 8: Deployment Phases Overview
**Content:**
1. **Phase 1:** Infrastructure Provisioning (CloudLab + OpenStack)
2. **Phase 2:** Kubernetes Cluster Creation (Magnum)
3. **Phase 3:** Application Containerization (Docker builds)
4. **Phase 4:** Kubernetes Deployment (Pods, Services, Policies)

**Screenshots:**
- **Figure 7**: OpenStack keypair list confirming 'mykey' registration

---

## Slide 9: Kubernetes Cluster Creation
**Content:**
- Single-node cluster (master-only) due to CloudLab constraints
- Cluster template UUID: `fbad5769-8fc0-44d2-83ac-de488a9d8914`
- Master flavor: m1.medium
- CNI troubleshooting: Fixed Flannel, removed taints

**Screenshots:**
- **Figure 6**: `kubectl get nodes` showing master node ready
- Command output: `openstack coe cluster create` command

---

## Slide 10: Application Deployment Status
**Content:**
- **Backend Pod:** 10.100.0.24:3000 (Running)
- **Frontend Pod:** 10.100.0.18:80 (Running)
- **Storage:** PersistentVolume bound (5Gi)
- **Services:** Backend (ClusterIP), Frontend (LoadBalancer)

**Screenshots:**
- **Figure 8**: Persistent volumes showing backend-pv bound
- **Figure 9**: `kubectl get pods -o wide` showing both pods running with IPs
- **Figure 9 (extended)**: `kubectl describe deployment` showing resource limits and security contexts

---

## Slide 11: Architecture Diagram
**Content:**
- Visual representation of the full stack
- CloudLab → OpenStack → Kubernetes → Application Pods
- Network flows and data paths

**Screenshots:**
- **Figure 10**: Architecture diagram (from Question 3)

---

## Slide 12: Network Diagram
**Content:**
- Network topology showing:
  - OpenStack private network (10.0.0.0/24)
  - Kubernetes Pod network (10.100.0.0/16)
  - Service endpoints
  - Network policy restrictions

**Screenshots:**
- **Figure 11**: Network diagram (from Question 3)

---

## PART 2: SECURITY CONFIGURATION AND BEST PRACTICES

---

## Slide 13: Security Measures Overview
**Content:**
- **11 Key Security Controls** implemented:
  1. Kubernetes Secrets Management
  2. SSH Key-Based Authentication
  3. Container Security Context (Least Privilege)
  4. Resource Limits & Quotas
  5. Network Policies (Microsegmentation)
  6. Container Image Security
  7. Persistent Volume Security
  8. Kubernetes RBAC
  9. OpenStack Infrastructure Security
  10. Secure Container Runtime
  11. Web Application Security (XSS, SQL Injection, Headers)

**Screenshots:** None (overview slide)

---

## Slide 14: Secrets Management & Authentication
**Content:**
- **Kubernetes Secrets:** JWT tokens stored securely (base64-encoded)
- **SSH Key-Based Auth:** 4096-bit RSA keypair (no passwords)
- **OpenStack Keypairs:** Infrastructure access via key-based auth

**Screenshots:**
- **Figure 12**: 
  - `kubectl get secrets` showing app-secrets
  - `openstack keypair list` showing mykey (RSA 4096)

---

## Slide 15: Container Security Context
**Content:**
- **Non-root execution:** Backend runs as UID 1000
- **Privilege escalation disabled:** `allowPrivilegeEscalation: false`
- **Capabilities dropped:** `capabilities.drop: ["ALL"]`
- **CIS Kubernetes Benchmark compliance**

**Screenshots:**
- **Figure 13**: `kubectl describe pod` showing security context (runAsNonRoot: true, runAsUser: 1000, allowPrivilegeEscalation: false)
- Code snippet: Security context YAML from backend-deployment.yaml

---

## Slide 16: Network Policies (Microsegmentation)
**Content:**
- **Restrictive NetworkPolicy:** Only frontend → backend communication allowed
- **Port restrictions:** Backend (3000) only from frontend; Frontend (80) public
- **Prevents lateral movement** in case of compromise

**Screenshots:**
- **Figure 14**: `kubectl get networkpolicy` showing hopkinsconnect-network-policy
- **Figure 17 (partial)**: Network policy validation test (unauthorized pod blocked)
- Code snippet: Network policy YAML showing ingress rules

---

## Slide 17: Resource Limits & DoS Prevention
**Content:**
- **Backend limits:** 300m CPU / 384Mi memory
- **Frontend limits:** 200m CPU / 256Mi memory
- **Prevents resource exhaustion** and memory bombs
- **Fair resource allocation** across pods

**Screenshots:**
- **Figure 17 (partial)**: `kubectl describe pod` showing Limits and Requests sections
- **Figure 9 (extended)**: Deployment description showing resource constraints

---

## Slide 18: Persistent Volume Security
**Content:**
- **ReadWriteOnce access mode:** Single-writer, prevents concurrent corruption
- **Isolated storage:** Per-application component
- **Retain reclaim policy:** Data preserved after PVC deletion

**Screenshots:**
- **Figure 15**: `kubectl get pv` showing backend-pv (5Gi, Bound, ReadWriteOnce)

---

## Slide 19: Web Application Security
**Content:**
- **XSS Prevention:** `escapeHtml()` function sanitizes user input
- **SQL Injection Prevention:** Parameterized queries (prepared statements)
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Helmet.js:** Multiple security headers (CSP, HSTS, etc.)
- **Password Security:** bcrypt hashing (10 rounds)
- **JWT Authentication:** 24-hour expiration tokens

**Screenshots:**
- Code snippets:
  - Frontend XSS prevention (app.js - escapeHtml function)
  - Nginx security headers (nginx.conf)
  - Backend security middleware (server.js - helmet, cors)
  - SQL injection prevention (server.js - parameterized queries)

---

## Slide 20: Avoiding Cloud Misconfigurations
**Content:**
- **10 Key Practices:**
  1. Network Segmentation (Network Policies)
  2. No Default Credentials (SSH keys, Secrets)
  3. Least Privilege (Non-root, RBAC)
  4. No Public Storage (ReadWriteOnce PVs)
  5. Version-Controlled Images (v1 tags, not latest)
  6. Container Security Contexts
  7. No Exposed Dashboards
  8. Immutable Infrastructure (IaC)
  9. Resource Governance (Limits)
  10. Secrets Management

**Screenshots:**
- **Figure 17**: Combined screenshot showing:
  - Resource limits validation
  - RBAC audit (service account permissions)
  - Network policy test (blocked unauthorized access)

---

## PART 3: SECURITY ANALYSIS

---

## Slide 21: Security Analysis Methodology
**Content:**
- **Three Analysis Types:**
  1. **Static Analysis:** Pre-deployment configuration scanning
  2. **Dynamic Analysis:** Runtime security validation
  3. **Penetration Testing:** Active exploitation attempts

**Screenshots:** None (methodology overview)

---

## Slide 22: Tools Used - Static Analysis
**Content:**
- **kubesec (v2.14.2):** Kubernetes manifest security scanner
  - Analyzed: backend-deployment.yaml, frontend-deployment.yaml, network-policy.yaml
- **Trivy (v0.67.2):** Container image vulnerability scanner
  - Analyzed: mahendra10/hopkinsconnect-backend:v1, mahendra10/hopkinsconnect-frontend:v1

**Screenshots:**
- kubesec report output (security scores)
- Trivy scan results summary (vulnerability counts)

---

## Slide 23: Tools Used - Dynamic Analysis
**Content:**
- **kubectl:** Runtime security configuration audit
  - Security contexts, resource limits, RBAC permissions
- **NMAP (v7.94):** Network port scanner
  - Scanned pod IPs (blocked by network policies - positive indicator)
- **Nikto (v2.1.5):** Web application vulnerability scanner
  - Unable to reach web server (blocked - positive indicator)

**Screenshots:**
- NMAP scan results showing blocked ports
- Nikto output showing connection failures
- kubectl audit commands output

---

## Slide 24: Tools Used - Penetration Testing
**Content:**
- **kube-hunter (latest):** Kubernetes-specific penetration testing
  - API server reconnaissance
  - Network vulnerability scanning
  - Privilege escalation attempts
  - RBAC weakness detection
- **Manual Testing:** Network policy validation via test pods

**Screenshots:**
- kube-hunter report summary
- Network policy test: `kubectl run test-pod` showing blocked access

---

## Slide 25: Static Analysis Findings
**Content:**
- **kubesec Results:**
  - Security scores for manifests
  - Identified missing controls (remediated)
- **Trivy Results:**
  - **Backend:** 8 vulnerabilities (1 HIGH, 4 MEDIUM, 3 LOW)
  - **Frontend:** 21 vulnerabilities (3 CRITICAL, 2 HIGH, 9 MEDIUM, 7 LOW)
  - **Critical CVEs:** CVE-2025-49794 (libxml2), CVE-2025-58050 (pcre2)
  - **Node.js dependencies:** Clean (no vulnerabilities)

**Screenshots:**
- Trivy scan report snippets showing critical vulnerabilities
- kubesec security scores table

---

## Slide 26: Dynamic Analysis Findings
**Content:**
- **Network Security:** 10/10 (complete isolation verified)
  - NMAP scans blocked
  - Nikto unable to reach services
  - Network policies functioning correctly
- **Configuration Security:** 8/10
  - Strong RBAC, network policies, resource limits
  - Capabilities dropped (post-remediation)

**Screenshots:**
- **Figure 17**: Combined validation showing:
  - Resource limits enforced
  - RBAC least privilege confirmed
  - Network policy blocking unauthorized access

---

## Slide 27: Penetration Testing Findings
**Content:**
- **kube-hunter Results:** 4 findings
  - **CAP_NET_RAW enabled** (MEDIUM) - **REMEDIATED** post-testing
  - Service account tokens accessible (MEDIUM - mitigated by RBAC)
  - AWS metadata exposure (FALSE POSITIVE - not on AWS)
  - No remote clusters discovered (GOOD - proper isolation)

**Screenshots:**
- kube-hunter report showing findings
- Before/after: Security context showing capabilities.drop: ["ALL"]

---

## Slide 28: Vulnerability Summary & Severity
**Content:**
- **Overall Security Posture:** 8.5/10
  - Good for development
  - Requires image patching for production
- **Breakdown:**
  - Configuration Security: 8/10
  - Image Vulnerabilities: 29 total (3 critical)
  - Network Security: 10/10
  - Penetration Testing: 4 findings (1 remediated)

**Screenshots:**
- Summary table/chart of findings by severity
- Trivy vulnerability breakdown chart

---

## Slide 29: Critical Vulnerabilities & Remediation
**Content:**
- **CVE-2025-49794 (CRITICAL):** libxml2 heap use-after-free
- **CVE-2025-58050 (CRITICAL):** pcre2 heap buffer overflow
- **Remediation:** Update Alpine base images from 3.21.3/3.22.0 to latest patched versions
- **Status:** Identified, remediation plan documented

**Screenshots:**
- Trivy report showing critical CVE details
- Remediation commands/plan

---

## Slide 30: Security Posture Assessment
**Content:**
- **Strengths:**
  - Strong network segmentation
  - Effective RBAC policies
  - Resource limits enforced
  - Non-root containers
  - Secrets management
- **Areas for Improvement:**
  - Update base images (critical CVEs)
  - Consider read-only root filesystems where possible
  - Regular vulnerability scanning in CI/CD

**Screenshots:** None (summary slide)

---

## Slide 31: Lessons Learned
**Content:**
- **Infrastructure Constraints:** Single-node cluster due to CloudLab limitations
- **Security Trade-offs:** Writable root filesystem for app functionality
- **Network Policies:** Effective but require careful testing
- **Vulnerability Management:** Regular scanning essential, base image updates critical

**Screenshots:** None

---

## Slide 32: Future Work & Recommendations
**Content:**
- **Immediate:**
  - Patch base images (critical CVEs)
  - Implement read-only root filesystems where feasible
- **Short-term:**
  - Multi-node cluster for high availability
  - Automated vulnerability scanning in CI/CD
  - Security monitoring and alerting
- **Long-term:**
  - Service mesh (Istio/Linkerd) for advanced network policies
  - Pod Security Standards (PSP/PSS)
  - Compliance automation (OPA/Gatekeeper)

**Screenshots:** None

---

## Slide 33: Deployment Statistics
**Content:**
- **Total Deployment Time:** ~90 minutes (including troubleshooting)
- **Infrastructure Setup:** 30-60 minutes (CloudLab + OpenStack)
- **Kubernetes Cluster:** ~15 minutes (Magnum provisioning)
- **Application Deployment:** ~15 minutes (containerization + K8s)
- **Security Hardening:** Integrated throughout deployment

**Screenshots:** None (metrics slide)

---

## Slide 34: Final Architecture Summary
**Content:**
- **CloudLab (d710)**
  - └─ **OpenStack (DevStack)**
      - └─ **Magnum-created VM (Fedora CoreOS)**
          - └─ **Kubernetes Master (single-node)**
              - ├─ **Backend Pod** (10.100.0.24:3000)
              - ├─ **Frontend Pod** (10.100.0.18:80)
              - └─ **Flannel CNI** (10.100.0.0/16)

**Screenshots:**
- **Figure 10**: Architecture diagram (reuse from earlier)
- **Figure 6**: Kubernetes nodes status

---

## Slide 35: Key Takeaways
**Content:**
- Successfully deployed secure cloud application on OpenStack + Kubernetes
- Implemented 11 security controls following defense-in-depth principles
- Comprehensive security analysis using static, dynamic, and penetration testing
- Identified and documented vulnerabilities with remediation plans
- Demonstrated real-world cloud security best practices

**Screenshots:** None

---

## Slide 36: Q&A / Thank You
**Content:**
- Questions?
- Contact information
- References:
  - OpenStack Documentation
  - Kubernetes Security Best Practices
  - CloudLab Documentation

**Screenshots:** None

---

## Presentation Tips

### Screenshot Organization:
1. **Group related screenshots** on the same slide when possible
2. **Use Figure 17** strategically - it's a powerful combined validation screenshot
3. **Code snippets** should be readable (use syntax highlighting)
4. **Architecture/Network diagrams** should be clear and labeled

### Visual Flow:
- **Part 1 (Slides 3-12):** Application and deployment (50% of grade)
- **Part 2 (Slides 13-20):** Security configuration (25% of grade)
- **Part 3 (Slides 21-28):** Security analysis (25% of grade)
- **Conclusion (Slides 29-36):** Summary, lessons, Q&A

### Time Allocation (if presenting):
- **Part 1:** ~8-10 minutes
- **Part 2:** ~5-6 minutes
- **Part 3:** ~5-6 minutes
- **Q&A:** ~2-3 minutes
- **Total:** ~20-25 minutes

### Important Notes:
- **Include JHEDIDs** in all screenshots (as per assignment requirements)
- **Use original screenshots** (not edited with added text)
- **Reference figure numbers** consistently (Figure 1-17 from homework)
- **Keep slides concise** - use bullet points, not paragraphs
- **Highlight key findings** with visual emphasis (colors, bold text)

