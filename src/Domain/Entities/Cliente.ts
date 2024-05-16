export class Cliente {
<<<<<<< HEAD
	id: number;
	nome: string;
	sobrenome: string | null;
	cpf: string;

	constructor({ id, cpf, nome, sobrenome }: typeof Cliente.prototype) {
		this.id = id
		this.nome = nome;
		this.sobrenome = sobrenome;
		this.cpf = cpf;
	}
=======
  id?: number;
  nome: string;
  sobrenome: string | null;
  cpf: string;

  constructor({ cpf, nome, sobrenome }: typeof Cliente.prototype) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.cpf = cpf;
  }
>>>>>>> 8cd1c57b4e84a24e88f4faa7620f3fb5ca521910
}
