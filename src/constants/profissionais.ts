
export type Profissional = {
  id: string;
  nome: string;
  nota: string | null;
  avaliacoes: number;
  distancia: string | null;
  precoInicialCentavos: number | null;
  servicosRealizados: number | null;
  experiencia: string | null;
  demonstrativo: boolean;
};

export const PRESTADOR_DEMONSTRACAO_ID =
  'prestador-demonstracao';

const profissionais: Profissional[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    nota: '4,9',
    avaliacoes: 124,
    distancia: '2,1 km',
    precoInicialCentavos: 8000,
    servicosRealizados: 120,
    experiencia: '3 anos',
    demonstrativo: true,
  },
  {
    id: '2',
    nome: 'Marcos Oliveira',
    nota: '4,8',
    avaliacoes: 96,
    distancia: '3,4 km',
    precoInicialCentavos: 7000,
    servicosRealizados: 98,
    experiencia: '4 anos',
    demonstrativo: true,
  },
  {
    id: '3',
    nome: 'André Santos',
    nota: '4,8',
    avaliacoes: 82,
    distancia: '4,2 km',
    precoInicialCentavos: 9000,
    servicosRealizados: 87,
    experiencia: '2 anos',
    demonstrativo: true,
  },
  {
    id: '4',
    nome: 'Paulo Ribeiro',
    nota: '4,7',
    avaliacoes: 68,
    distancia: '5,1 km',
    precoInicialCentavos: 8000,
    servicosRealizados: 72,
    experiencia: '3 anos',
    demonstrativo: true,
  },
  {
    id: PRESTADOR_DEMONSTRACAO_ID,
    nome: 'Profissional CHAMA',
    nota: null,
    avaliacoes: 0,
    distancia: null,
    precoInicialCentavos: null,
    servicosRealizados: null,
    experiencia: null,
    demonstrativo: true,
  },
];

export function listarProfissionais(): Profissional[] {
  return profissionais.map((profissional) => ({
    ...profissional,
  }));
}

export function buscarProfissionalPorId(
  id: string
): Profissional | null {
  const profissional = profissionais.find(
    (item) => item.id === id
  );

  return profissional ? { ...profissional } : null;
}

export function formatarPrecoCentavos(
  valor: number | null
): string | null {
  if (
    valor === null ||
    !Number.isSafeInteger(valor) ||
    valor < 0
  ) {
    return null;
  }

  return (valor / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
