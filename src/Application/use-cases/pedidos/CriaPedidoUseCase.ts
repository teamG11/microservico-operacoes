import { Pedido } from "@/Domain/Entities/Pedido";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { IClienteGateway } from "@/Interfaces/Gataways/ClienteGateway";
import { IPedidoGateway } from "@/Interfaces/Gataways/PedidoGateway";

export class CriaPedidoUseCase {
  constructor(private pedidoGateway: IPedidoGateway, private clienteGateway: IClienteGateway) {}

  async executarAsync(cpf: string): Promise<Pedido> {
    
    const cliente = await this.clienteGateway.findByCPFAsync(cpf);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const pedido = new Pedido({
      id_cliente: cliente.id,
      valor_final: null,
      tipo_pagamento: null,
      status: null,
      status_pagamento: StatusPagamento.aguardando,
    });

    const pedidoSalvo = await this.pedidoGateway.createAsync(pedido);
    return pedidoSalvo;
  }
}
