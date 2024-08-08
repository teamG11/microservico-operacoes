import { BuscarPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/BuscarPedidoFactory";
import { BuscarTodosPedidosNaoFinalizadosUseCaseFactory } from "@/Application/use-cases-factories/pedidos/BuscarTodosPedidosNaoFinalizadosUseCaseFactory";
import { CriaPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/CriaPedidoUseCaseFactory";
import { StatusPedido } from "@/Domain/Enums/StatusPedido";
import { TipoPagamento } from "@/Domain/Enums/TipoPagamento";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IPedidoRepository } from "../Repositories/IPedidoRepository";
import { AtualizarPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/AtualizarPedidoUseCaseFactory";
import { AdicionarItemPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/AdicionarItemPedidoUseCaseFactory";
import { ICadastrosMicroserviceApi } from "../ExternalServices/Microservices/ICadastrosMicroserviceApi";
import PedidoGateway from "../Gataways/PedidoGateway";
import ClienteGateway from "../Gataways/ClienteGateway";
import ProdutoGateway from "../Gataways/ProdutoGateway";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { sendPagamentoMessage } from "@/Infrastructure/service/queue/PagamentoQueue";

class PedidoController {
  constructor(
    private pedidoRepository: IPedidoRepository,
    private cadastrosMicroserviceApi: ICadastrosMicroserviceApi
  ) {}

  async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const dados = request.body;

      const createBodySchema = z.object({
        cpf: z.string().min(11).max(11),
      });

      const { cpf } = createBodySchema.parse(dados);

      const clienteGateway = new ClienteGateway(this.cadastrosMicroserviceApi);
      const pedidoGateway = new PedidoGateway(this.pedidoRepository);

      const criaPedido = CriaPedidoUseCaseFactory(
        pedidoGateway,
        clienteGateway
      );
      const pedido = await criaPedido.executarAsync(cpf);

      return response.status(201).send(pedido);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        pedidoId: z.string().transform((value) => Number(value)),
      });
      const { pedidoId } = paramsSchema.parse(request.params);

      const dados = request.body;
      const createBodySchema = z.object({
        valor_final: z.number().optional(),
        tipo_pagamento: z.nativeEnum(TipoPagamento).optional(),
        status: z.nativeEnum(StatusPedido).optional(),
      });

      const { valor_final, tipo_pagamento, status } =
        createBodySchema.parse(dados);

      const atualizarPedidoFactory = AtualizarPedidoUseCaseFactory(
        this.pedidoRepository
      );

      const pedido = await atualizarPedidoFactory.executarAsync(
        pedidoId,
        valor_final ?? null,
        tipo_pagamento ?? null,
        status ?? null,
        null
      );

      return response.status(201).send(pedido);
    } catch (error) {
      next(error);
    }
  }

  async atualizarStatusPedido(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const paramsSchema = z.object({
        pedidoId: z.string().transform((value) => Number(value)),
      });
      const { pedidoId } = paramsSchema.parse(request.params);

      const dados = request.body;

      const updateStatusSchema = z.object({
        status: z.nativeEnum(StatusPedido),
      });

      const { status } = updateStatusSchema.parse(dados);

      const atualizarPedidoFactory = AtualizarPedidoUseCaseFactory(
        this.pedidoRepository
      );
      const pedido = await atualizarPedidoFactory.executarAsync(
        pedidoId,
        null,
        null,
        status,
        null
      );

      return response.status(201).send(pedido);
    } catch (error) {
      next(error);
    }
  }

  async adicionarItem(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const dados = request.body;

      const createBodySchema = z.object({
        id_pedido: z.number(),
        id_produto: z.number(),
        quantidade: z.number(),
      });

      const { id_pedido, id_produto, quantidade } =
        createBodySchema.parse(dados);

      const produtoGateway = new ProdutoGateway(this.cadastrosMicroserviceApi);

      const adcionaItemFactory = AdicionarItemPedidoUseCaseFactory(
        this.pedidoRepository,
        produtoGateway
      );

      const pedidoAtualizado = await adcionaItemFactory.executarAsync({
        id_pedido,
        id_produto,
        quantidade,
      });

      if (pedidoAtualizado) {
        return response.status(200).send(pedidoAtualizado);
      }
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        pedidoId: z.string().transform((value) => Number(value)),
      });
      const { pedidoId } = paramsSchema.parse(request.params);

      const buscarPedido = BuscarPedidoUseCaseFactory(this.pedidoRepository);

      const pedido = await buscarPedido.executarAsync(pedidoId);

      if (pedido) {
        return response.status(200).json(pedido);
      } else {
        return response.status(404).send("Pedido não encontrado.");
      }
    } catch (error) {
      next(error);
    }
  }

  async buscarStatusPagamento(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const paramsSchema = z.object({
        pedidoId: z.string().transform((value) => Number(value)),
      });
      const { pedidoId } = paramsSchema.parse(request.params);

      const buscarPedido = BuscarPedidoUseCaseFactory(this.pedidoRepository);

      const pedido = await buscarPedido.executarAsync(pedidoId);

      if (pedido) {
        return response.status(200).json(pedido.status_pagamento);
      } else {
        return response.status(404).send("Pedido não encontrado.");
      }
    } catch (error) {
      next(error);
    }
  }

  async buscarTodosPedidosNaoFinalizados(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const buscarTodosPedidosNaoFinalizados =
        BuscarTodosPedidosNaoFinalizadosUseCaseFactory(this.pedidoRepository);
      const { pedidos } =
        await buscarTodosPedidosNaoFinalizados.executarAsync();
      return response.status(200).json({ pedidos: pedidos });
    } catch (error) {
      next(error);
    }
  }

  async atualizarStatusPedidoQueue(
    idReq: string,
    statusReq: string,
    statusPagamentoReq: string
  ) {
    const id: number = Number(idReq);
    if (isNaN(id)) {
      throw new Error("ID invalido");
    }

    const status: StatusPedido = statusReq as StatusPedido;
    if (!Object.values(StatusPedido).includes(status)) {
      throw new Error("Status invalido");
    }

    const statusPagamento: StatusPagamento =
      statusPagamentoReq as StatusPagamento;
    if (!Object.values(StatusPagamento).includes(statusPagamento)) {
      throw new Error("Status Pagamento invalido");
    }

    const atualizarPedidoFactory = AtualizarPedidoUseCaseFactory(
      this.pedidoRepository
    );

    const pedido = await atualizarPedidoFactory.executarAsync(
      id,
      null,
      null,
      status,
      statusPagamento
    );

    if (statusPagamento == "aguardando") {
      const valor: number = pedido.valor_final as number;
      await sendPagamentoMessage(id, pedido.id_cliente, valor);
    }

    return;
  }
}

export { PedidoController };
