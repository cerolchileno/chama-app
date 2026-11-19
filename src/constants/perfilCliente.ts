
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DadosPerfilCliente = {
  nome: string;
  email: string;
  telefone: string;
};

const STORAGE_KEY = '@chama:perfil-cliente';

export async function carregarPerfilCliente(): Promise<DadosPerfilCliente | null> {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);

    if (!dados) {
      return null;
    }

    const perfil: unknown = JSON.parse(dados);

    if (
      typeof perfil !== 'object' ||
      perfil === null ||
      !('nome' in perfil) ||
      !('email' in perfil) ||
      !('telefone' in perfil) ||
      typeof perfil.nome !== 'string' ||
      typeof perfil.email !== 'string' ||
      typeof perfil.telefone !== 'string'
    ) {
      throw new Error('Dados do perfil inválidos.');
    }

    return {
      nome: perfil.nome,
      email: perfil.email,
      telefone: perfil.telefone,
    };
  } catch (error) {
    console.error('Erro ao carregar perfil do cliente:', error);
    throw error;
  }
}

export async function salvarPerfilCliente(
  perfil: DadosPerfilCliente
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        nome: perfil.nome.trim(),
        email: perfil.email.trim().toLowerCase(),
        telefone: perfil.telefone.trim(),
      })
    );
  } catch (error) {
    console.error('Erro ao salvar perfil do cliente:', error);
    throw error;
  }
}
