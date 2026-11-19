
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PRESTADOR_DEMONSTRACAO_ID } from '@/constants/profissionais';
import {
  carregarSolicitacoes,
  listarSolicitacoesPorPrestador,
  type Solicitacao,
  solicitacoes,
} from '@/constants/solicitacoes';

type FiltroHistorico =
  | 'TODOS'
  | 'CONCLUIDA'
  | 'RECUSADA'
  | 'CANCELADA';

type Icone = React.ComponentProps<typeof Ionicons>['name'];

const FILTROS: {
  id: FiltroHistorico;
  titulo: string;
  icone: Icone;
}[] = [
  { id: 'TODOS', titulo: 'Todos', icone: 'albums-outline' },
  { id: 'CONCLUIDA', titulo: 'Concluídos', icone: 'checkmark-circle-outline' },
  { id: 'RECUSADA', titulo: 'Recusados', icone: 'close-circle-outline' },
  { id: 'CANCELADA', titulo: 'Cancelados', icone: 'ban-outline' },
];

function corStatus(status: Solicitacao['status']) {
  switch (status) {
    case 'CONCLUIDA':
      return '#1A9B63';
    case 'RECUSADA':
    case 'CANCELADA':
      return '#D63C3C';
    default:
      return '#F04B2F';
  }
}

function textoStatus(status: Solicitacao['status']) {
  switch (status) {
    case 'CONCLUIDA':
      return 'CONCLUÍDA';
    case 'RECUSADA':
      return 'RECUSADA';
    case 'CANCELADA':
      return 'CANCELADA';
    default:
      return status.replace('_', ' ');
  }
}

function iconeStatus(status: Solicitacao['status']): Icone {
  return status === 'CONCLUIDA'
    ? 'checkmark-circle'
    : 'close-circle';
}

export default function HistoricoScreen() {
  const { origem } = useLocalSearchParams<{ origem?: string }>();
  const ehPrestador = origem === 'prestador';
  const [historico, setHistorico] = useState<Solicitacao[]>([]);
  const [filtro, setFiltro] = useState<FiltroHistorico>('TODOS');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarHistorico() {
        try {
          await carregarSolicitacoes();
          if (!ativo) return;

          const pedidos = ehPrestador
            ? listarSolicitacoesPorPrestador(PRESTADOR_DEMONSTRACAO_ID)
            : solicitacoes;

          const encerrados = pedidos.filter(
            (pedido) =>
              pedido.status === 'CONCLUIDA' ||
              pedido.status === 'RECUSADA' ||
              pedido.status === 'CANCELADA'
          );

          setHistorico(encerrados.map((pedido) => ({ ...pedido })));
        } catch (error) {
          console.error('Erro ao carregar histórico:', error);
          if (ativo) {
            setHistorico([]);
          }
        }
      }

      void carregarHistorico();

      return () => {
        ativo = false;
      };
    }, [ehPrestador])
  );

  const contadores = useMemo(
    () => ({
      TODOS: historico.length,
      CONCLUIDA: historico.filter(
        (pedido) => pedido.status === 'CONCLUIDA'
      ).length,
      RECUSADA: historico.filter(
        (pedido) => pedido.status === 'RECUSADA'
      ).length,
      CANCELADA: historico.filter(
        (pedido) => pedido.status === 'CANCELADA'
      ).length,
    }),
    [historico]
  );

  const historicoFiltrado = useMemo(
    () =>
      filtro === 'TODOS'
        ? historico
        : historico.filter((pedido) => pedido.status === filtro),
    [historico, filtro]
  );

  function abrirAvaliacao(id: string) {
    router.push({
      pathname: '/avaliar',
      params: { id },
    });
  }

  function mensagemVazia() {
    switch (filtro) {
      case 'CONCLUIDA':
        return 'Nenhum serviço concluído foi encontrado.';
      case 'RECUSADA':
        return 'Nenhum serviço recusado foi encontrado.';
      case 'CANCELADA':
        return 'Nenhum serviço cancelado foi encontrado.';
      default:
        return 'Quando um serviço for concluído, recusado ou cancelado, ele aparecerá nesta tela.';
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Histórico</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <Text style={styles.headerDescription}>
          Consulte seus serviços encerrados.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="time-outline"
              size={25}
              color="#F04B2F"
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryNumber}>
              {historico.length}
            </Text>

            <Text style={styles.summaryText}>
              {historico.length === 1
                ? 'serviço no histórico'
                : 'serviços no histórico'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Serviços encerrados
          </Text>

          <Text style={styles.sectionDescription}>
            Serviços concluídos, recusados ou cancelados
            aparecem aqui.
          </Text>

          <Text style={styles.filterTitle}>
            Filtrar por status
          </Text>

          <View style={styles.filtersContainer}>
            {FILTROS.map((item) => {
              const selecionado = filtro === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterButton,
                    selecionado && styles.filterButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setFiltro(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selecionado,
                  }}
                >
                  <Ionicons
                    name={item.icone}
                    size={15}
                    color={
                      selecionado ? '#FFFFFF' : '#62666A'
                    }
                  />

                  <Text
                    style={[
                      styles.filterText,
                      selecionado && styles.filterTextActive,
                    ]}
                  >
                    {item.titulo}
                  </Text>

                  <View
                    style={[
                      styles.filterCount,
                      selecionado && styles.filterCountActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterCountText,
                        selecionado &&
                          styles.filterCountTextActive,
                      ]}
                    >
                      {contadores[item.id]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.resultCount}>
            {historicoFiltrado.length === 1
              ? '1 serviço encontrado'
              : `${historicoFiltrado.length} serviços encontrados`}
          </Text>

          {historicoFiltrado.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="time-outline"
                  size={42}
                  color="#F04B2F"
                />
              </View>

              <Text style={styles.emptyTitle}>
                {filtro === 'TODOS'
                  ? 'Histórico vazio'
                  : 'Nenhum resultado'}
              </Text>

              <Text style={styles.emptyDescription}>
                {mensagemVazia()}
              </Text>

              {filtro !== 'TODOS' && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  activeOpacity={0.8}
                  onPress={() => setFiltro('TODOS')}
                >
                  <Text style={styles.clearFilterText}>
                    Ver todos os serviços
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.list}>
              {historicoFiltrado.map((pedido) => (
                <View
                  key={pedido.id}
                  style={styles.historyCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.serviceIcon}>
                      <Ionicons
                        name="construct-outline"
                        size={25}
                        color="#F04B2F"
                      />
                    </View>

                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>
                        {pedido.servico}
                      </Text>

                      <Text style={styles.professionalName}>
                        {pedido.profissional}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: `${corStatus(
                            pedido.status
                          )}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={iconeStatus(pedido.status)}
                        size={14}
                        color={corStatus(pedido.status)}
                      />

                      <Text
                        style={[
                          styles.statusText,
                          { color: corStatus(pedido.status) },
                        ]}
                      >
                        {textoStatus(pedido.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={17}
                      color="#777777"
                    />
                    <Text style={styles.detailText}>
                      {pedido.data}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={17}
                      color="#777777"
                    />
                    <Text style={styles.detailText}>
                      {pedido.endereco}
                    </Text>
                  </View>

                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionLabel}>
                      Descrição
                    </Text>
                    <Text style={styles.description}>
                      {pedido.descricao}
                    </Text>
                  </View>

                  {!ehPrestador &&
                    pedido.status === 'CONCLUIDA' &&
                    !pedido.avaliacao && (
                      <>
                        <View style={styles.completedMessage}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={18}
                            color="#1A9B63"
                          />
                          <Text
                            style={styles.completedMessageText}
                          >
                            Serviço finalizado com sucesso
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.ratingButton}
                          activeOpacity={0.8}
                          onPress={() =>
                            abrirAvaliacao(pedido.id)
                          }
                        >
                          <Ionicons
                            name="star"
                            size={19}
                            color="#FFFFFF"
                          />
                          <Text style={styles.ratingButtonText}>
                            Avaliar atendimento
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}

                  {pedido.status === 'CONCLUIDA' &&
                    pedido.avaliacao && (
                      <View style={styles.ratingResult}>
                        <View style={styles.ratingResultHeader}>
                          <View>
                            <Text
                              style={styles.ratingResultLabel}
                            >
                              {ehPrestador ? 'Avaliação recebida' : 'Sua avaliação'}
                            </Text>

                            <View
                              style={styles.ratingResultStars}
                            >
                              {[1, 2, 3, 4, 5].map(
                                (estrela) => (
                                  <Ionicons
                                    key={estrela}
                                    name={
                                      estrela <=
                                      pedido.avaliacao!.nota
                                        ? 'star'
                                        : 'star-outline'
                                    }
                                    size={18}
                                    color="#FFB000"
                                  />
                                )
                              )}
                            </View>
                          </View>

                          <View style={styles.ratingScore}>
                            <Text
                              style={styles.ratingScoreText}
                            >
                              {pedido.avaliacao.nota}/5
                            </Text>
                          </View>
                        </View>

                        {pedido.avaliacao.comentario ? (
                          <Text style={styles.ratingComment}>
                            “{pedido.avaliacao.comentario}”
                          </Text>
                        ) : (
                          <Text style={styles.noCommentText}>
                            Avaliação realizada sem comentário.
                          </Text>
                        )}

                        <View style={styles.ratingDateRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#8A8A8A"
                          />
                          <Text style={styles.ratingDate}>
                            Avaliado em {pedido.avaliacao.data}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#1F2328',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 27,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  headerPlaceholder: {
    width: 42,
  },
  headerDescription: {
    color: '#BFC3C7',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    marginLeft: 13,
  },
  summaryNumber: {
    color: '#1F2328',
    fontSize: 21,
    fontWeight: '900',
  },
  summaryText: {
    color: '#777777',
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 27,
  },
  sectionTitle: {
    color: '#1F2328',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionDescription: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 17,
  },
  filterTitle: {
    color: '#34383D',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 11,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#F04B2F',
    borderColor: '#F04B2F',
  },
  filterText: {
    color: '#62666A',
    fontSize: 11,
    fontWeight: '800',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  filterCountText: {
    color: '#62666A',
    fontSize: 10,
    fontWeight: '900',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  resultCount: {
    color: '#777777',
    fontSize: 11,
    marginBottom: 13,
  },
  list: {
    gap: 14,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  serviceInfo: {
    flex: 1,
    minWidth: 0,
  },
  serviceName: {
    color: '#1F2328',
    fontSize: 15,
    fontWeight: '800',
  },
  professionalName: {
    color: '#777777',
    fontSize: 11,
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  detailText: {
    flex: 1,
    color: '#62666A',
    fontSize: 12,
  },
  descriptionBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },
  descriptionLabel: {
    color: '#1F2328',
    fontSize: 11,
    fontWeight: '800',
  },
  description: {
    color: '#62666A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFFAF5',
    borderRadius: 11,
    padding: 11,
    marginTop: 13,
  },
  completedMessageText: {
    color: '#1A9B63',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingButton: {
    height: 48,
    backgroundColor: '#F04B2F',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 10,
  },
  ratingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  ratingResult: {
    backgroundColor: '#FFFAEC',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#F6E4A8',
    padding: 14,
    marginTop: 13,
  },
  ratingResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingResultLabel: {
    color: '#1F2328',
    fontSize: 12,
    fontWeight: '900',
  },
  ratingResultStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 5,
  },
  ratingScore: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  ratingScoreText: {
    color: '#1F2328',
    fontSize: 11,
    fontWeight: '900',
  },
  ratingComment: {
    color: '#62666A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  noCommentText: {
    color: '#8A8A8A',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 12,
  },
  ratingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  ratingDate: {
    color: '#8A8A8A',
    fontSize: 10,
  },
  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 35,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 23,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#1F2328',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 17,
  },
  emptyDescription: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
  },
  clearFilterButton: {
    backgroundColor: '#F04B2F',
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 12,
    marginTop: 20,
  },
  clearFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomSpace: {
    height: 20,
  },
});
