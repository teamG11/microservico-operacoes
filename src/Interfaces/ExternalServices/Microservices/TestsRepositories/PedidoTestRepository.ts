import { Pedido } from "@/Domain/Entities/Pedido";
import { PedidoItens } from "@/Domain/Entities/PedidoItens";
import { IPedidoRepository } from "@/Interfaces/Repositories/IPedidoRepository";

export class PedidoTestRepository implements IPedidoRepository {
  public pedidos: Pedido[] = [];
  public pedidosItens: PedidoItens[] = [];

  async createAsync(data: Pedido) {
    const pedido: Pedido = {
      id: data.id,
      id_cliente: data.id_cliente,
      valor_final: data.valor_final,
      tipo_pagamento: data.tipo_pagamento,
      status: data.status,
      status_pagamento: data.status_pagamento,
    };

    this.pedidos.push(pedido);
    return pedido;
  }

  async updateAsync(data: Pedido) {
    const pedido = this.pedidos.find((pedido) => pedido.id === data.id);

    if (pedido) {
      pedido.id_cliente = data.id_cliente;
      pedido.valor_final = data.valor_final;
      pedido.tipo_pagamento = data.tipo_pagamento;
      pedido.status = data.status;
      pedido.status_pagamento = data.status_pagamento;
    }
    return data;
  }

  async updateStatusAsync(pedidoId: number, novoStatus: string) {
    const pedidos = this.pedidos.filter((pedido) => pedido.id === pedidoId);
    const pedido = pedidos[0];
    if (pedido) {
      pedido.status = novoStatus;
    }
    return pedido;
  }

  async findByIdAsync(id: number) {
    const pedido = this.pedidos.find((pedido) => pedido.id === id);
    return pedido ?? null;
  }

  async findAllNaoFinalizadosAsync() {
    return this.pedidos.filter((pedido) => pedido.status != "Finalizado");
  }
}
