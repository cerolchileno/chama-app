import AsyncStorage from '@react-native-async-storage/async-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

const STORAGE_KEY = '@chama:solicitacoes';
const PRESTADOR_ID = 'prestador-demonstracao';

const pedidoDemonstracao = {
  id: 'pedido-demo',
  prestadorId: PRESTADOR_ID,
  servicoId: 'servico-demo',
  profissional: 'Profissional CHAMA',
  servico: 'Instalação elétrica',
  endereco: 'Rua Um, 10',
  descricao: 'Instalar tomadas',
  status: 'PENDENTE' as const,
  data: '19/11/2026',
};

const pedidoOutroProfissional = {
  ...pedidoDemonstracao,
  id: 'pedido-outro',
  prestadorId: '1',
  profissional: 'Carlos Silva',
};

const pedidoLegado = {
  ...pedidoDemonstracao,
  id: 'pedido-legado',
  prestadorId: undefined,
};

async function prepararModulo(dadosSalvos: unknown[]) {
  vi.resetModules();
  vi.mocked(AsyncStorage.getItem).mockResolvedValue(
    JSON.stringify(dadosSalvos)
  );
  vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

  const modulo = await import('./solicitacoes');
  await modulo.carregarSolicitacoes();
  return modulo;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Filtro de solicitações do prestador', () => {
  it('mostra apenas pedidos vinculados ao prestador informado', async () => {
    const modulo = await prepararModulo([
      pedidoDemonstracao,
      pedidoOutroProfissional,
      pedidoLegado,
    ]);

    const pedidos = modulo.listarSolicitacoesPorPrestador(
      PRESTADOR_ID
    );

    expect(pedidos.map((pedido) => pedido.id)).toEqual([
      'pedido-demo',
    ]);
    expect(
      modulo.listarSolicitacoesPorPrestador('1').map(
        (pedido) => pedido.id
      )
    ).toEqual(['pedido-outro']);
  });

  it('não atribui solicitações antigas sem prestadorId a outro profissional', async () => {
    const modulo = await prepararModulo([pedidoLegado]);

    expect(
      modulo.listarSolicitacoesPorPrestador(PRESTADOR_ID)
    ).toEqual([]);
  });

  it('retorna vazio para identificadores em branco', async () => {
    const modulo = await prepararModulo([pedidoDemonstracao]);

    expect(modulo.listarSolicitacoesPorPrestador('   ')).toEqual(
      []
    );
  });

  it('não permite modificar os dados da memória por meio da lista retornada', async () => {
    const pedidoAvaliado = {
      ...pedidoDemonstracao,
      status: 'CONCLUIDA' as const,
      avaliacao: {
        nota: 5,
        comentario: 'Excelente',
        data: '19/11/2026',
      },
    };
    const modulo = await prepararModulo([pedidoAvaliado]);

    const pedidos = modulo.listarSolicitacoesPorPrestador(
      PRESTADOR_ID
    );

    pedidos[0].profissional = 'Nome alterado';
    pedidos[0].avaliacao!.comentario = 'Comentário alterado';

    expect(modulo.solicitacoes[0].profissional).toBe(
      'Profissional CHAMA'
    );
    expect(modulo.solicitacoes[0].avaliacao?.comentario).toBe(
      'Excelente'
    );
  });

  it('impede que um prestador aceite pedidos de outro profissional', async () => {
    const modulo = await prepararModulo([
      pedidoDemonstracao,
      pedidoOutroProfissional,
    ]);

    const resultado = await modulo.alterarStatusSolicitacao(
      'pedido-outro',
      'ACEITA',
      PRESTADOR_ID
    );

    expect(resultado).toBe(false);
    expect(modulo.solicitacoes[1].status).toBe('PENDENTE');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('impede a alteração de pedidos antigos sem prestadorId', async () => {
    const modulo = await prepararModulo([pedidoLegado]);

    const resultado = await modulo.alterarStatusSolicitacao(
      'pedido-legado',
      'ACEITA',
      PRESTADOR_ID
    );

    expect(resultado).toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('rejeita prestadorId vazio sem persistir alterações', async () => {
    const modulo = await prepararModulo([pedidoDemonstracao]);

    const resultado = await modulo.alterarStatusSolicitacao(
      'pedido-demo',
      'ACEITA',
      ' '
    );

    expect(resultado).toBe(false);
    expect(modulo.solicitacoes[0].status).toBe('PENDENTE');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('permite aceitar pedidos do próprio prestador', async () => {
    const modulo = await prepararModulo([pedidoDemonstracao]);

    const resultado = await modulo.alterarStatusSolicitacao(
      'pedido-demo',
      'ACEITA',
      PRESTADOR_ID
    );

    expect(resultado).toBe(true);
    expect(modulo.solicitacoes[0].status).toBe('ACEITA');
    expect(AsyncStorage.setItem).toHaveBeenCalledOnce();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"status":"ACEITA"')
    );
  });
});
