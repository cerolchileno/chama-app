
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  podeAlterarStatusSolicitacao,
  type StatusSolicitacao,
} from './regrasSolicitacao';

export type { StatusSolicitacao } from './regrasSolicitacao';
export { podeAlterarStatusSolicitacao } from './regrasSolicitacao';

export type Avaliacao = {
  nota: number;
  comentario: string;
  data: string;
};

export type Solicitacao = {
  id: string;
  profissional: string;
  servico: string;
  endereco: string;
  descricao: string;
  status: StatusSolicitacao;
  data: string;
  avaliacao?: Avaliacao;
};

const STORAGE_KEY = '@chama:solicitacoes';

export const solicitacoes: Solicitacao[] = [];

let inicializado = false;
let carregamentoPendente: Promise<void> | null = null;
let filaGravacao: Promise<void> = Promise.resolve();

function salvarSolicitacoes(): Promise<void> {
  const dados = JSON.stringify(solicitacoes);

  filaGravacao = filaGravacao
    .catch(() => undefined)
    .then(async () => {
      await AsyncStorage.setItem(STORAGE_KEY, dados);
    });

  void filaGravacao.catch((error) => {
    console.error('Erro ao salvar solicitações:', error);
  });

  return filaGravacao;
}

export function carregarSolicitacoes(): Promise<void> {
  if (inicializado) {
    return Promise.resolve();
  }

  if (carregamentoPendente) {
    return carregamentoPendente;
  }

  carregamentoPendente = (async () => {
    await filaGravacao;

    const dados = await AsyncStorage.getItem(STORAGE_KEY);

    if (dados) {
      const lista: unknown = JSON.parse(dados);

      if (!Array.isArray(lista)) {
        throw new Error('Formato de solicitações inválido');
      }

      solicitacoes.splice(
        0,
        solicitacoes.length,
        ...(lista as Solicitacao[])
      );
    }

    inicializado = true;
  })().finally(() => {
    carregamentoPendente = null;
  });

  return carregamentoPendente;
}

export function adicionarSolicitacao(
  solicitacao: Solicitacao
): void {
  solicitacoes.unshift(solicitacao);
  void salvarSolicitacoes();
}

export function alterarStatusSolicitacao(
  id: string,
  novoStatus: StatusSolicitacao
): boolean {
  const solicitacao = solicitacoes.find(
    (item) => item.id === id
  );

  if (!solicitacao) {
    return false;
  }

  if (
    !podeAlterarStatusSolicitacao(
      solicitacao.status,
      novoStatus
    )
  ) {
    return false;
  }

  solicitacao.status = novoStatus;
  void salvarSolicitacoes();

  return true;
}

export function buscarSolicitacaoPorId(
  id: string
): Solicitacao | undefined {
  return solicitacoes.find(
    (item) => item.id === id
  );
}

export function adicionarAvaliacao(
  id: string,
  nota: number,
  comentario: string
): boolean {
  const solicitacao = buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return false;
  }

  if (solicitacao.status !== 'CONCLUIDA') {
    return false;
  }

  if (
    !Number.isFinite(nota) ||
    nota < 1 ||
    nota > 5
  ) {
    return false;
  }

  solicitacao.avaliacao = {
    nota,
    comentario: comentario.trim(),
    data: new Date().toLocaleDateString('pt-BR'),
  };

  void salvarSolicitacoes();

  return true;
}
