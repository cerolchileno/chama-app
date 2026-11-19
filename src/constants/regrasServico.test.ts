
import { describe, expect, it } from 'vitest';

import {
  converterPrecoParaCentavos,
  normalizarDadosServico,
  validarServico,
  type DadosServico,
} from './regrasServico';

const servicoValido: DadosServico = {
  nome: 'Instalação elétrica',
  categoria: 'Eletricista',
  descricao: 'Instalação de tomadas residenciais',
  precoCentavos: 8000,
};

describe('Validação de serviços', () => {
  it('aceita um serviço válido', () => {
    expect(validarServico(servicoValido)).toEqual({});
  });

  it('rejeita nome muito curto', () => {
    expect(
      validarServico({ ...servicoValido, nome: 'AB' }).nome
    ).toBeDefined();
  });

  it('rejeita categoria vazia', () => {
    expect(
      validarServico({ ...servicoValido, categoria: ' ' })
        .categoria
    ).toBeDefined();
  });

  it('rejeita descrição muito curta', () => {
    expect(
      validarServico({ ...servicoValido, descricao: 'Curta' })
        .descricao
    ).toBeDefined();
  });

  it.each([0, -100, 10.5, NaN, Infinity])(
    'rejeita preço inválido: %s',
    (precoCentavos) => {
      expect(
        validarServico({
          ...servicoValido,
          precoCentavos,
        }).precoCentavos
      ).toBeDefined();
    }
  );

  it('remove espaços desnecessários dos textos', () => {
    expect(
      normalizarDadosServico({
        ...servicoValido,
        nome: '  Instalação elétrica  ',
      }).nome
    ).toBe('Instalação elétrica');
  });
});

describe('Conversão de preços', () => {
  it.each([
    ['80', 8000],
    ['80,50', 8050],
    ['125,99', 12599],
    ['0,01', 1],
  ])('converte %s para %i centavos', (entrada, esperado) => {
    expect(converterPrecoParaCentavos(entrada)).toBe(esperado);
  });

  it.each(['', 'abc', '0', '-10', '10,999', '10.50'])(
    'rejeita o preço inválido: %s',
    (entrada) => {
      expect(converterPrecoParaCentavos(entrada)).toBeNull();
    }
  );
});
