import { PedidoTestRepository } from "@/Infrastructure/drivers/Repositories/TestsRepositories/PedidoTestRepository";
import { CriaPedidoUseCase } from "@/Application/use-cases/pedidos/CriaPedidoUseCase";
import { beforeEach, describe, expect, it } from "vitest";
import PedidoGateway from "@/Interfaces/Gataways/PedidoGateway";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { CadastrosMicroserviceApiTest } from "@/Infrastructure/drivers/ExternalServices/Microservices/TestExternalServices/CadastrosMicroserviceApiTest";
import ClienteGateway from "@/Interfaces/Gataways/ClienteGateway";

let useCase: CriaPedidoUseCase;
let pedidoGateway: PedidoGateway;

describe("CriaPedido use case", () => {
  beforeEach(() => {
    const pedidoRepository = new PedidoTestRepository();
    const cadastrosExternalService = new CadastrosMicroserviceApiTest();
    const clienteGateway = new ClienteGateway(cadastrosExternalService);
    pedidoGateway = new PedidoGateway(pedidoRepository);
    useCase = new CriaPedidoUseCase(pedidoGateway, clienteGateway);
  });

  it("Deve permitir cadastrar pedido", async () => {
    const pedido = {
      nome: "John",
      cpf: "12345678911",
    };

    const { id_cliente, status_pagamento } = await useCase.executarAsync(
      pedido.cpf
    );

    expect(id_cliente).toBeDefined;
    expect(status_pagamento).toBe(StatusPagamento.aguardando);
  });

  it("Não deve permitir cadastrar pedido para cliente nao existente", async () => {
    const pedido = {
      nome: "John",
      cpf: "111111111111",
    };

    await expect(useCase.executarAsync(pedido.cpf)).rejects.toThrow(
      "Cliente não encontrado"
    );
  });
});
