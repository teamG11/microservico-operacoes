import { Cliente } from "@/Domain/Entities/Cliente";
import { Produto } from "@/Domain/Entities/Produto";
import { ICadastrosMicroserviceApi } from "@/Interfaces/ExternalServices/Microservices/ICadastrosMicroserviceApi";

export class CadastrosMicroserviceApiTest implements ICadastrosMicroserviceApi {
  public produtos: Produto[] = [];
  public produto: Produto = {
    id: 1,
    nome: "produto",
    categoria: "categoria",
    descricao: "descricao",
    valor: 1,
    disponivel: true,
  };
  public clientes: Cliente[] = [];
  public cliente: Cliente = {
    id: 1,
    nome: "cliente 1",
    sobrenome: "sobrenome 2",
    cpf: "12345678911",
  };

  async findProdutoAsync(id: number): Promise<Produto | null> {
    this.produtos.push(this.produto);
    const produto = this.produtos.find((produto) => produto.id === id);
    if (produto) {
      return produto;
    } else {
      return null;
    }
  }

  async findClienteAsync(cpf: string): Promise<Cliente | null> {
    this.clientes.push(this.cliente);
    const client = this.clientes.find((cliente) => cliente.cpf === cpf);
    if (client) {
      return client;
    } else {
      return null;
    }
  }
}
