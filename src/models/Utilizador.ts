export interface Utilizador {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

export class UtilizadorClass implements Utilizador {
  id: number;
  nome: string;
  email: string;
  ativo: boolean = true;

  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}
