import { Cliente } from "@/Domain/Entities/Cliente";
import { Produto } from "@/Domain/Entities/Produto";
import axiosInstance from "@/Infrastructure/config/axiosInstance";
import { ICadastrosMicroserviceApi } from "@/Interfaces/ExternalServices/Microservices/ICadastrosMicroserviceApi";
import { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axiosInstance.get(url).then(responseBody),
  post: (url: string, body: null) =>
    axiosInstance.post(url, body).then(responseBody),
  put: (url: string, body: null) => axiosInstance.put(url, body).then(responseBody),
  delete: (url: string) => axiosInstance.delete(url).then(responseBody),
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
