
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
  prestadorId?: string;
  servicoId?: string;
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
let filaOperacoes: Promise<void> = Promise.resolve();

function executarOperacao<T>(
  operacao: () => Promise<T>
): Promise<T> {
  const resultado = filaOperacoes
    .catch(() => undefined)
    .then(operacao);

  filaOperacoes = resultado.then(
    () => undefined,
    () => undefined
  );

  return resultado;
}

export function carregarSolicitacoes(): Promise<void> {
  if (carregamentoPendente) {
    return carregamentoPendente;
  }

  if (inicializado) {
    return Promise.resolve();
  }

  carregamentoPendente = executarOperacao(async () => {
    if (inicializado) return;

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
  }).finally(() => {
    carregamentoPendente = null;
  });

  return carregamentoPendente;
}

async function garantirCarregamento(): Promise<void> {
  if (!inicializado) {
    await carregarSolicitacoes();
  }
}

/**
 * Retorna somente as solicitações vinculadas
 * ao identificador informado.
 *
 * Solicitações antigas sem prestadorId não são
 * atribuídas automaticamente a nenhum prestador.
 */
export function listarSolicitacoesPorPrestador(
  prestadorId: string
): Solicitacao[] {
  const idNormalizado = prestadorId.trim();

  if (!idNormalizado) {
    return [];
  }

  return solicitacoes
    .filter(
      (item) => item.prestadorId === idNormalizado
    )
    .map((item) => ({
      ...item,
      avaliacao: item.avaliacao
        ? { ...item.avaliacao }
        : undefined,
    }));
}

export async function adicionarSolicitacao(
  solicitacao: Solicitacao
): Promise<boolean> {
  await garantirCarregamento();

  return executarOperacao(async () => {
    if (
      solicitacoes.some(
        (item) => item.id === solicitacao.id
      )
    ) {
      return false;
    }

    const atualizadas = [
      { ...solicitacao },
      ...solicitacoes,
    ];

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(atualizadas)
    );

    solicitacoes.splice(
      0,
      solicitacoes.length,
      ...atualizadas
    );

    return true;
  });
}

export async function alterarStatusSolicitacao(
  id: string,
  novoStatus: StatusSolicitacao,
  prestadorId?: string
): Promise<boolean> {
  await garantirCarregamento();

  return executarOperacao(async () => {
    const solicitacao = solicitacoes.find(
      (item) => item.id === id
    );

    if (!solicitacao) {
      return false;
    }

    // Quando a operação informa um prestador,
    // impede alterações em pedidos de terceiros.
    if (
      prestadorId !== undefined &&
      (
        !prestadorId.trim() ||
        solicitacao.prestadorId !== prestadorId.trim()
      )
    ) {
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

    const atualizadas = solicitacoes.map((item) =>
      item.id === id
        ? { ...item, status: novoStatus }
        : { ...item }
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(atualizadas)
    );

    solicitacoes.splice(
      0,
      solicitacoes.length,
      ...atualizadas
    );

    return true;
  });
}

export function buscarSolicitacaoPorId(
  id: string
): Solicitacao | undefined {
  return solicitacoes.find(
    (item) => item.id === id
  );
}

export async function adicionarAvaliacao(
  id: string,
  nota: number,
  comentario: string
): Promise<boolean> {
  await garantirCarregamento();

  return executarOperacao(async () => {
    const solicitacao = solicitacoes.find(
      (item) => item.id === id
    );

    if (!solicitacao) {
      return false;
    }

    if (
      solicitacao.status !== 'CONCLUIDA' ||
      solicitacao.avaliacao
    ) {
      return false;
    }

    if (
      !Number.isFinite(nota) ||
      nota < 1 ||
      nota > 5
    ) {
      return false;
    }

    const avaliacao: Avaliacao = {
      nota,
      comentario: comentario.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
    };

    const atualizadas = solicitacoes.map((item) =>
      item.id === id
        ? { ...item, avaliacao }
        : { ...item }
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(atualizadas)
    );

    solicitacoes.splice(
      0,
      solicitacoes.length,
      ...atualizadas
    );

    return true;
  });
}
