# Deploy NestJS to Azure App Service using Docker Hub

## Prerequisites
- Azure account ([Create free account](https://azure.microsoft.com/free/))
- Docker Hub account ([Sign up](https://hub.docker.com/signup))
- Azure CLI installed ([Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))

---

## Step 1: Push Image to Docker Hub

### 1.1 Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### 1.2 Tag Your Image
```bash
# Replace 'yourusername' with your Docker Hub username
docker tag nestjs-app yourusername/nestjs-app:latest
```

### 1.3 Push to Docker Hub
```bash
docker push yourusername/nestjs-app:latest
```

### 1.4 Verify on Docker Hub
Visit `https://hub.docker.com/r/yourusername/nestjs-app` to confirm the image is uploaded.

---

## Step 2: Deploy to Azure App Service

### 2.1 Login to Azure
```bash
az login
```

### 2.2 Create Resource Group
```bash
az group create --name nestjs-rg --location eastus
```

### 2.3 Create App Service Plan
```bash
az appservice plan create \
  --name nestjs-plan \
  --resource-group nestjs-rg \
  --is-linux \
  --sku B1
```

### 2.4 Create Web App with Docker Hub Image
```bash
# Replace 'yourusername' with your Docker Hub username
# Replace 'my-nestjs-webapp' with your desired app name (must be globally unique)
az webapp create \
  --resource-group nestjs-rg \
  --plan nestjs-plan \
  --name my-nestjs-webapp \
  --deployment-container-image-name yourusername/nestjs-app:latest
```

### 2.5 Configure Application Settings
```bash
az webapp config appsettings set \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp \
  --settings WEBSITES_PORT=3001 PORT=3001 NODE_ENV=production
```

### 2.6 Configure Container Settings (for private Docker Hub repos)
**If your Docker Hub image is private**, configure authentication:

```bash
az webapp config container set \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --docker-custom-image-name yourusername/nestjs-app:latest \
  --docker-registry-server-url https://index.docker.io/v1 \
  --docker-registry-server-user <your-dockerhub-username> \
  --docker-registry-server-password <your-dockerhub-password>
```

**Skip this step if your image is public.**

---

## Step 3: Verify Deployment

### 3.1 Get Application URL
```bash
az webapp show \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --query "defaultHostName" -o tsv
```

Your app will be available at: `https://my-nestjs-webapp.azurewebsites.net`

### 3.2 Check Deployment Status
```bash
az webapp show \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --query "state" -o tsv
```

### 3.3 Enable and View Logs
```bash
# Enable logging
az webapp log config \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --docker-container-logging filesystem

# Stream logs in real-time
az webapp log tail \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg
```

---

## Step 4: Enable Continuous Deployment (Optional)

Enable webhook to auto-deploy when you push new images to Docker Hub:

```bash
az webapp deployment container config \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg \
  --enable-cd true
```

Get the webhook URL:
```bash
az webapp deployment container show-cd-url \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg
```

Add this webhook URL to your Docker Hub repository:
1. Go to Docker Hub → Your Repository → Webhooks
2. Add webhook with the URL from above

---

## Update/Redeploy Application

When you make changes to your code:

### 1. Rebuild and Push
```bash
# Rebuild image
docker build -t nestjs-app .

# Tag for Docker Hub
docker tag nestjs-app yourusername/nestjs-app:latest

# Push to Docker Hub
docker push yourusername/nestjs-app:latest
```

### 2. Restart App Service
```bash
az webapp restart \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg
```

**Note:** If continuous deployment is enabled, the app will auto-restart when detecting new image.

---

## Using Azure Portal (Alternative Method)

### 1. Push to Docker Hub (same as Step 1 above)

### 2. Create Web App in Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. Fill in:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new "nestjs-rg"
   - **Name**: my-nestjs-webapp (must be unique)
   - **Publish**: **Docker Container**
   - **Operating System**: Linux
   - **Region**: Select near you
   - **Pricing Plan**: Create new → Select B1 Basic

4. Click "Next: Docker"
   - **Options**: Single Container
   - **Image Source**: Docker Hub
   - **Access Type**: Public (or Private if needed)
   - **Image and tag**: yourusername/nestjs-app:latest

5. Click "Review + Create" → "Create"

### 3. Configure Settings
1. Go to your App Service → Configuration → Application settings
2. Add new application settings:
   - `WEBSITES_PORT` = `3001`
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
3. Click "Save"

4. Go to "Deployment Center"
   - Enable "Continuous deployment" if desired
   - Copy webhook URL and add to Docker Hub

---

## Monitoring & Troubleshooting

### View Application Insights
```bash
# Enable Application Insights
az webapp config appsettings set \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
```

### Check Container Logs
```bash
# Download logs
az webapp log download \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp \
  --log-file logs.zip
```

### SSH into Container
```bash
az webapp ssh \
  --resource-group nestjs-rg \
  --name my-nestjs-webapp
```

### Common Issues

**Issue: Site not loading**
- Check logs: `az webapp log tail --name my-nestjs-webapp --resource-group nestjs-rg`
- Verify `WEBSITES_PORT=3001` is set

**Issue: Container keeps restarting**
- Check if application listens on correct port (3001)
- Verify environment variables are set correctly

**Issue: "Failed to pull image"**
- Verify image name is correct on Docker Hub
- If private repo, check Docker Hub credentials are configured

---

## Cost Information

**Azure App Service B1 Plan:**
- ~$13 USD/month
- 1 vCPU, 1.75 GB RAM
- 10 GB storage
- Custom domains and SSL included

**Free Trial:** Azure offers $200 credit for 30 days

---

## Clean Up Resources

### Delete everything:
```bash
az group delete --name nestjs-rg --yes --no-wait
```

### Delete only the web app:
```bash
az webapp delete \
  --name my-nestjs-webapp \
  --resource-group nestjs-rg
```

---

## Quick Reference Commands

```bash
# View app status
az webapp show --name my-nestjs-webapp --resource-group nestjs-rg

# Restart app
az webapp restart --name my-nestjs-webapp --resource-group nestjs-rg

# Stop app
az webapp stop --name my-nestjs-webapp --resource-group nestjs-rg

# Start app
az webapp start --name my-nestjs-webapp --resource-group nestjs-rg

# Stream logs
az webapp log tail --name my-nestjs-webapp --resource-group nestjs-rg

# List all apps
az webapp list --resource-group nestjs-rg --output table
```

---

## Next Steps

- ✅ Add custom domain
- ✅ Enable HTTPS/SSL (automatic with App Service)
- ✅ Set up staging slots for zero-downtime deployment
- ✅ Configure auto-scaling rules
- ✅ Add Application Insights monitoring
- ✅ Set up GitHub Actions CI/CD
