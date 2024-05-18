import { Cliente } from "@/Domain/Entities/Cliente";
import { Produto } from "@/Domain/Entities/Produto";
import { ICadastrosMicroserviceApi } from "@/Interfaces/ExternalServices/Microservices/ICadastrosMicroserviceApi";
import axios, { AxiosResponse } from "axios";
import { env } from "@/Infrastructure/env";

const instance = axios.create({
  baseURL: env.MICROSERVICO_CADASTROS_URL,
  timeout: 15000,
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: null) =>
    instance.post(url, body).then(responseBody),
  put: (url: string, body: null) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

export default class CadastrosMicroserviceApi
  implements ICadastrosMicroserviceApi
{
  async findProdutoAsync(id: number): Promise<Produto | null> {
    try {
      const produto: Produto = await requests.get(`produto/${id}`);
      return produto;
    } catch (error) {
      console.error("Erro ao fazer a chamada da API:", error);
      return null;
    }
  }
  async findClienteAsync(cpf: string): Promise<Cliente | null> {
    try {
      const cliente: Cliente = await requests.get(`cliente/${cpf}`);
      return cliente;
    } catch (error) {
      console.error("Erro ao fazer a chamada da API:", error);
      return null;
    }
  }
}
