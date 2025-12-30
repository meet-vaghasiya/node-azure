# Azure Container Deployment Guide

This guide provides step-by-step instructions to deploy your NestJS Docker container to Azure.

## Prerequisites

✅ Azure account with active subscription ([Create free account](https://azure.microsoft.com/free/))
✅ Docker installed and running locally
✅ Azure CLI installed ([Download here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
✅ VS Code with Azure extensions (optional but recommended)

---

## Deployment Options

Azure offers multiple ways to deploy containers:

1. **Azure Container Instances (ACI)** - Simplest, serverless containers (recommended for quick deployment)
2. **Azure App Service** - PaaS with built-in scaling and custom domains
3. **Azure Container Apps** - Modern serverless container platform

---

## Option 1: Azure Container Instances (ACI) - Simplest & Fastest

### Step 1: Install Azure CLI
```bash
# Verify installation
az --version
```

### Step 2: Login to Azure
```bash
az login
```
This will open a browser window for authentication.

### Step 3: Create Resource Group
```bash
az group create --name nestjs-rg --location eastus
```

### Step 4: Create Azure Container Registry (ACR)
```bash
# Create registry (replace 'myuniqueregistryname' with your unique name)
az acr create --resource-group nestjs-rg --name myuniqueregistryname --sku Basic

# Enable admin access
az acr update -n myuniqueregistryname --admin-enabled true

# Get login credentials
az acr credential show --name myuniqueregistryname
```

### Step 5: Login to ACR
```bash
az acr login --name myuniqueregistryname
```

### Step 6: Tag and Push Docker Image
```bash
# Tag your image
docker tag nestjs-app myuniqueregistryname.azurecr.io/nestjs-app:latest

# Push to ACR
docker push myuniqueregistryname.azurecr.io/nestjs-app:latest
```

### Step 7: Deploy to Azure Container Instances
```bash
# Get ACR password
ACR_PASSWORD=$(az acr credential show --name myuniqueregistryname --query "passwords[0].value" -o tsv)

# Deploy container
az container create \
  --resource-group nestjs-rg \
  --name nestjs-container \
  --image myuniqueregistryname.azurecr.io/nestjs-app:latest \
  --dns-name-label my-nestjs-app-unique \
  --ports 3001 \
  --registry-login-server myuniqueregistryname.azurecr.io \
  --registry-username myuniqueregistryname \
  --registry-password $ACR_PASSWORD \
  --environment-variables PORT=3001 NODE_ENV=production
```

### Step 8: Verify Deployment
```bash
# Get container details
az container show --resource-group nestjs-rg --name nestjs-container --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table

# Check logs
az container logs --resource-group nestjs-rg --name nestjs-container
```

Your app will be available at: `http://my-nestjs-app-unique.eastus.azurecontainer.io:3001`

---

## Option 2: Azure App Service - Production Ready with Custom Domain

### Step 1-6: Same as ACI (Steps 1-6 above)

### Step 7: Create App Service Plan
```bash
az appservice plan create \
  --name nestjs-plan \
  --resource-group nestjs-rg \
  --is-linux \
  --sku B1
```

### Step 8: Create Web App
```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name myuniqueregistryname --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name myuniqueregistryname --query "passwords[0].value" -o tsv)

# Create web app
az webapp create \
  --resource-group nestjs-rg \
  --plan nestjs-plan \
  --name my-nestjs-webapp \
  --deployment-container-image-name myuniqueregistryname.azurecr.io/nestjs-app:latest

# Configure registry credentials
az webapp config container set \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --docker-custom-image-name myuniqueregistryname.azurecr.io/nestjs-app:latest \
  --docker-registry-server-url https://myuniqueregistryname.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Configure port
az webapp config appsettings set \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp \
  --settings WEBSITES_PORT=3001 PORT=3001 NODE_ENV=production
```

### Step 9: Enable Continuous Deployment (Optional)
```bash
az webapp deployment container config \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --enable-cd true
```

### Step 10: Verify Deployment
```bash
# Get app URL
az webapp show --name my-nestjs-webapp --resource-group nestjs-rg --query "defaultHostName" -o tsv

# Stream logs
az webapp log tail --name my-nestjs-webapp --resource-group nestjs-rg
```

Your app will be available at: `https://my-nestjs-webapp.azurewebsites.net`

---

## Option 3: Using Azure Portal (Visual Interface)

### 1. Create Container Registry
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Container registries" → Click "Create"
3. Fill in:
   - **Subscription**: Select your subscription
   - **Resource group**: Create new "nestjs-rg"
   - **Registry name**: Your unique name
   - **Location**: Select region near you
   - **SKU**: Basic
4. Go to "Access keys" → Enable "Admin user"
5. Note the Login server, Username, and Password

### 2. Push Image to ACR
```bash
# Login
docker login <your-registry>.azurecr.io
# Username: from portal
# Password: from portal

# Tag and push
docker tag nestjs-app <your-registry>.azurecr.io/nestjs-app:latest
docker push <your-registry>.azurecr.io/nestjs-app:latest
```

### 3. Deploy to App Service
1. Search for "App Services" → Click "Create" → "Web App"
2. Fill in:
   - **Resource Group**: nestjs-rg
   - **Name**: Your app name
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Region**: Same as registry
3. Click "Next: Docker"
   - **Image Source**: Azure Container Registry
   - **Registry**: Select your registry
   - **Image**: nestjs-app
   - **Tag**: latest
4. Click "Review + Create" → "Create"
5. After deployment, go to Configuration → Application settings
   - Add: `WEBSITES_PORT = 3001`
   - Add: `PORT = 3001`
6. Click Application Url to view your app

---

## Using VS Code Extensions (Easiest Method)

### Install Extensions
1. Azure App Service extension
2. Docker extension

### Deploy Steps
1. Open Docker extension in VS Code
2. Find your `nestjs-app` image
3. Right-click → "Push" → Select ACR
4. Right-click pushed image in Registries → "Deploy Image to Azure App Service"
5. Follow prompts to create/select resource group and app service plan

---

## Environment Variables Configuration

For any deployment method, configure these environment variables:

```bash
PORT=3001
NODE_ENV=production
```

**In App Service:**
```bash
az webapp config appsettings set \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp \
  --settings PORT=3001 NODE_ENV=production
```

**In Container Instances:**
Add `--environment-variables` flag during creation (shown in Step 7 above)

---

## Monitoring & Troubleshooting

### View Logs (ACI)
```bash
az container logs --resource-group nestjs-rg --name nestjs-container --follow
```

### View Logs (App Service)
```bash
# Enable logging
az webapp log config \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --docker-container-logging filesystem

# Stream logs
az webapp log tail --name my-nestjs-webapp --resource-group nestjs-rg
```

### Check Container Status
```bash
# ACI
az container show --resource-group nestjs-rg --name nestjs-container

# App Service
az webapp show --name my-nestjs-webapp --resource-group nestjs-rg
```

---

## Update/Redeploy Application

### After making changes to your code:

1. **Rebuild Docker image:**
```bash
docker build -t nestjs-app .
```

2. **Tag and push to ACR:**
```bash
docker tag nestjs-app myuniqueregistryname.azurecr.io/nestjs-app:latest
docker push myuniqueregistryname.azurecr.io/nestjs-app:latest
```

3. **Restart service:**

**For ACI:**
```bash
az container restart --resource-group nestjs-rg --name nestjs-container
```

**For App Service:**
```bash
az webapp restart --name my-nestjs-webapp --resource-group nestjs-rg
```

---

## Clean Up Resources

### Delete everything to avoid charges:
```bash
# Delete entire resource group (removes all resources)
az group delete --name nestjs-rg --yes --no-wait
```

### Delete specific resources:
```bash
# Delete container instance
az container delete --resource-group nestjs-rg --name nestjs-container --yes

# Delete web app
az webapp delete --name my-nestjs-webapp --resource-group nestjs-rg

# Delete container registry
az acr delete --name myuniqueregistryname --resource-group nestjs-rg --yes
```

---

## Cost Estimation

- **Container Instances (ACI)**: ~$0.0000125 per second (~$1/day for 1 vCPU, 1.5GB)
- **App Service Basic (B1)**: ~$13/month (always running)
- **Container Registry Basic**: ~$5/month

---

## Next Steps

- ✅ Add custom domain to App Service
- ✅ Enable HTTPS with free SSL certificate
- ✅ Set up CI/CD with GitHub Actions
- ✅ Configure scaling rules
- ✅ Add Application Insights for monitoring
- ✅ Set up backup and disaster recovery

---

## Common Issues

**Issue: Port not accessible**
- Solution: Set `WEBSITES_PORT=3001` in App Service settings

**Issue: Container won't start**
- Solution: Check logs with `az container logs` or `az webapp log tail`

**Issue: Authentication failed**
- Solution: Verify ACR admin user is enabled and credentials are correct

**Issue: Image not found**
- Solution: Verify image was pushed successfully with `az acr repository list --name myuniqueregistryname`
