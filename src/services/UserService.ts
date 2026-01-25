import { UtilizadorClass} from '@models/Utilizador';

const listaUtilizadores: UtilizadorClass[] = [];

export function getUtilizadores(): UtilizadorClass[] {
  return listaUtilizadores;
};

export function adicionarUtilizador(nome: string, email: string): void {
    const novoUser = new UtilizadorClass(
        Date.now(),
        nome,
        email,
    );
    listaUtilizadores.push(novoUser);
}
