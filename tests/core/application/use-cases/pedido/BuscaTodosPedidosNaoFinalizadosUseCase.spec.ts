import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { Pedido } from "@/Domain/Entities/Pedido";
import { BuscaTodosPedidosNaoFinalizadosUseCase } from "@/Application/use-cases/pedidos/BuscaTodosPedidosNaoFinalizadosUseCase";

let useCase: BuscaTodosPedidosNaoFinalizadosUseCase;
let pedidoGateway: PedidoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    pedidoGateway = new PedidoGateway(pedidoRepository);
    useCase = new BuscaTodosPedidosNaoFinalizadosUseCase(pedidoGateway);
  });

  it("Deve permitir buscar pedidos nao finalizados", async () => {
    const pedido: Pedido = {
      id: 1,
      id_cliente: 1,
      valor_final: 1,
      tipo_pagamento: "",
      status: "",
      status_pagamento: "",
    };
    await pedidoGateway.createAsync(pedido);
    const { pedidos } = await useCase.executarAsync();
    expect(pedidos).toBeDefined;
  });
});
