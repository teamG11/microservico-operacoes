import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(7000),
  DATABASE_URL: z.string().default("conexaoBanco"),
  MICROSERVICO_CADASTROS_URL: z.string().default("urlMicroservicoCadastros/"),
  AWS_ACCESS_KEY_ID: z.string().default("test"),
  AWS_SECRET_ACCESS_KEY: z.string().default("test"),
  AWS_REGION: z.string().default("us-east-1"),
  PEDIDO_QUEUE_URL: z
    .string()
    .default("http://localstack:4566/000000000000/pedido-queue"),
  PAGAMENTO_QUEUE_URL: z
    .string()
    .default("http://localstack:4566/000000000000/pagamento-queue"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Variáveis de ambiente inválidas", _env.error.format());

  throw new Error("Variáveis de ambiente inválidas");
}

export const env = _env.data;
