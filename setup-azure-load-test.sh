#!/bin/bash

# Azure Load Testing Setup Script for NestJS Application
# This script creates an Azure Load Testing resource and runs a load test

# Configuration
RESOURCE_GROUP="nestjs-loadtest-rg"
LOCATION="eastus"
LOAD_TEST_NAME="nestjs-loadtest"
TEST_NAME="home-page-test"
SUBSCRIPTION_ID="0cfe2870-d256-4119-b0a3-16293ac11bdc"

echo "Setting up Azure Load Testing for NestJS application..."

# Set subscription
az account set --subscription $SUBSCRIPTION_ID

# Create resource group
echo "Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Load Testing resource
echo "Creating Load Testing resource: $LOAD_TEST_NAME"
az load create \
  --name $LOAD_TEST_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Create and run the load test
echo "Creating and running load test: $TEST_NAME"
az load test create \
  --name $TEST_NAME \
  --resource-group $RESOURCE_GROUP \
  --load-test-resource $LOAD_TEST_NAME \
  --test-plan load-test.jmx \
  --engine-instances 1 \
  --description "Load test for NestJS home page and health endpoints"

echo "Load test created successfully!"
echo "You can monitor the test in the Azure portal or using:"
echo "az load test show --name $TEST_NAME --resource-group $RESOURCE_GROUP --load-test-resource $LOAD_TEST_NAME"