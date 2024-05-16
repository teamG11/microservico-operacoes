import { Cliente } from "@/Domain/Entities/Cliente";
import { ICadastrosMicroserviceApi } from "../ExternalServices/Microservices/ICadastrosMicroserviceApi";

export interface IClienteGateway {
<<<<<<< HEAD
    findByCPFAsync(cpf: string): Promise<Cliente | null>;
=======
  saveAsync(cliente: Cliente): Promise<Cliente>;
  findByCPFAsync(cpf: string): Promise<Cliente | null>;
>>>>>>> 8cd1c57b4e84a24e88f4faa7620f3fb5ca521910
}

export default class ClienteGateway implements IClienteGateway {
  constructor(private clienteRepository: IClienteRepository) {}

<<<<<<< HEAD
    constructor(private cadastrosMicroserviceApi: ICadastrosMicroserviceApi) { }

    async findByCPFAsync(cpf: string): Promise<Cliente | null> {
        return this.cadastrosMicroserviceApi.findClienteAsync(cpf);
    }
=======
  async saveAsync(data: Cliente): Promise<Cliente> {
    return this.clienteRepository.saveAsync(data);
  }

  async findByCPFAsync(cpf: string): Promise<Cliente | null> {
    return this.clienteRepository.findByCPFAsync(cpf);
  }
>>>>>>> 8cd1c57b4e84a24e88f4faa7620f3fb5ca521910
}
