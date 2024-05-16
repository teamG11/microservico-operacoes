
import express from "express";
import cors from "cors";

import { pedidoRouter } from "./Infrastructure/api/routes/PedidoRouter";

import { errorMiddleware } from "./Infrastructure/api/middlewares/error";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pedido", pedidoRouter);

app.use(errorMiddleware);

export default app;
