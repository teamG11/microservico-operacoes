import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { AtualizarPedidoUseCase } from "@/Application/use-cases/pedidos/AtualizarPedidoUseCase";
import { Pedido } from "@/Domain/Entities/Pedido";

let useCase: AtualizarPedidoUseCase;
let pedidoGateway: PedidoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    pedidoGateway = new PedidoGateway(pedidoRepository);
    useCase = new AtualizarPedidoUseCase(pedidoGateway);
  });

  it("Deve permitir atualizar pedido", async () => {
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
      1,
      2,
      "pix",
      "Em preparacao"
    );
    expect(pedidoRetornado).toBeDefined;
  });

  it("Não deve permitir atualizar pedido para pedido nao existente", async () => {
    await expect(useCase.executarAsync(2, null, null, null)).rejects.toThrow(
      "Pedido com ID 2 não encontrado."
    );
  });
});
