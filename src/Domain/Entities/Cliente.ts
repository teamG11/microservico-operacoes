export class Cliente {
  id: number;
  nome: string;
  sobrenome: string | null;
  cpf: string;
  constructor({ id, cpf, nome, sobrenome }: typeof Cliente.prototype) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.cpf = cpf;
  }
}
