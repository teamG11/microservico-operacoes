import { Pedido } from "@/Domain/Entities/Pedido";
import { PedidoItens } from "@/Domain/Entities/PedidoItens";
import { IPedidoRepository } from "@/Interfaces/Repositories/IPedidoRepository";

export class PedidoTestRepository implements IPedidoRepository {
  public pedidos: Pedido[] = [];
  public pedidosItens: PedidoItens[] = [];

  public novoPedido = new Pedido({
    id_cliente: 123,
    valor_final: 500.0,
    tipo_pagamento: "pix",
    status: "recebido",
    status_pagamento: "aguardando",
  });

  public item = new PedidoItens({
    id_pedido: 1,
    id_produto: 101,
    quantidade: 3,
  });

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
    this.novoPedido.id = 1;
    this.pedidos.push(this.novoPedido);

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
    this.novoPedido.id = 1;
    this.pedidos.push(this.novoPedido);
    const pedidos = this.pedidos.filter((pedido) => pedido.id === pedidoId);
    const pedido = pedidos[0];
    if (pedido) {
      pedido.status = novoStatus;
    }
    return pedido;
  }

  async findByIdAsync(id: number) {
    this.novoPedido.id = 1;
    this.pedidos.push(this.novoPedido);
    const pedido = this.pedidos.find((pedido) => pedido.id === id);
    return pedido ?? null;
  }

  async findAllNaoFinalizadosAsync() {
    this.novoPedido.id = 1;
    this.pedidos.push(this.novoPedido);
    return this.pedidos.filter((pedido) => pedido.status != "Finalizado");
  }
}
