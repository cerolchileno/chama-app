
import { describe, expect, it } from 'vitest';

import {
  buscarProfissionalPorId,
  formatarPrecoCentavos,
  listarProfissionais,
  PRESTADOR_DEMONSTRACAO_ID,
} from './profissionais';

describe('Catálogo centralizado de profissionais', () => {
  it('lista os quatro profissionais existentes', () => {
    const profissionais = listarProfissionais();

    expect(profissionais).toHaveLength(5);

    expect(
      profissionais.filter(
        (profissional) =>
          profissional.id !== PRESTADOR_DEMONSTRACAO_ID
      )
    ).toHaveLength(4);
  });

  it('mantém os dados dos profissionais existentes', () => {
    const carlos = buscarProfissionalPorId('1');

    expect(carlos).not.toBeNull();
    expect(carlos?.nome).toBe('Carlos Silva');
    expect(carlos?.nota).toBe('4,9');
    expect(carlos?.precoInicialCentavos).toBe(8000);
    expect(carlos?.servicosRealizados).toBe(120);
  });

  it('inclui um prestador demonstrativo separado', () => {
    const prestador = buscarProfissionalPorId(
      PRESTADOR_DEMONSTRACAO_ID
    );

    expect(prestador?.nome).toBe('Profissional CHAMA');
    expect(prestador?.nota).toBeNull();
    expect(prestador?.distancia).toBeNull();
    expect(prestador?.precoInicialCentavos).toBeNull();
  });

  it('retorna null para identificadores desconhecidos', () => {
    expect(buscarProfissionalPorId('inexistente')).toBeNull();
  });

  it('impede alterações externas no catálogo', () => {
    const profissionais = listarProfissionais();

    profissionais[0].nome = 'Nome alterado';

    expect(buscarProfissionalPorId('1')?.nome).toBe(
      'Carlos Silva'
    );
  });

  it('formata preços em reais', () => {
    expect(formatarPrecoCentavos(8000)).toBe('R$ 80,00');
    expect(formatarPrecoCentavos(12550)).toBe('R$ 125,50');
  });

  it('não formata preços inválidos ou inexistentes', () => {
    expect(formatarPrecoCentavos(null)).toBeNull();
    expect(formatarPrecoCentavos(-100)).toBeNull();
    expect(formatarPrecoCentavos(12.5)).toBeNull();
  });
});
