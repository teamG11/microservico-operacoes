import { Pedido } from "../../Domain/Entities/Pedido";

export interface IPedidoRepository {
  createAsync(pedido: Pedido): Promise<Pedido>;
  updateAsync(pedido: Pedido): Promise<Pedido>;
  updateStatusAsync(pedidoId: number, novoStatus: string): Promise<Pedido>;
  findByIdAsync(pedidoId: number): Promise<Pedido | null>;
  findAllNaoFinalizadosAsync(): Promise<Pedido[]>;
}
