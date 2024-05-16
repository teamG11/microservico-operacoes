import { Cliente } from "@/Domain/Entities/Cliente";
import { ICadastrosMicroserviceApi } from "../ExternalServices/Microservices/ICadastrosMicroserviceApi";

export interface IClienteGateway {
    findByCPFAsync(cpf: string): Promise<Cliente | null>;
}

export default class ClienteGateway implements IClienteGateway {
    constructor(private cadastrosMicroserviceApi: ICadastrosMicroserviceApi) { }

    async findByCPFAsync(cpf: string): Promise<Cliente | null> {
        return this.cadastrosMicroserviceApi.findClienteAsync(cpf);
    }
}
