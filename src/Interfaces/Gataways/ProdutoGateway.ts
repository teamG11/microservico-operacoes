import { Produto } from '../../Domain/Entities/Produto';
import { ICadastrosMicroserviceApi } from '../ExternalServices/Microservices/ICadastrosMicroserviceApi';

export interface IProdutoGateway {
    findByIdAsync(id: number): Promise<Produto | null>;
}

export default class ProdutoGateway implements IProdutoGateway{
    constructor(private cadastrosMicroserviceApi: ICadastrosMicroserviceApi) { }

    findByIdAsync(id: number): Promise<any> {
        return this.cadastrosMicroserviceApi.findProdutoAsync(id);
    }
    
}