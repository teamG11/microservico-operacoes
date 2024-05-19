import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { Pedido } from "@/Domain/Entities/Pedido";
import { AtualizarStatusPedidoUseCase } from "@/Application/use-cases/pedidos/AtualizarStatusPedidoUseCase";

let useCase: AtualizarStatusPedidoUseCase;
let pedidoGateway: PedidoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    pedidoGateway = new PedidoGateway(pedidoRepository);
    useCase = new AtualizarStatusPedidoUseCase(pedidoGateway);
  });

  it("Deve permitir atualizar status do pedido", async () => {
    const pedido: Pedido = {
        id: 1,
        id_cliente: 1,
        valor_final: 1,
        tipo_pagamento: "",
        status: "",
        status_pagamento: "",
    };
    await pedidoGateway.createAsync(pedido);

    const pedidoRetornado = await useCase.executarAsync(
        1, "Em preparacao"
    )
    ;

    expect(pedidoRetornado).toBeDefined;
  });

  it("Não deve permitir atualizar status do pedido para pedido nao existente", async () => {
    await expect(useCase.executarAsync(2, "Novo Status")).rejects.toThrow(
      "Pedido com ID 2 não encontrado."
    );
  });
});
