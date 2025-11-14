#!/bin/bash

set -e  # Exit on error

echo "======================================"
echo "HopkinsConnect Deployment Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="mahendra10"
BACKEND_IMAGE="${DOCKER_USERNAME}/hopkinsconnect-backend:v1"
FRONTEND_IMAGE="${DOCKER_USERNAME}/hopkinsconnect-frontend:v1"
CONTROLLER_HOST="Mshahi@controller.hopkinsconnect.jhucloudsec2025.emulab.net"

echo -e "${YELLOW}Step 1: Docker Login${NC}"
echo "Please log in to Docker Hub..."
docker login -u $DOCKER_USERNAME
echo ""

echo -e "${YELLOW}Step 2: Building Backend Docker Image${NC}"
cd backend
docker build -t $BACKEND_IMAGE .
echo -e "${GREEN}✓ Backend image built${NC}"
echo ""

echo -e "${YELLOW}Step 3: Building Frontend Docker Image${NC}"
cd ../frontend
docker build -t $FRONTEND_IMAGE .
echo -e "${GREEN}✓ Frontend image built${NC}"
echo ""

echo -e "${YELLOW}Step 4: Pushing Images to Docker Hub${NC}"
echo "Pushing backend image..."
docker push $BACKEND_IMAGE
echo -e "${GREEN}✓ Backend image pushed${NC}"

echo "Pushing frontend image..."
docker push $FRONTEND_IMAGE
echo -e "${GREEN}✓ Frontend image pushed${NC}"
echo ""

echo -e "${YELLOW}Step 5: Copying Kubernetes manifests to controller${NC}"
cd ..
ssh $CONTROLLER_HOST "mkdir -p ~/hopkinsconnect-k8s"
scp -r kubernetes/* $CONTROLLER_HOST:~/hopkinsconnect-k8s/
echo -e "${GREEN}✓ Manifests copied${NC}"
echo ""

echo -e "${YELLOW}Step 6: Deploying to Kubernetes${NC}"
ssh $CONTROLLER_HOST << 'ENDSSH'
export KUBECONFIG=/users/Mshahi/config

echo "Creating namespace..."
kubectl create namespace hopkinsconnect || true

echo "Creating secrets..."
kubectl apply -f ~/hopkinsconnect-k8s/security/secrets.yaml

echo "Creating persistent volumes..."
kubectl apply -f ~/hopkinsconnect-k8s/storage/persistent-volume.yaml

echo "Deploying backend..."
kubectl apply -f ~/hopkinsconnect-k8s/deployments/backend-deployment.yaml

echo "Creating backend service..."
kubectl apply -f ~/hopkinsconnect-k8s/services/backend-service.yaml

echo "Deploying frontend..."
kubectl apply -f ~/hopkinsconnect-k8s/deployments/frontend-deployment.yaml

echo "Creating frontend service..."
kubectl apply -f ~/hopkinsconnect-k8s/services/frontend-service.yaml

echo "Applying network policies..."
kubectl apply -f ~/hopkinsconnect-k8s/security/network-policy.yaml || true

echo ""
echo "Waiting for pods to be ready..."
sleep 10
kubectl get pods -n default
echo ""
kubectl get services -n default
ENDSSH

echo ""
echo -e "${GREEN}======================================"
echo "✓ Deployment Complete!"
echo "======================================${NC}"
echo ""
echo "To check the status:"
echo "  ssh $CONTROLLER_HOST"
echo "  export KUBECONFIG=/users/Mshahi/config"
echo "  kubectl get pods"
echo "  kubectl get services"
echo ""
echo "To access the application:"
echo "  kubectl get service hopkinsconnect-frontend"
echo "  Look for the EXTERNAL-IP or NodePort"
echo ""

