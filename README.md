# 🎓 HopkinsConnect

**Student Collaboration Platform for Johns Hopkins University**

A secure cloud-based web application that helps JHU students find collaborators for research projects, startups, business ventures, and academic work.

---

## 📋 Project Overview

**Course:** EN.650.663 - Cloud Computing Security, Fall 2025  
**Assignment:** Homework 6 - Cloud Application Deployment and Security Analysis  
**Team Members:**
- Mahendra (mshahi2@jh.edu)
- Abdulaziz

---

## 🎯 Features

- ✅ User registration with profile creation
- ✅ Secure authentication (JWT-based)
- ✅ Browse student profiles
- ✅ Search by interests, major, or name
- ✅ Responsive modern UI
- ✅ Password encryption (bcrypt)
- ✅ Input validation & XSS prevention

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Nginx web server
- Containerized with Docker

**Backend:**
- Node.js with Express.js
- SQLite database
- JWT authentication
- Security middleware (Helmet, CORS)
- Containerized with Docker

**Infrastructure:**
- CloudLab bare metal servers
- OpenStack for VM management
- Kubernetes (via OpenStack Magnum)
- Docker for containerization

### Deployment Architecture

```
User → Internet → Kubernetes Ingress/LoadBalancer
                        ↓
                  Frontend Pod (Nginx)
                        ↓
                  Backend Pod (Node.js + SQLite)
                        ↓
                  Persistent Volume (Database)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Docker installed (for containerization)
- kubectl configured (for Kubernetes deployment)
- Access to OpenStack cluster (from Homework 5)

### Local Development

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/hopkinsconnect.git
cd hopkinsconnect
```

**2. Run Backend:**
```bash
cd backend
npm install
node server.js
# Backend runs on http://localhost:3000
```

**3. Run Frontend:**
```bash
cd frontend/public
python3 -m http.server 8080
# Frontend runs on http://localhost:8080
```

**4. Test the application:**
- Open http://localhost:8080 in browser
- Register a new user
- Login and browse profiles

---

## 🐳 Docker Deployment

### Build Images

```bash
# Backend
cd backend
docker build -t hopkinsconnect-backend:v1 .

# Frontend
cd frontend
docker build -t hopkinsconnect-frontend:v1 .
```

### Run Containers Locally

```bash
# Backend
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  hopkinsconnect-backend:v1

# Frontend
docker run -p 8080:80 hopkinsconnect-frontend:v1
```

### Push to Registry

```bash
# Tag images
docker tag hopkinsconnect-backend:v1 yourusername/hopkinsconnect-backend:v1
docker tag hopkinsconnect-frontend:v1 yourusername/hopkinsconnect-frontend:v1

# Push to Docker Hub
docker push yourusername/hopkinsconnect-backend:v1
docker push yourusername/hopkinsconnect-frontend:v1
```

---

## ☸️ Kubernetes Deployment

### Deploy to Cluster

```bash
# Apply all Kubernetes manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods
kubectl get services

# Get external IP (if LoadBalancer)
kubectl get svc frontend-service
```

### Access the Application

```bash
# Get the service URL
kubectl get svc frontend-service -o wide

# Or port-forward for testing
kubectl port-forward svc/frontend-service 8080:80
```

---

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT (JSON Web Tokens) for stateless auth
   - Bcrypt password hashing (10 rounds)
   - Secure session management

2. **Encryption**
   - HTTPS/TLS for production (self-signed cert)
   - Kubernetes Secrets for sensitive data
   - Encrypted environment variables

3. **Network Security**
   - Kubernetes Network Policies
   - OpenStack Security Groups
   - CORS configuration
   - Rate limiting (planned)

4. **Input Validation**
   - SQL injection prevention (prepared statements)
   - XSS protection (input sanitization)
   - CSRF protection (tokens)
   - HTML escaping in frontend

5. **Container Security**
   - Non-root user in containers
   - Read-only filesystems where possible
   - Resource limits (CPU/RAM)
   - Security headers (Helmet.js)

### Security Analysis Tools Used

- **kube-hunter** - Kubernetes vulnerability scanning
- **trivy** - Container image CVE scanning
- **kubeaudit** - Kubernetes RBAC auditing
- **nmap** - Network port scanning
- **OWASP ZAP** - Web application security testing
- **npm audit** - Dependency vulnerability checking

---

## 📁 Project Structure

```
hopkinsconnect/
├── README.md
├── .gitignore
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── public/
│       ├── index.html
│       ├── register.html
│       ├── profiles.html
│       ├── style.css
│       └── app.js
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── database.js
│   └── routes/
│       ├── auth.js (planned)
│       └── profiles.js (planned)
│
├── kubernetes/
│   ├── deployments/
│   │   ├── backend-deployment.yaml
│   │   └── frontend-deployment.yaml
│   ├── services/
│   │   ├── backend-service.yaml
│   │   └── frontend-service.yaml
│   └── security/
│       ├── network-policy.yaml
│       └── secrets.yaml
│
├── docs/
│   ├── architecture-diagram.png
│   ├── network-diagram.png
│   └── deployment-guide.md
│
└── security/
    ├── scan-scripts.sh
    └── reports/
        ├── kube-hunter-report.txt
        ├── trivy-report.json
        └── security-analysis.md
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login (returns JWT)

### Profiles
- `GET /api/profiles` - Get all user profiles
- `GET /api/profiles/search?q=<query>` - Search profiles

### Health Check
- `GET /health` - Service health status

---

## 🧪 Testing

### Manual Testing
```bash
# Register user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"jdoe@jhu.edu","password":"test123","major":"CS","interests":"AI, ML"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jdoe@jhu.edu","password":"test123"}'

# Get profiles
curl http://localhost:3000/api/profiles
```

---

## 📈 Future Enhancements

- [ ] Real-time messaging between users
- [ ] Advanced matching algorithm
- [ ] Email verification
- [ ] Profile pictures
- [ ] Project posting system
- [ ] Skill endorsements
- [ ] Integration with JHU SSO

---

## 🤝 Contributing

This is an academic project for Johns Hopkins University. 

**Team Members:**
- **Mahendra** - Backend development, Kubernetes deployment, Security scanning
- **Abdulaziz** - Frontend development, Documentation, Security analysis

---

## 📄 License

This project is for educational purposes as part of EN.650.663 Cloud Computing Security course at Johns Hopkins University.

---

## 📞 Contact

For questions or issues, contact:
- Mahendra: mshahi2@jh.edu
- Instructor: Reuben Johnston (reub@jhu.edu)

---

## 🙏 Acknowledgments

- **Course:** EN.650.663 - Cloud Computing Security
- **Institution:** Johns Hopkins University
- **Instructor:** Reuben Johnston
- **Infrastructure:** CloudLab bare metal platform
- **Base Profile:** OpenStack_K8s from Homework 5

---

**Last Updated:** November 2025

