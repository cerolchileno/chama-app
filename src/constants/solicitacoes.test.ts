
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

const STORAGE_KEY = '@chama:solicitacoes';

const dadosValidos = {
  id: 'solicitacao-1',
  prestadorId: 'prestador-demonstracao',
  servicoId: 'servico-1',
  profissional: 'Profissional CHAMA',
  servico: 'Instalação elétrica',
  endereco: 'Rua Exemplo, 100',
  descricao: 'Instalação de tomadas residenciais',
  status: 'PENDENTE' as const,
  data: '18/11/2026',
};

async function prepararModulo(
  dadosSalvos: unknown = null
) {
  vi.resetModules();

  const conteudo =
    dadosSalvos === null
      ? null
      : JSON.stringify(dadosSalvos);

  vi.mocked(AsyncStorage.getItem).mockResolvedValue(
    conteudo
  );

  vi.mocked(AsyncStorage.setItem).mockResolvedValue(
    undefined
  );

  return import('./solicitacoes');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Persistência de solicitações', () => {
  it('carrega uma lista vazia quando não há dados salvos', async () => {
    const modulo = await prepararModulo();

    await modulo.carregarSolicitacoes();

    expect(modulo.solicitacoes).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      STORAGE_KEY
    );
  });

  it('recupera solicitações previamente armazenadas', async () => {
    const modulo = await prepararModulo([
      dadosValidos,
    ]);

    await modulo.carregarSolicitacoes();

    expect(modulo.solicitacoes).toHaveLength(1);
    expect(modulo.solicitacoes[0].id).toBe(
      dadosValidos.id
    );
  });

  it('salva uma nova solicitação', async () => {
    const modulo = await prepararModulo();

    const sucesso = await modulo.adicionarSolicitacao(
      dadosValidos
    );

    expect(sucesso).toBe(true);
    expect(modulo.solicitacoes).toHaveLength(1);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([dadosValidos])
    );
  });

  it('impede solicitações com IDs duplicados', async () => {
    const modulo = await prepararModulo();

    expect(
      await modulo.adicionarSolicitacao(dadosValidos)
    ).toBe(true);

    expect(
      await modulo.adicionarSolicitacao(dadosValidos)
    ).toBe(false);

    expect(modulo.solicitacoes).toHaveLength(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(
      1
    );
  });

  it('não altera a memória quando falha ao salvar uma solicitação', async () => {
    const modulo = await prepararModulo();

    vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(
      new Error('Falha no armazenamento')
    );

    await expect(
      modulo.adicionarSolicitacao(dadosValidos)
    ).rejects.toThrow('Falha no armazenamento');

    expect(modulo.solicitacoes).toEqual([]);
  });

  it('aceita uma solicitação pendente', async () => {
    const modulo = await prepararModulo([
      dadosValidos,
    ]);

    const sucesso =
      await modulo.alterarStatusSolicitacao(
        dadosValidos.id,
        'ACEITA'
      );

    expect(sucesso).toBe(true);
    expect(modulo.solicitacoes[0].status).toBe(
      'ACEITA'
    );
  });

  it('impede uma transição de status inválida', async () => {
    const modulo = await prepararModulo([
      dadosValidos,
    ]);

    const sucesso =
      await modulo.alterarStatusSolicitacao(
        dadosValidos.id,
        'CONCLUIDA'
      );

    expect(sucesso).toBe(false);
    expect(modulo.solicitacoes[0].status).toBe(
      'PENDENTE'
    );
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('mantém o status anterior quando a gravação falha', async () => {
    const modulo = await prepararModulo([
      dadosValidos,
    ]);

    vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(
      new Error('Falha ao atualizar')
    );

    await expect(
      modulo.alterarStatusSolicitacao(
        dadosValidos.id,
        'ACEITA'
      )
    ).rejects.toThrow('Falha ao atualizar');

    expect(modulo.solicitacoes[0].status).toBe(
      'PENDENTE'
    );
  });

  it('registra uma avaliação em serviço concluído', async () => {
    const modulo = await prepararModulo([
      {
        ...dadosValidos,
        status: 'CONCLUIDA',
      },
    ]);

    const sucesso = await modulo.adicionarAvaliacao(
      dadosValidos.id,
      5,
      'Ótimo atendimento'
    );

    expect(sucesso).toBe(true);

    expect(modulo.solicitacoes[0].avaliacao).toEqual(
      expect.objectContaining({
        nota: 5,
        comentario: 'Ótimo atendimento',
      })
    );
  });

  it('impede avaliação em serviço pendente', async () => {
    const modulo = await prepararModulo([
      dadosValidos,
    ]);

    const sucesso = await modulo.adicionarAvaliacao(
      dadosValidos.id,
      5,
      'Muito bom'
    );

    expect(sucesso).toBe(false);
    expect(
      modulo.solicitacoes[0].avaliacao
    ).toBeUndefined();
  });

  it('impede uma segunda avaliação', async () => {
    const modulo = await prepararModulo([
      {
        ...dadosValidos,
        status: 'CONCLUIDA',
      },
    ]);

    expect(
      await modulo.adicionarAvaliacao(
        dadosValidos.id,
        5,
        'Primeira avaliação'
      )
    ).toBe(true);

    expect(
      await modulo.adicionarAvaliacao(
        dadosValidos.id,
        4,
        'Segunda avaliação'
      )
    ).toBe(false);

    expect(
      modulo.solicitacoes[0].avaliacao?.comentario
    ).toBe('Primeira avaliação');
  });

  it('mantém a avaliação ausente quando a gravação falha', async () => {
    const modulo = await prepararModulo([
      {
        ...dadosValidos,
        status: 'CONCLUIDA',
      },
    ]);

    vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(
      new Error('Falha ao avaliar')
    );

    await expect(
      modulo.adicionarAvaliacao(
        dadosValidos.id,
        5,
        'Excelente'
      )
    ).rejects.toThrow('Falha ao avaliar');

    expect(
      modulo.solicitacoes[0].avaliacao
    ).toBeUndefined();
  });

  it('serializa solicitações criadas simultaneamente', async () => {
    const modulo = await prepararModulo();

    const segunda = {
      ...dadosValidos,
      id: 'solicitacao-2',
    };

    const [resultado1, resultado2] =
      await Promise.all([
        modulo.adicionarSolicitacao(dadosValidos),
        modulo.adicionarSolicitacao(segunda),
      ]);

    expect(resultado1).toBe(true);
    expect(resultado2).toBe(true);

    expect(modulo.solicitacoes).toHaveLength(2);

    const ultimaGravacao = vi.mocked(
      AsyncStorage.setItem
    ).mock.calls.at(-1);

    expect(ultimaGravacao).toBeDefined();

    const listaPersistida = JSON.parse(
      ultimaGravacao![1]
    );

    expect(listaPersistida).toHaveLength(2);
  });

  it('continua funcionando após uma falha de gravação', async () => {
    const modulo = await prepararModulo();

    vi.mocked(AsyncStorage.setItem)
      .mockRejectedValueOnce(
        new Error('Falha temporária')
      )
      .mockResolvedValueOnce(undefined);

    await expect(
      modulo.adicionarSolicitacao(dadosValidos)
    ).rejects.toThrow('Falha temporária');

    const sucesso = await modulo.adicionarSolicitacao(
      dadosValidos
    );

    expect(sucesso).toBe(true);
    expect(modulo.solicitacoes).toHaveLength(1);
  });

  it('rejeita dados armazenados em formato inválido', async () => {
    const modulo = await prepararModulo({
      invalido: true,
    });

    await expect(
      modulo.carregarSolicitacoes()
    ).rejects.toThrow(
      'Formato de solicitações inválido'
    );

    expect(modulo.solicitacoes).toEqual([]);
  });
});
