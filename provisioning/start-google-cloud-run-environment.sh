#!/bin/bash

# Quickstart:
# This builds docker image manually, push it to gc Artifact registry and uses it to deploy app.

# prerequisites:
# - docker,
# - gcloud CLI

# How to run:
# 1. Manually login to google cloud: $ gcloud auth login
# 2. If some of the gcloud steps fails, its probably, because missing IAM permissions.
# As for permissions from project admin.
# 3. run: $ ./setup-google-cloud-run-environment.sh <PROJECT_ID> <PROJECT_NAME> <REPOSITORY_NAME>

# Check if projectId is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <PROJECT_ID> <PROJECT_NAME> <REPOSITORY_NAME>"
  exit 1
fi

# Assign parameters
PROJECT_ID=$1
PROJECT_NAME=$2
REPOSITORY_NAME=$3
REGION=${4:-europe-north1} # Finland

# Build the Docker image from the SvelteKit app
echo "Building Docker image..."
docker build --platform linux/amd64 -t ${PROJECT_NAME} .
wait

# Run the Docker container locally (optional, for local testing)
# echo "Running Docker container locally on port 3000..."
# docker run -p 3000:3000 ${PROJECT_NAME}
# wait

echo "Selecting google cloud project..."
gcloud config set project ${PROJECT_ID}
wait

echo "Create gcloud artifact repo"
gcloud artifacts repositories create ${REPOSITORY_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --description="My Docker repository in Europe North"
wait

echo "Set gcloud artifact registry to point in eu-north1"
gcloud auth configure-docker ${REGION}-docker.pkg.dev
wait

# Tag the Docker image for Google Container Registry
echo "Tagging Docker image for Google Container Registry..."
docker tag ${PROJECT_NAME} ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${PROJECT_NAME}
wait

# Push the Docker image to Google Container Registry
echo "Pushing Docker image to Google Container Registry..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${PROJECT_NAME}
wait

# Enable the Cloud Run service if it's not already enabled
echo "Enabling Cloud Run API..."
gcloud services enable run.googleapis.com
wait

# Deploy the app to Google Cloud Run
echo "Deploying the app to Google Cloud Run..."
gcloud run deploy ${PROJECT_NAME} \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${PROJECT_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --max-instances 5 \
# --set-env-vars "$(cat .env.prod | tr '\n' ',' | sed 's/,$//')" # This will add key=val pairs automatically from env.prod -file

echo "Deployment complete."
