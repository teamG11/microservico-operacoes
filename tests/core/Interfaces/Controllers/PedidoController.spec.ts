import { CadastrosMicroserviceApiTest } from "@/Infrastructure/drivers/ExternalServices/Microservices/TestExternalServices/CadastrosMicroserviceApiTest";
import { PedidoTestRepository } from "@/Interfaces/ExternalServices/Microservices/TestsRepositories/PedidoTestRepository";
import { PedidoController } from "@/Interfaces/controllers/PedidoController";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ClienteController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  // eslint-disable-next-line
  let mockNext: any;
  let pedidoRepository: PedidoTestRepository;
  let cadastrosMicroserviceApi: CadastrosMicroserviceApiTest;
  let pedidoController: PedidoController;

  beforeEach(() => {
    pedidoRepository = new PedidoTestRepository();
    cadastrosMicroserviceApi = new CadastrosMicroserviceApiTest();
    pedidoController = new PedidoController(
      pedidoRepository,
      cadastrosMicroserviceApi
    );
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  it("deve criar um pedido corretamente", async () => {
    const mockRequest: Partial<Request> = {
      body: { cpf: "12345678911" },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await pedidoController.criar(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id_cliente: 1,
        status_pagamento: "aguardando",
      })
    );
  });

  it("Deve retornar erro ao criar um pedido", async () => {
    const mockRequest: Partial<Request> = {
      body: { cpf: "12345678901" },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const expectedError = new Error("Cliente não encontrado");
    await pedidoController.criar(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expectedError);
  });

  it("deve atualizar um pedido corretamente", async () => {
    const mockRequest: Partial<Request> = {
      params: { pedidoId: "1" },
      body: { valor_final: 100, tipo_pagamento: "pix", status: "recebido" },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await pedidoController.atualizar(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id_cliente: 123,
        status_pagamento: "aguardando",
        tipo_pagamento: "pix",
        id: 1,
      })
    );
  });

  it("deve atualizar o status do pedido corretamente", async () => {
    const mockRequest: Partial<Request> = {
      params: { pedidoId: "1" },
      body: { status: "pronto" },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await pedidoController.atualizarStatusPedido(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id_cliente: 123,
        status_pagamento: "aguardando",
        tipo_pagamento: "pix",
        id: 1,
      })
    );
  });

  it("Deve retornar erro ao atualizar um pedido", async () => {
    const mockRequest: Partial<Request> = {
      params: { pedidoId: "2" },
      body: { status: "pronto" },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await pedidoController.atualizarStatusPedido(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    const expectedError = new Error("Pedido com ID 2 não encontrado.");
    expect(mockNext).toHaveBeenCalledWith(expectedError);
  });

  it("deve adicionar um item ao pedido corretamente", async () => {
    const mockRequest: Partial<Request> = {
      body: { id_pedido: 1, id_produto: 1, quantidade: 3 },
    };

    const mockResponse: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await pedidoController.adicionarItem(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id_cliente: 123,
        status_pagamento: "aguardando",
        tipo_pagamento: "pix",
        id: 1,
      })
    );
  });

  it("deve buscar um pedido por ID corretamente", async () => {
    mockRequest = {
      params: { pedidoId: "1" },
    };

    await pedidoController.buscarPorId(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("deve buscar o status de pagamento de um pedido", async () => {
    mockRequest = {
      params: { pedidoId: "1" },
    };

    await pedidoController.buscarStatusPagamento(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("deve buscar todos os pedidos não finalizados", async () => {
    await pedidoController.buscarTodosPedidosNaoFinalizados(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });
});
