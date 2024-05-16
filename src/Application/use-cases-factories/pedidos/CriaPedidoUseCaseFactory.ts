import { IPedidoGateway } from "@/Interfaces/Gataways/PedidoGateway";
import { CriaPedidoUseCase } from "../../use-cases/pedidos/CriaPedidoUseCase";
import { IClienteGateway } from "@/Interfaces/Gataways/ClienteGateway";

<<<<<<< HEAD
export function CriaPedidoUseCaseFactory(pedidoGateway: IPedidoGateway, clienteGateway: IClienteGateway) {
	const criaPedido = new CriaPedidoUseCase(pedidoGateway, clienteGateway);
=======
export function CriaPedidoUseCaseFactory(pedidoGateway: IPedidoGateway) {
  const criaPedido = new CriaPedidoUseCase(pedidoGateway);
>>>>>>> 8cd1c57b4e84a24e88f4faa7620f3fb5ca521910

  return criaPedido;
}
