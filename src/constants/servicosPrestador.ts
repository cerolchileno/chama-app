
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  normalizarDadosServico,
  validarServico,
  type DadosServico,
} from './regrasServico';

export type ServicoPrestador = DadosServico & {
  id: string;
  prestadorId: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type ResultadoServico =
  | { sucesso: true; servico: ServicoPrestador }
  | { sucesso: false; erro: string };

const STORAGE_KEY = '@chama:servicos-prestador';

let servicos: ServicoPrestador[] = [];
let inicializado = false;
let carregamentoPendente: Promise<void> | null = null;
let filaOperacoes: Promise<void> = Promise.resolve();

function copiarServico(servico: ServicoPrestador): ServicoPrestador {
  return { ...servico };
}

function gerarId(): string {
  return `servico-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;
}

function prestadorValido(prestadorId: string): boolean {
  return typeof prestadorId === 'string' && prestadorId.trim().length > 0;
}

function servicoPersistidoValido(
  valor: unknown
): valor is ServicoPrestador {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const item = valor as Partial<ServicoPrestador>;

  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.prestadorId === 'string' &&
    item.prestadorId.length > 0 &&
    typeof item.nome === 'string' &&
    typeof item.categoria === 'string' &&
    typeof item.descricao === 'string' &&
    typeof item.precoCentavos === 'number' &&
    Object.keys(
      validarServico({
        nome: item.nome,
        categoria: item.categoria,
        descricao: item.descricao,
        precoCentavos: item.precoCentavos,
      })
    ).length === 0 &&
    typeof item.ativo === 'boolean' &&
    typeof item.criadoEm === 'string' &&
    typeof item.atualizadoEm === 'string'
  );
}

export async function carregarServicos(): Promise<void> {
  if (inicializado) {
    return;
  }

  if (carregamentoPendente) {
    return carregamentoPendente;
  }

  carregamentoPendente = (async () => {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);

    if (dados !== null) {
      const lista: unknown = JSON.parse(dados);

      if (
        !Array.isArray(lista) ||
        !lista.every(servicoPersistidoValido)
      ) {
        throw new Error('Dados de serviços armazenados são inválidos.');
      }

      servicos = lista.map(copiarServico);
    } else {
      servicos = [];
    }

    inicializado = true;
  })().finally(() => {
    carregamentoPendente = null;
  });

  return carregamentoPendente;
}

function executarOperacao(
  operacao: () => Promise<ResultadoServico>
): Promise<ResultadoServico> {
  const resultado = filaOperacoes.then(operacao);

  filaOperacoes = resultado.then(
    () => undefined,
    () => undefined
  );

  return resultado;
}

async function persistir(
  atualizados: ServicoPrestador[]
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(atualizados)
    );

    servicos = atualizados;

    return true;
  } catch {
    return false;
  }
}

export async function listarServicosPrestador(
  prestadorId: string
): Promise<ServicoPrestador[]> {
  if (!prestadorValido(prestadorId)) {
    return [];
  }

  await filaOperacoes;
  await carregarServicos();

  return servicos
    .filter((servico) => servico.prestadorId === prestadorId)
    .map(copiarServico);
}

export function cadastrarServico(
  prestadorId: string,
  dados: DadosServico
): Promise<ResultadoServico> {
  return executarOperacao(async () => {
    if (!prestadorValido(prestadorId)) {
      return {
        sucesso: false,
        erro: 'Identificação do prestador inválida.',
      };
    }

    const erros = validarServico(dados);

    if (Object.keys(erros).length > 0) {
      return {
        sucesso: false,
        erro: Object.values(erros)[0]!,
      };
    }

    await carregarServicos();

    const agora = new Date().toISOString();

    const servico: ServicoPrestador = {
      ...normalizarDadosServico(dados),
      id: gerarId(),
      prestadorId,
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    const salvo = await persistir([servico, ...servicos]);

    if (!salvo) {
      return {
        sucesso: false,
        erro: 'Não foi possível salvar o serviço.',
      };
    }

    return {
      sucesso: true,
      servico: copiarServico(servico),
    };
  });
}

export function editarServico(
  prestadorId: string,
  servicoId: string,
  dados: DadosServico
): Promise<ResultadoServico> {
  return executarOperacao(async () => {
    if (!prestadorValido(prestadorId)) {
      return {
        sucesso: false,
        erro: 'Identificação do prestador inválida.',
      };
    }

    const erros = validarServico(dados);

    if (Object.keys(erros).length > 0) {
      return {
        sucesso: false,
        erro: Object.values(erros)[0]!,
      };
    }

    await carregarServicos();

    const indice = servicos.findIndex(
      (servico) =>
        servico.id === servicoId &&
        servico.prestadorId === prestadorId
    );

    if (indice === -1) {
      return {
        sucesso: false,
        erro: 'Serviço não encontrado.',
      };
    }

    const atualizado: ServicoPrestador = {
      ...servicos[indice],
      ...normalizarDadosServico(dados),
      atualizadoEm: new Date().toISOString(),
    };

    const novaLista = servicos.map((servico, index) =>
      index === indice ? atualizado : servico
    );

    if (!(await persistir(novaLista))) {
      return {
        sucesso: false,
        erro: 'Não foi possível atualizar o serviço.',
      };
    }

    return {
      sucesso: true,
      servico: copiarServico(atualizado),
    };
  });
}

export function alterarDisponibilidadeServico(
  prestadorId: string,
  servicoId: string,
  ativo: boolean
): Promise<ResultadoServico> {
  return executarOperacao(async () => {
    if (!prestadorValido(prestadorId)) {
      return {
        sucesso: false,
        erro: 'Identificação do prestador inválida.',
      };
    }

    if (typeof ativo !== 'boolean') {
      return {
        sucesso: false,
        erro: 'Disponibilidade inválida.',
      };
    }

    await carregarServicos();

    const indice = servicos.findIndex(
      (servico) =>
        servico.id === servicoId &&
        servico.prestadorId === prestadorId
    );

    if (indice === -1) {
      return {
        sucesso: false,
        erro: 'Serviço não encontrado.',
      };
    }

    const atualizado: ServicoPrestador = {
      ...servicos[indice],
      ativo,
      atualizadoEm: new Date().toISOString(),
    };

    const novaLista = servicos.map((servico, index) =>
      index === indice ? atualizado : servico
    );

    if (!(await persistir(novaLista))) {
      return {
        sucesso: false,
        erro: 'Não foi possível alterar a disponibilidade.',
      };
    }

    return {
      sucesso: true,
      servico: copiarServico(atualizado),
    };
  });
}
