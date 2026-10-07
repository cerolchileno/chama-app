export type StatusSolicitacao =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

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

export function adicionarAvaliacao(
  id: string,
  nota: number,
  comentario: string
) {
  const solicitacao = buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return false;
  }

  if (solicitacao.status !== 'CONCLUIDA') {
    return false;
  }

  if (nota < 1 || nota > 5) {
    return false;
  }

  solicitacao.avaliacao = {
    nota,
    comentario: comentario.trim(),
    data: new Date().toLocaleDateString('pt-BR'),
  };

  return true;
}