import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { Pedido } from "@/Domain/Entities/Pedido";
import { AdicionaItemPedidoUseCase } from "@/Application/use-cases/pedidos/AdicionaItemPedidoUseCase";
import ProdutoGateway from "@/Interfaces/Gataways/ProdutoGateway";
import { CadastrosMicroserviceApiTest } from "@/Infrastructure/drivers/ExternalServices/Microservices/TestExternalServices/CadastrosMicroserviceApiTest";

let useCase: AdicionaItemPedidoUseCase;
let pedidoGateway: PedidoGateway;
let produtoGateway: ProdutoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    pedidoGateway = new PedidoGateway(pedidoRepository);
    const cadastrosExternalService = new CadastrosMicroserviceApiTest();
    produtoGateway = new ProdutoGateway(cadastrosExternalService);
    useCase = new AdicionaItemPedidoUseCase(pedidoGateway, produtoGateway);
  });

  it("Deve permitir adicionar item ao pedido", async () => {
    const pedido: Pedido = {
      id: 1,
      id_cliente: 1,
      valor_final: 1,
      tipo_pagamento: "",
      status: "",
      status_pagamento: "",
    };
    await pedidoGateway.createAsync(pedido);

    const id_pedido = 1;
    const id_produto = 1;
    const quantidade = 1;

    const pedidoRetornado = await useCase.executarAsync({
      id_pedido,
      id_produto,
      quantidade,
    });
    expect(pedidoRetornado).toBeDefined;
  });

  it("Não deve permitir adicionar item ao pedido para pedido nao existente", async () => {
    const pedido: Pedido = {
      id: 1,
      id_cliente: 1,
      valor_final: 1,
      tipo_pagamento: "",
      status: "",
      status_pagamento: "",
    };
    await pedidoGateway.createAsync(pedido);
    const id_pedido = 2;
    const id_produto = 1;
    const quantidade = 1;
    await expect(
      useCase.executarAsync({ id_pedido, id_produto, quantidade })
    ).rejects.toThrow("Pedido não encontrado");
  });
  it("Não deve permitir adicionar item ao pedido para produto nao existente", async () => {
    const id_pedido = 1;
    const id_produto = 2;
    const quantidade = 1;
    await expect(
      useCase.executarAsync({ id_pedido, id_produto, quantidade })
    ).rejects.toThrow("Produto não encontrado");
  });
});
