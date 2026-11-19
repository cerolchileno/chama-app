
import { describe, expect, it } from 'vitest';

import {
  podeAlterarStatusSolicitacao,
  type StatusSolicitacao,
} from './regrasSolicitacao';

describe('Regras de status das solicitações', () => {
  it.each([
    ['PENDENTE', 'ACEITA'],
    ['PENDENTE', 'RECUSADA'],
    ['PENDENTE', 'CANCELADA'],
    ['ACEITA', 'EM_ANDAMENTO'],
    ['ACEITA', 'CANCELADA'],
    ['EM_ANDAMENTO', 'CONCLUIDA'],
  ] satisfies [StatusSolicitacao, StatusSolicitacao][])(
    'permite a transição de %s para %s',
    (atual, proximo) => {
      expect(
        podeAlterarStatusSolicitacao(atual, proximo)
      ).toBe(true);
    }
  );

  it.each([
    ['PENDENTE', 'CONCLUIDA'],
    ['ACEITA', 'CONCLUIDA'],
    ['EM_ANDAMENTO', 'PENDENTE'],
    ['CONCLUIDA', 'PENDENTE'],
    ['RECUSADA', 'ACEITA'],
    ['CANCELADA', 'EM_ANDAMENTO'],
  ] satisfies [StatusSolicitacao, StatusSolicitacao][])(
    'bloqueia a transição de %s para %s',
    (atual, proximo) => {
      expect(
        podeAlterarStatusSolicitacao(atual, proximo)
      ).toBe(false);
    }
  );

  it.each([
    'PENDENTE',
    'ACEITA',
    'RECUSADA',
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA',
  ] satisfies StatusSolicitacao[])(
    'impede repetir o mesmo status: %s',
    (status) => {
      expect(
        podeAlterarStatusSolicitacao(status, status)
      ).toBe(false);
    }
  );
});
