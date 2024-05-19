import { describe, it, expect, beforeEach} from "vitest";
import MockAdapter from "axios-mock-adapter";
import CadastrosMicroserviceApi from "@/Infrastructure/drivers/ExternalServices/Microservices/CadastrosMicroserviceApi";
import { Cliente } from "@/Domain/Entities/Cliente";
import { Produto } from "@/Domain/Entities/Produto";
import { env } from "@/Infrastructure/env";
import axiosInstance from "@/Infrastructure/config/axiosInstance";

const mock = new MockAdapter(axiosInstance);

describe("CadastrosMicroserviceApi", () => {
    let api: CadastrosMicroserviceApi;

    beforeEach(() => {
        api = new CadastrosMicroserviceApi();
        mock.reset();
    });

    it("deve retornar um Produto quando findProdutoAsync é chamado com ID válido", async () => {
        const fakeProduto: Produto = { id: 1, nome: "Produto Teste", valor: 100, descricao: "descricao produto", categoria: "lanche", disponivel:true };
        mock.onGet(`${ env.MICROSERVICO_CADASTROS_URL }produto/1`).reply(200, fakeProduto);
        
        const produto = await api.findProdutoAsync(1);
        expect(produto).toEqual(fakeProduto);
    });

   it("deve retornar null quando findProdutoAsync é chamado com ID inexistente", async () => {
        mock.onGet(`${env.MICROSERVICO_CADASTROS_URL}/produto/999`).reply(404);

        const produto = await api.findProdutoAsync(999);
        expect(produto).toBeNull();
    });

    it("deve retornar um Cliente quando findClienteAsync é chamado com CPF válido", async () => {
        const fakeCliente: Cliente = { id: 1, cpf: "12345678901", nome: "Cliente Teste", sobrenome: "silva" };
        mock.onGet(`${env.MICROSERVICO_CADASTROS_URL}cliente/12345678901`).reply(200, fakeCliente);

        const cliente = await api.findClienteAsync("12345678901");
        expect(cliente).toEqual(fakeCliente);
    });

  it("deve retornar null quando findClienteAsync é chamado com CPF inexistente", async () => {
        mock.onGet(`${env.MICROSERVICO_CADASTROS_URL}/cliente/00000000000`).reply(404);

        const cliente = await api.findClienteAsync("00000000000");
        expect(cliente).toBeNull();
    });
});
