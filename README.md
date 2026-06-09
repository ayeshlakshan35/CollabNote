# CollabNote

```
CollabNote is a collaborative note-taking and document management web application built with the MERN stack and deployed using a DevOps-focused workflow with Docker and Kubernetes.

The project includes a React/Vite frontend, Node.js/Express backend, MongoDB Atlas database, Docker containerization, and local Kubernetes deployment using Minikube and NGINX Ingress.
```


## Project Overview

```
CollabNote allows users to securely create, manage, search, organize, and share notes in one centralized platform. It also supports PDF document uploads and collaborator-based shared notes.

This project was extended beyond full-stack development to demonstrate practical DevOps skills including containerization, Kubernetes deployments, service networking, ingress routing, secrets management, and troubleshooting.
```

## Tech Stack

### Application
```
- React.js + Vite
- Tailwind CSS
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer for PDF uploads
```

### DevOps
```
- Docker
- Kubernetes
- Minikube
- NGINX Ingress
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes Secrets
- kubectl
- Linux
```

## Features
```
- User registration and login
- JWT-based authentication
- Create, edit, delete, search, and filter notes
- Rich text note editor
- PDF upload support
- Shared notes and collaborator management
- Dashboard statistics
- Dockerized frontend and backend
- Local Kubernetes deployment with Minikube
- NGINX Ingress routing for frontend and backend API traffic
```


## DevOps Architecture

```
Browser
   ↓
collabnote.local
   ↓
NGINX Ingress
   ├── /     → Frontend Service → React Frontend Pod
   └── /api  → Backend Service  → Node.js Backend Pod
                                  ↓
                             MongoDB Atlas
```



## Project Structure

```
CollabNote/
├── client/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
└── k8s/
    ├── namespace.yaml
    ├── backend-secret.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    └── ingress.yaml

```


## Local Development

Run the backend:
```
cd server
npm install
npm run dev
```

Create .env file in backend
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Run in frontend:
```
cd client
npm install
npm run dev
```


............................................................................


## Kubernetes Deployment with Minikube
Minikube was used to deploy the application locally on Kubernetes.
```
minikube start
minikube addons enable ingress
eval $(minikube docker-env)
```

Rebuild images inside the Minikube Docker environment:
```
docker build -t collabnote-frontend:v1 ./client
docker build -t collabnote-backend:v1 ./server
```

For Kubernetes, the frontend production API URL was updated to:
```
VITE_API_URL=/api
```


Backend environment variables were managed using a Kubernetes Secret:
```
stringData:
  PORT: "5000"
  MONGO_URI: "your_mongodb_atlas_connection_string"
  JWT_SECRET: "your_jwt_secret"
  CLIENT_URL: "http://collabnote.local"
  NODE_ENV: "production"
```

Apply Kubernetes manifests:
```
kubectl apply -f k8s/
```

Check deployment status:
```
kubectl get all -n collabnote
kubectl get ingress -n collabnote
kubectl logs deployment/backend -n collabnote
```

Local Domain Setup.The local domain was configured by mapping the Minikube IP to collabnote.local.
```
minikube ip
sudo nano /etc/hosts
```

Example:
```
192.168.49.2 collabnote.local
```

Access the app:
```
http://collabnote.local
````


### Troubleshooting Experience
```
During deployment, I resolved real Kubernetes issues including:

ImagePullBackOff
ErrImagePull
Minikube local image visibility issues
Local DNS resolution issues
NGINX Ingress routing problems
MongoDB Atlas backend connectivity
Pod log debugging and rollout restarts
```

Useful commands:
```
kubectl get pods -n collabnote
kubectl describe pod <pod-name> -n collabnote
kubectl logs deployment/backend -n collabnote
kubectl get events -n collabnote --sort-by=.metadata.creationTimestamp
kubectl rollout restart deployment/frontend -n collabnote
kubectl rollout restart deployment/backend -n collabnote
```

### Future Improvements
```
Deploy to Azure Kubernetes Service
Push Docker images to Azure Container Registry
Add GitHub Actions CI/CD for Kubernetes deployment
Add HTTPS with cert-manager
Add monitoring with Prometheus and Grafana
Add centralized logging
Add real-time collaboration with WebSockets
```

### Author
Ayesha Lakshan
