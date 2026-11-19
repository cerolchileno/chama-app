
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EnderecoCliente = {
  id: string;
  apelido: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
};

const STORAGE_KEY = '@chama:enderecos-cliente';

function validarListaEnderecos(dados: unknown): dados is EnderecoCliente[] {
  if (!Array.isArray(dados)) {
    return false;
  }

  return dados.every((endereco) => {
    if (
      typeof endereco !== 'object' ||
      endereco === null
    ) {
      return false;
    }

    return (
      typeof endereco.id === 'string' &&
      typeof endereco.apelido === 'string' &&
      typeof endereco.cep === 'string' &&
      typeof endereco.rua === 'string' &&
      typeof endereco.numero === 'string' &&
      typeof endereco.complemento === 'string' &&
      typeof endereco.bairro === 'string' &&
      typeof endereco.cidade === 'string' &&
      typeof endereco.estado === 'string' &&
      typeof endereco.principal === 'boolean'
    );
  });
}

export async function carregarEnderecosCliente(): Promise<EnderecoCliente[]> {
  try {
    const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);

    if (!dadosSalvos) {
      return [];
    }

    const dados: unknown = JSON.parse(dadosSalvos);

    if (!validarListaEnderecos(dados)) {
      throw new Error('Formato de endereços inválido.');
    }

    return dados;
  } catch (error) {
    console.error('Erro ao carregar endereços do cliente:', error);
    throw error;
  }
}

export async function salvarEnderecosCliente(
  enderecos: EnderecoCliente[]
): Promise<void> {
  try {
    if (!validarListaEnderecos(enderecos)) {
      throw new Error('Lista de endereços inválida.');
    }

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(enderecos)
    );
  } catch (error) {
    console.error('Erro ao salvar endereços do cliente:', error);
    throw error;
  }
}

export function gerarIdEndereco(): string {
  return `endereco-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}
