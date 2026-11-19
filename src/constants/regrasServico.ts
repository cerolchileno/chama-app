
export type DadosServico = {
  nome: string;
  categoria: string;
  descricao: string;
  precoCentavos: number;
};

export type ErrosServico = Partial<
  Record<keyof DadosServico, string>
>;

export function validarServico(
  dados: DadosServico
): ErrosServico {
  const erros: ErrosServico = {};

  if (dados.nome.trim().length < 3) {
    erros.nome = 'Informe um nome com pelo menos 3 caracteres.';
  }

  if (!dados.categoria.trim()) {
    erros.categoria = 'Informe a categoria do serviço.';
  }

  if (dados.descricao.trim().length < 10) {
    erros.descricao =
      'A descrição deve conter pelo menos 10 caracteres.';
  }

  if (
    !Number.isSafeInteger(dados.precoCentavos) ||
    dados.precoCentavos <= 0
  ) {
    erros.precoCentavos =
      'Informe um preço válido maior que zero.';
  }

  return erros;
}

export function normalizarDadosServico(
  dados: DadosServico
): DadosServico {
  return {
    nome: dados.nome.trim(),
    categoria: dados.categoria.trim(),
    descricao: dados.descricao.trim(),
    precoCentavos: dados.precoCentavos,
  };
}

export function converterPrecoParaCentavos(
  valor: string
): number | null {
  const texto = valor.trim();

  if (!/^\d+(?:,\d{1,2})?$/.test(texto)) {
    return null;
  }

  const [reais, centavos = ''] = texto.split(',');

  const resultado =
    Number(reais) * 100 +
    Number(centavos.padEnd(2, '0'));

  if (!Number.isSafeInteger(resultado) || resultado <= 0) {
    return null;
  }

  return resultado;
}
