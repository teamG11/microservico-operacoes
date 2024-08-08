#!/usr/bin/env bash

set -euo pipefail

# enable debug
# set -x

echo "configuring sqs"
echo "==================="
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1

create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=30
}

create_queue "pedido-queue"
create_queue "pagamento-queue"


# como utilizar o localstack com o sqs
#
# docker ps e copiar o id do container rodando o localstack
# docker exec -it CONTAINER_ID sh
# 
# aws configure set aws_access_key_id test
# aws configure set aws_secret_access_key test
# aws configure set default.region us-east-1

# enviar mensagem
# aws --endpoint-url=http://localstack:4566 sqs send-message --queue-url http://localstack:4566/000000000000/pedido-queue --message-body '{"id": "2", "status": "em preparacao", "statusPagamento": "aguardando"}'
#
# ler mensagem
# aws sqs receive-message --queue-url http://localhost:4566/000000000000/pagamento-queue --endpoint-url http://localhost:4566