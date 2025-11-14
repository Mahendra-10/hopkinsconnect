#!/bin/bash
# HopkinsConnect Kubernetes Deployment Script
# Run this from the hopkinsconnect/ directory

set -e  # Exit on error

echo "🚀 HopkinsConnect Deployment Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is configured
echo "1️⃣  Checking kubectl configuration..."
if ! kubectl cluster-info &> /dev/null; then
    print_error "kubectl is not configured. Please set KUBECONFIG."
    echo "Run: export KUBECONFIG=~/config"
    exit 1
fi
print_status "kubectl is configured and cluster is accessible"
echo ""

# Check if Docker images exist
echo "2️⃣  Checking Docker images..."
print_warning "Make sure you've built and pushed images:"
echo "  docker build -t mahendra10/hopkinsconnect-backend:v1 backend/"
echo "  docker build -t mahendra10/hopkinsconnect-frontend:v1 frontend/"
echo "  docker push mahendra10/hopkinsconnect-backend:v1"
echo "  docker push mahendra10/hopkinsconnect-frontend:v1"
echo ""
read -p "Have you pushed the images? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Please build and push images first"
    exit 1
fi
print_status "Docker images confirmed"
echo ""

# Create namespace (optional)
echo "3️⃣  Creating namespace (optional)..."
read -p "Create a dedicated namespace? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    kubectl create namespace hopkinsconnect --dry-run=client -o yaml | kubectl apply -f -
    NAMESPACE="-n hopkinsconnect"
    print_status "Namespace 'hopkinsconnect' created"
else
    NAMESPACE=""
    print_status "Using default namespace"
fi
echo ""

# Deploy storage
echo "4️⃣  Deploying persistent volume..."
kubectl apply $NAMESPACE -f kubernetes/storage/persistent-volume.yaml
print_status "Persistent volume claim created"
echo ""

# Deploy secrets
echo "5️⃣  Deploying secrets..."
kubectl apply $NAMESPACE -f kubernetes/security/secrets.yaml
print_status "Secrets created"
echo ""

# Deploy backend
echo "6️⃣  Deploying backend..."
kubectl apply $NAMESPACE -f kubernetes/deployments/backend-deployment.yaml
kubectl apply $NAMESPACE -f kubernetes/services/backend-service.yaml
print_status "Backend deployed"
echo ""

# Deploy frontend
echo "7️⃣  Deploying frontend..."
kubectl apply $NAMESPACE -f kubernetes/deployments/frontend-deployment.yaml
kubectl apply $NAMESPACE -f kubernetes/services/frontend-service.yaml
print_status "Frontend deployed"
echo ""

# Deploy network policy
echo "8️⃣  Deploying network policy..."
kubectl apply $NAMESPACE -f kubernetes/security/network-policy.yaml
print_status "Network policy applied"
echo ""

# Wait for pods to be ready
echo "9️⃣  Waiting for pods to be ready..."
echo "This may take a few minutes..."
kubectl wait $NAMESPACE --for=condition=ready pod -l app=hopkinsconnect --timeout=300s
print_status "All pods are ready!"
echo ""

# Display deployment status
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📊 Deployment Status:"
kubectl get $NAMESPACE pods -l app=hopkinsconnect
echo ""
kubectl get $NAMESPACE svc
echo ""

# Get access information
echo "🌐 Access Information:"
echo "====================="
FRONTEND_SERVICE=$(kubectl get $NAMESPACE svc frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

if [ -z "$FRONTEND_SERVICE" ]; then
    print_warning "LoadBalancer IP not assigned yet (this is normal in some clusters)"
    echo ""
    echo "Access options:"
    echo "1. Wait for LoadBalancer IP:"
    echo "   kubectl get $NAMESPACE svc frontend-service -w"
    echo ""
    echo "2. Use NodePort:"
    NODEPORT=$(kubectl get $NAMESPACE svc frontend-service -o jsonpath='{.spec.ports[0].nodePort}')
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
    if [ -z "$NODE_IP" ]; then
        NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    fi
    echo "   http://$NODE_IP:$NODEPORT"
    echo ""
    echo "3. Use port-forwarding:"
    echo "   kubectl port-forward $NAMESPACE svc/frontend-service 8080:80"
    echo "   Then access: http://localhost:8080"
else
    print_status "Application is accessible at: http://$FRONTEND_SERVICE"
fi

echo ""
echo "📝 Useful Commands:"
echo "==================="
echo "View pods:        kubectl get $NAMESPACE pods"
echo "View services:    kubectl get $NAMESPACE svc"
echo "View logs:        kubectl logs $NAMESPACE -l component=backend"
echo "Describe pod:     kubectl describe $NAMESPACE pod <pod-name>"
echo "Delete all:       kubectl delete $NAMESPACE -f kubernetes/"
echo ""
print_status "Deployment script completed successfully!"

