import AWS from "aws-sdk";

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  endpoint: "http://localstack:4566",
});

const queueUrl = process.env.PAGAMENTO_QUEUE_URL as string;

interface PagamentoMessage {
  id_pedido: number;
  id_cliente: number;
  valor_final: number;
}

const sendPagamentoMessage = async (
  id_pedido: number,
  id_cliente: number,
  valor_final: number
) => {
  const pagamentoMessage: PagamentoMessage = {
    id_pedido: id_pedido,
    id_cliente: id_cliente,
    valor_final: valor_final,
  };

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(pagamentoMessage),
  };

  try {
    // eslint-disable-next-line
        const data = await sqs.sendMessage(params).promise();
    console.log("Order message sent successfully:", data.MessageId);
  } catch (error) {
    console.error("Error sending order message:", error);
  }
};

export { sendPagamentoMessage };
