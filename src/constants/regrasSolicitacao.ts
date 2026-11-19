
export type StatusSolicitacao =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export const TRANSICOES_PERMITIDAS: Record<
  StatusSolicitacao,
  readonly StatusSolicitacao[]
> = {
  PENDENTE: ['ACEITA', 'RECUSADA', 'CANCELADA'],
  ACEITA: ['EM_ANDAMENTO', 'CANCELADA'],
  RECUSADA: [],
  EM_ANDAMENTO: ['CONCLUIDA'],
  CONCLUIDA: [],
  CANCELADA: [],
};

export function podeAlterarStatusSolicitacao(
  statusAtual: StatusSolicitacao,
  novoStatus: StatusSolicitacao
): boolean {
  return TRANSICOES_PERMITIDAS[statusAtual].includes(
    novoStatus
  );
}
