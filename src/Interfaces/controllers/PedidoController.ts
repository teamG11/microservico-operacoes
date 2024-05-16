import { BuscarPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/BuscarPedidoFactory";
import { BuscarTodosPedidosNaoFinalizadosUseCaseFactory } from "@/Application/use-cases-factories/pedidos/BuscarTodosPedidosNaoFinalizadosUseCaseFactory";
import { CriaPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/CriaPedidoUseCaseFactory";
import { StatusPedido } from "@/Domain/Enums/StatusPedido";
import { TipoPagamento } from "@/Domain/Enums/TipoPagamento";
import { NextFunction,Request, Response } from "express";
import { z } from "zod";
import { IPedidoRepository } from "../Repositories/IPedidoRepository";
import { AtualizarPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/AtualizarPedidoUseCaseFactory";
import { AdicionarItemPedidoUseCaseFactory } from "@/Application/use-cases-factories/pedidos/AdicionarItemPedidoUseCaseFactory";
import ClienteGateway from "../Gataways/ClienteGateway";
import { ICadastrosMicroserviceApi } from "../ExternalServices/Microservices/ICadastrosMicroserviceApi";
import ProdutoGateway from "../Gataways/ProdutoGateway";
import PedidoGateway from "../Gataways/PedidoGateway";

class PedidoController {
  constructor(private pedidoRepository: IPedidoRepository, private cadastrosMicroserviceApi: ICadastrosMicroserviceApi) { }

  async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const dados = request.body;

      const createBodySchema = z.object({
        cpf: z.string().min(11).max(11),
      });

      const { cpf } = createBodySchema.parse(dados);

      const clienteGateway = new ClienteGateway(this.cadastrosMicroserviceApi);
      const pedidoGateway = new PedidoGateway(this.pedidoRepository);

      const criaPedido = CriaPedidoUseCaseFactory(pedidoGateway, clienteGateway);

      const pedido = await criaPedido.executarAsync(cpf);

      return response.status(201).json(pedido);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
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

      const atualizarPedidoFactory = AtualizarPedidoUseCaseFactory(this.pedidoRepository);
      const pedido = await atualizarPedidoFactory.executarAsync(
        pedidoId,
        valor_final ?? null,
        tipo_pagamento ?? null,
        status ?? null
      );

      return response.status(201).json(pedido);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
    }
  }

  async atualizarStatusPedido(request: Request, response: Response, next: NextFunction) {
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
        status
      );

      return response.status(201).json(pedido);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
    }
  }

  async adicionarItem(request: Request, response: Response, next: NextFunction) {
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

      const adcionaItemFactory = AdicionarItemPedidoUseCaseFactory(this.pedidoRepository, produtoGateway);
      const pedidoAtualizado = await adcionaItemFactory.executarAsync({
        id_pedido,
        id_produto,
        quantidade,
      });

      if (pedidoAtualizado) {
        return response.status(200).json(pedidoAtualizado);
      }
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
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
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
    }
  }

  async buscarStatusPagamento(request: Request, response: Response, next: NextFunction) {
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
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
    }
  }

  async buscarTodosPedidosNaoFinalizados(request: Request, response: Response, next: NextFunction) {
    try {
      const buscarTodosPedidosNaoFinalizados = BuscarTodosPedidosNaoFinalizadosUseCaseFactory(this.pedidoRepository);
      const {pedidos} = await buscarTodosPedidosNaoFinalizados.executarAsync();
      return response.status(200).json({ pedidos: pedidos });

    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(error.message);
      }

      return response.status(500).send();
    }
  }
}

export { PedidoController };
