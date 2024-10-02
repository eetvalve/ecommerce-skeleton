# Check if projectId is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <PROJECT_NAME> <REPOSITORY_NAME>"
  exit 1
fi

PROJECT_NAME=$1
REPOSITORY_NAME=$2
REGION=${3:-europe-north1} # Finland


echo "deleting gcloud cloud run service"
gcloud run services delete ${PROJECT_NAME} --region ${REGION}
wait

echo "deleting gcloud artifacts repositories"
gcloud artifacts repositories delete ${REPOSITORY_NAME} --location ${REGION}
wait

echo "all done"