import { Cliente } from "@/Domain/Entities/Cliente";
import { Produto } from "@/Domain/Entities/Produto";

export interface ICadastrosMicroserviceApi {
    findProdutoAsync(id: number): Promise<Produto | null>;
    findClienteAsync(cpf: string): Promise<Cliente | null>;
}