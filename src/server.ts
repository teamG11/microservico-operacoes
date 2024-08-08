import app from "./app";
import { env } from "./Infrastructure/env";
import { startPolling } from "./Infrastructure/service/queue/PedidoQueue";

app.listen(env.PORT, () => {
  console.log(`💻 Listening on port ${env.PORT}`);
  startPolling();
});
