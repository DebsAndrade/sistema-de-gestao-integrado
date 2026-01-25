import { TarefaClass, Categoria } from '@models/Tarefa';

const listaTarefas: TarefaClass[] = [];

export function getTarefas(): TarefaClass[] {
  return listaTarefas;
};

export function adicionarTarefa(texto: string, categoria: Categoria, responsavel: string): void {
    const novaTarefa = new TarefaClass(
        Date.now(),
        texto,
        categoria,
        responsavel,
    );
    listaTarefas.push(novaTarefa);
}
