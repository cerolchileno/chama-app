
import AsyncStorage from '@react-native-async-storage/async-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

const STORAGE_KEY = '@chama:servicos-prestador';

const dadosValidos = {
  nome: 'Instalação elétrica',
  categoria: 'Eletricista',
  descricao: 'Instalação de tomadas residenciais',
  precoCentavos: 8000,
};

async function prepararModulo() {
  vi.resetModules();

  vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);
  vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

  return import('./servicosPrestador');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Armazenamento de serviços do prestador', () => {
  it('carrega uma lista vazia quando não há serviços salvos', async () => {
    const modulo = await prepararModulo();

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      STORAGE_KEY
    );
  });

  it('cadastra e persiste um serviço válido', async () => {
    const modulo = await prepararModulo();

    const resultado = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(resultado.sucesso).toBe(true);

    if (!resultado.sucesso) {
      return;
    }

    expect(resultado.servico.ativo).toBe(true);
    expect(resultado.servico.prestadorId).toBe('prestador-1');
    expect(resultado.servico.id).toBeTruthy();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.any(String)
    );

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(1);
  });

  it('impede cadastrar um serviço inválido', async () => {
    const modulo = await prepararModulo();

    const resultado = await modulo.cadastrarServico(
      'prestador-1',
      {
        ...dadosValidos,
        nome: '',
      }
    );

    expect(resultado.sucesso).toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('impede cadastrar sem identificação do prestador', async () => {
    const modulo = await prepararModulo();

    const resultado = await modulo.cadastrarServico(
      ' ',
      dadosValidos
    );

    expect(resultado.sucesso).toBe(false);
  });

  it('edita um serviço existente', async () => {
    const modulo = await prepararModulo();

    const cadastro = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(cadastro.sucesso).toBe(true);

    if (!cadastro.sucesso) {
      return;
    }

    const resultado = await modulo.editarServico(
      'prestador-1',
      cadastro.servico.id,
      {
        ...dadosValidos,
        nome: 'Manutenção elétrica',
        precoCentavos: 12000,
      }
    );

    expect(resultado.sucesso).toBe(true);

    if (!resultado.sucesso) {
      return;
    }

    expect(resultado.servico.nome).toBe('Manutenção elétrica');
    expect(resultado.servico.precoCentavos).toBe(12000);
    expect(resultado.servico.id).toBe(cadastro.servico.id);
  });

  it('desativa e reativa um serviço', async () => {
    const modulo = await prepararModulo();

    const cadastro = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(cadastro.sucesso).toBe(true);

    if (!cadastro.sucesso) {
      return;
    }

    const desativado =
      await modulo.alterarDisponibilidadeServico(
        'prestador-1',
        cadastro.servico.id,
        false
      );

    expect(desativado.sucesso).toBe(true);

    if (!desativado.sucesso) {
      return;
    }

    expect(desativado.servico.ativo).toBe(false);

    const reativado =
      await modulo.alterarDisponibilidadeServico(
        'prestador-1',
        cadastro.servico.id,
        true
      );

    expect(reativado.sucesso).toBe(true);

    if (!reativado.sucesso) {
      return;
    }

    expect(reativado.servico.ativo).toBe(true);
  });

  it('separa os serviços por prestador', async () => {
    const modulo = await prepararModulo();

    await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    await modulo.cadastrarServico(
      'prestador-2',
      {
        ...dadosValidos,
        nome: 'Pintura residencial',
        categoria: 'Pintor',
      }
    );

    const primeiro = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    const segundo = await modulo.listarServicosPrestador(
      'prestador-2'
    );

    expect(primeiro).toHaveLength(1);
    expect(segundo).toHaveLength(1);
    expect(primeiro[0].prestadorId).toBe('prestador-1');
    expect(segundo[0].prestadorId).toBe('prestador-2');
  });

  it('impede que outro prestador edite o serviço', async () => {
    const modulo = await prepararModulo();

    const cadastro = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(cadastro.sucesso).toBe(true);

    if (!cadastro.sucesso) {
      return;
    }

    const resultado = await modulo.editarServico(
      'prestador-2',
      cadastro.servico.id,
      {
        ...dadosValidos,
        nome: 'Serviço alterado',
      }
    );

    expect(resultado.sucesso).toBe(false);
  });

  it('impede que outro prestador altere a disponibilidade', async () => {
    const modulo = await prepararModulo();

    const cadastro = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(cadastro.sucesso).toBe(true);

    if (!cadastro.sucesso) {
      return;
    }

    const resultado =
      await modulo.alterarDisponibilidadeServico(
        'prestador-2',
        cadastro.servico.id,
        false
      );

    expect(resultado.sucesso).toBe(false);
  });

  it('retorna erro quando a gravação falha', async () => {
    const modulo = await prepararModulo();

    vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(
      new Error('Falha simulada')
    );

    const resultado = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(resultado.sucesso).toBe(false);

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(0);
  });

  it('carrega serviços previamente persistidos', async () => {
    const modulo = await prepararModulo();

    const servicoSalvo = {
      ...dadosValidos,
      id: 'servico-existente',
      prestadorId: 'prestador-1',
      ativo: true,
      criadoEm: '2026-01-01T10:00:00.000Z',
      atualizadoEm: '2026-01-01T10:00:00.000Z',
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(
      JSON.stringify([servicoSalvo])
    );

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(1);
    expect(servicos[0].id).toBe('servico-existente');
  });
});

describe('Concorrência entre operações de serviços', () => {
  it('preserva todos os serviços cadastrados simultaneamente', async () => {
    const modulo = await prepararModulo();

    const resultados = await Promise.all([
      modulo.cadastrarServico('prestador-1', {
        ...dadosValidos,
        nome: 'Instalação elétrica',
      }),
      modulo.cadastrarServico('prestador-1', {
        ...dadosValidos,
        nome: 'Manutenção elétrica',
      }),
      modulo.cadastrarServico('prestador-1', {
        ...dadosValidos,
        nome: 'Troca de disjuntor',
      }),
    ]);

    expect(resultados.every((resultado) => resultado.sucesso)).toBe(
      true
    );

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(3);

    expect(servicos.map((servico) => servico.nome).sort()).toEqual(
      [
        'Instalação elétrica',
        'Manutenção elétrica',
        'Troca de disjuntor',
      ].sort()
    );

    const ids = servicos.map((servico) => servico.id);

    expect(new Set(ids).size).toBe(3);

    const ultimaGravacao = vi.mocked(AsyncStorage.setItem)
      .mock.lastCall;

    expect(ultimaGravacao?.[0]).toBe(STORAGE_KEY);
    expect(JSON.parse(ultimaGravacao![1])).toHaveLength(3);
  });

  it('mantém a ordem das alterações simultâneas', async () => {
    const modulo = await prepararModulo();

    const cadastro = await modulo.cadastrarServico(
      'prestador-1',
      dadosValidos
    );

    expect(cadastro.sucesso).toBe(true);

    if (!cadastro.sucesso) {
      return;
    }

    const resultados = await Promise.all([
      modulo.alterarDisponibilidadeServico(
        'prestador-1',
        cadastro.servico.id,
        false
      ),
      modulo.alterarDisponibilidadeServico(
        'prestador-1',
        cadastro.servico.id,
        true
      ),
    ]);

    expect(resultados.every((resultado) => resultado.sucesso)).toBe(
      true
    );

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(1);
    expect(servicos[0].ativo).toBe(true);
  });

  it('continua processando operações após uma falha de gravação', async () => {
    const modulo = await prepararModulo();

    vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(
      new Error('Falha simulada')
    );

    const resultados = await Promise.all([
      modulo.cadastrarServico('prestador-1', {
        ...dadosValidos,
        nome: 'Primeiro serviço',
      }),
      modulo.cadastrarServico('prestador-1', {
        ...dadosValidos,
        nome: 'Segundo serviço',
      }),
    ]);

    expect(resultados[0].sucesso).toBe(false);
    expect(resultados[1].sucesso).toBe(true);

    const servicos = await modulo.listarServicosPrestador(
      'prestador-1'
    );

    expect(servicos).toHaveLength(1);
    expect(servicos[0].nome).toBe('Segundo serviço');
  });
});
