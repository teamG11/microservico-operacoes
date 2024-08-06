import CadastrosMicroserviceApi from "@/Infrastructure/drivers/ExternalServices/Microservices/CadastrosMicroserviceApi";
import PedidoRepository from "@/Infrastructure/drivers/Repositories/PedidoRepository";
import { PedidoController } from "@/Interfaces/controllers/PedidoController";
import AWS from "aws-sdk";

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  endpoint: "http://localstack:4566",
});

const queueUrl = process.env.PEDIDO_QUEUE_URL as string;

interface Message {
  id: string;
  status: string;
  statusPagamento: string;
}

const pedidoController = new PedidoController(
  new PedidoRepository(),
  new CadastrosMicroserviceApi()
);

const processMessages = async () => {
  try {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log("Received message:", message.Body);

        // Parse the message body
        let parsedMessage: Message;
        try {
          parsedMessage = JSON.parse(message.Body!);
          console.log("Parsed message:", parsedMessage);

          // Access id and status
          const { id, status, statusPagamento } = parsedMessage;
          console.log(
            `ID: ${id}, Status: ${status}, StatusPagamento: ${statusPagamento}`
          );

          await pedidoController.atualizarStatusPedidoQueue(
            id,
            status,
            statusPagamento
          );

          // Delete the message after processing
          await sqs
            .deleteMessage({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();

          console.log("Message processed and deleted");
        } catch (error) {
          console.error("Error parsing message:", error);
          await sqs
            .deleteMessage({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
        }
      }
    }
  } catch (error) {
    console.error("Error processing messages:", error);
  }
};

const startPolling = () => {
  setInterval(() => {
    void processMessages();
  }, 5000);
};

export { startPolling };
