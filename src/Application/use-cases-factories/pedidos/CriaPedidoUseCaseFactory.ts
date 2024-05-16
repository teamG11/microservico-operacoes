import { IPedidoGateway } from "@/Interfaces/Gataways/PedidoGateway";
import { CriaPedidoUseCase } from "../../use-cases/pedidos/CriaPedidoUseCase";
import { IClienteGateway } from "@/Interfaces/Gataways/ClienteGateway";

export function CriaPedidoUseCaseFactory(pedidoGateway: IPedidoGateway, clienteGateway: IClienteGateway) {
	const criaPedido = new CriaPedidoUseCase(pedidoGateway, clienteGateway);

  return criaPedido;
}
