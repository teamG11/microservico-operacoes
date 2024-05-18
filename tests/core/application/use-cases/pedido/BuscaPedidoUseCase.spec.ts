import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { BuscaPedidoUseCase } from "@/Application/use-cases/pedidos/BuscaPedidoUseCase";
import { Pedido } from "@/Domain/Entities/Pedido";

let useCase: BuscaPedidoUseCase;
let pedidoGateway: PedidoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    pedidoGateway = new PedidoGateway(pedidoRepository);
    useCase = new BuscaPedidoUseCase(pedidoGateway);
  });

  it("Deve permitir buscar pedido", async () => {
    const pedido: Pedido = {
      id: 1,
      id_cliente: 1,
      valor_final: 1,
      tipo_pagamento: "",
      status: "",
      status_pagamento: "",
    };
    await pedidoGateway.createAsync(pedido);
    const pedidoRetornado = await useCase.executarAsync(1);
    expect(pedidoRetornado).toBeDefined;
  });

  it("Deve retornar erro ao buscar pedido nao cadastrado", async () => {
    await expect(useCase.executarAsync(1)).rejects.toThrow(
      "Pedido não encontrado"
    );
  });
});
