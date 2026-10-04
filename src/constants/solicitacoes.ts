export type StatusSolicitacao =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export type Solicitacao = {
  id: string;
  profissional: string;
  servico: string;
  endereco: string;
  descricao: string;
  status: StatusSolicitacao;
  data: string;
};

export const solicitacoes: Solicitacao[] = [];

export function adicionarSolicitacao(
  solicitacao: Solicitacao
) {
  solicitacoes.unshift(solicitacao);
}

export function alterarStatusSolicitacao(
  id: string,
  novoStatus: StatusSolicitacao
) {
  const solicitacao = solicitacoes.find(
    (item) => item.id === id
  );

  if (!solicitacao) {
    return false;
  }

  solicitacao.status = novoStatus;

  return true;
}

export function buscarSolicitacaoPorId(
  id: string
) {
  return solicitacoes.find(
    (item) => item.id === id
  );
}