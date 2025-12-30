# CI/CD Setup Guide - Automated Deployment to Azure

This guide sets up automated deployment: **Push code → Auto build → Auto deploy to Azure**

---

## Prerequisites

✅ Your code is in a GitHub repository
✅ Docker Hub account
✅ Azure App Service running

---

## Step 1: Add Secrets to GitHub

### 1.1 Docker Hub Credentials

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

**Secret 1:**
- Name: `DOCKER_USERNAME`
- Value: `meetvaghasiya` (your Docker Hub username)

**Secret 2: Create Docker Hub Access Token**

Since you use Google sign-in, you need an access token:

1. Go to https://hub.docker.com
2. Click your profile icon (top right) → **Account Settings**
3. Click **Security** → **Personal Access Tokens**
4. Click **Generate New Token**
5. Description: `github-actions`
6. Access permissions: **Read, Write, Delete**
7. Click **Generate**
8. **Copy the token** (you can only see it once!)

Then add to GitHub:
- Name: `DOCKER_TOKEN`
- Value: Paste the token you just copied

---

### 1.2 Azure Credentials

#### Option A: Using Azure CLI (Recommended)

```bash
# Login to Azure
az login

# Get your subscription ID
az account show --query id --output tsv

# Create service principal (replace with your subscription ID)
az ad sp create-for-rbac \
  --name "github-actions-nestjs" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/DefaultResourceGroup-WUS \
  --sdk-auth
```

This will output JSON like:
```json
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx",
  ...
}
```

**Copy the entire JSON output**

#### Option B: Using Azure Portal

1. Go to Azure Portal → **Azure Active Directory**
2. Click **App registrations** → **New registration**
3. Name: `github-actions-nestjs`
4. Click **Register**
5. Go to **Certificates & secrets** → **New client secret**
6. Copy the secret value
7. Go to your **Subscription** → **Access control (IAM)**
8. Click **Add role assignment**
9. Role: **Contributor**
10. Assign to the app you created

---

### 1.3 Add Azure Credentials to GitHub

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `AZURE_CREDENTIALS`
4. Value: Paste the entire JSON from Step 1.2
5. Click **Add secret**

---

## Step 2: The Workflow File (Already Created)

The file `.github/workflows/azure-deploy.yml` has been created with:

- ✅ Triggers on push to `main` branch
- ✅ Builds Docker image
- ✅ Pushes to Docker Hub with version tags
- ✅ Deploys to Azure App Service
- ✅ Uses caching for faster builds

---

## Step 3: Commit and Push

```bash
# Add the workflow file
git add .github/workflows/azure-deploy.yml

# Commit
git commit -m "Add CI/CD workflow"

# Push to main branch
git push origin main
```

---

## Step 4: Watch It Work! 🚀

1. Go to your GitHub repo
2. Click **Actions** tab
3. You'll see the workflow running
4. Click on the workflow to see real-time logs

**What happens:**
1. ✅ Code checkout
2. ✅ Docker build
3. ✅ Push to Docker Hub with timestamp version
4. ✅ Deploy to Azure
5. ✅ App automatically restarts with new version

Your app will be live at: https://containertest-c5d3dqhke2hka4gt.westus-01.azurewebsites.net/

---

## How to Use CI/CD

### Make a code change:

```bash
# Edit your code
# Example: change src/app.controller.ts

git add .
git commit -m "Update homepage message"
git push origin main

# That's it! GitHub Actions will:
# 1. Build new Docker image
# 2. Push to Docker Hub
# 3. Deploy to Azure
# 4. Your changes are live in 3-5 minutes!
```

---

## Workflow Features

### Version Tagging
Each build gets two tags:
- **Timestamped**: `20251230-143022-abc1234` (unique version)
- **Latest**: `latest` (always points to newest)

Azure uses the timestamped version to ensure fresh deployments.

### Manual Trigger
You can also trigger manually:
1. Go to **Actions** tab
2. Select **Build and Deploy to Azure**
3. Click **Run workflow** → **Run workflow**

### Branch Protection
Currently triggers on `main` branch. To change:
```yaml
on:
  push:
    branches:
      - main
      - develop  # Add more branches
```

---

## Troubleshooting

### "Unauthorized" Error - Docker Hub
- Check `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correct
- For better security, create a Docker Hub access token:
  1. Docker Hub → Account Settings → Security
  2. Create New Access Token
  3. Use token as `DOCKER_PASSWORD`

### "Authentication Failed" Error - Azure
- Verify `AZURE_CREDENTIALS` JSON is complete
- Make sure service principal has Contributor role
- Check subscription ID is correct

### Workflow Doesn't Trigger
- Make sure you pushed to `main` branch
- Check `.github/workflows/` directory exists
- Verify YAML file has correct indentation

### Deployment Successful but App Not Updated
- Check Azure Portal → Deployment Center → Logs
- Verify the image tag was updated
- Check Log Stream for startup errors

---

## View Deployment Logs

### GitHub Actions Logs
- Repo → **Actions** → Click on workflow run
- See detailed logs for each step

### Azure Logs
```bash
# Stream logs
az webapp log tail --name containertest --resource-group DefaultResourceGroup-WUS

# Or in Portal:
# App Service → Log stream
```

---

## Cost Optimization

**GitHub Actions**: 
- Free tier: 2,000 minutes/month (more than enough)
- This workflow uses ~3-5 minutes per run

**Azure App Service**:
- B1 plan: ~$13/month (no extra cost for deployments)

---

## Next Steps (Optional)

### Add Testing Before Deploy
Add this before the build step:

```yaml
- name: Run tests
  run: |
    npm install
    npm test
```

### Deploy to Staging First
```yaml
- name: Deploy to Staging
  uses: azure/webapps-deploy@v2
  with:
    app-name: containertest
    slot-name: staging
    images: ${{ env.DOCKER_IMAGE }}:${{ steps.version.outputs.VERSION }}
```

### Add Slack/Email Notifications
```yaml
- name: Notify on success
  if: success()
  run: echo "Deployment successful!"
  # Add Slack webhook or email action here
```

---

## Summary

**Before CI/CD:**
```bash
docker build -t nestjs-app .
docker tag nestjs-app meetvaghasiya/nestjs-app:v1.0.1
docker push meetvaghasiya/nestjs-app:v1.0.1
# Go to portal, update image tag, save, wait...
```

**After CI/CD:**
```bash
git push origin main
# Done! ✅ Everything happens automatically
```

**Now when you push code, GitHub Actions will:**
1. Build Docker image
2. Push to Docker Hub  
3. Deploy to Azure
4. Your app is updated in 3-5 minutes! 🎉
