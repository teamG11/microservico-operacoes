<<<<<<< HEAD
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
=======
import { Produto } from "../../Domain/Entities/Produto";
import { IProdutoRepository } from "../Repositories/IProdutoRepository";

export interface IProdutoGateway {
  saveAsync(Produto: Produto): Promise<Produto>;
  updateAsync(Produto: Produto): Promise<Produto>;
  removeAsync(id: number): Promise<void>;
  findByIdAsync(id: number): Promise<Produto | null>;
  findAllAsync(): Promise<Produto[]>;
  findByNomeAsync(nome: string): Promise<Produto | null>;
  findByCategoriaAsync(categoria: string): Promise<Produto[]>;
}

export default class ProdutoGateway implements IProdutoGateway {
  constructor(private produtoRepository: IProdutoRepository) {}

  saveAsync(Produto: Produto): Promise<Produto> {
    return this.produtoRepository.saveAsync(Produto);
  }
  updateAsync(Produto: Produto): Promise<Produto> {
    return this.produtoRepository.updateAsync(Produto);
  }
  removeAsync(id: number): Promise<void> {
    return this.produtoRepository.removeAsync(id);
  }
  findByIdAsync(id: number): Promise<Produto | null> {
    return this.produtoRepository.findByIdAsync(id);
  }
  findAllAsync(): Promise<Produto[]> {
    return this.produtoRepository.findAllAsync();
  }
  findByNomeAsync(nome: string): Promise<Produto | null> {
    return this.produtoRepository.findByNomeAsync(nome);
  }
  findByCategoriaAsync(categoria: string): Promise<Produto[]> {
    return this.produtoRepository.findByCategoriaAsync(categoria);
  }
}
>>>>>>> 8cd1c57b4e84a24e88f4faa7620f3fb5ca521910
