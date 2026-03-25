export type Categoria = "trabalho" | "pessoal" | "estudos";

export interface Tarefa {
  id: number;
  createdAt: Date;
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;
  responsavelNome?: string;
}

export class TarefaClass implements Tarefa {
  id: number;
  createdAt: Date = new Date();
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;
  responsavelNome?: string;

  constructor(
    id: number,
    createdAt: Date,
    titulo: string,
    categoria: Categoria,
    responsavelNome?: string,
    dataConclusao?: Date,
  ) {
    this.id = id;
    this.titulo = titulo;
    this.concluida = false;
    this.dataConclusao = dataConclusao;
    this.categoria = categoria;
    this.responsavelNome = responsavelNome;
    this.createdAt = createdAt;
  }
}
