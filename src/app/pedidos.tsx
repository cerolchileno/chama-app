
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
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

import {
  type Solicitacao,
  solicitacoes,
} from '@/constants/solicitacoes';

type FiltroPedidos =
  | 'TODOS'
  | 'PENDENTE'
  | 'ACEITA'
  | 'EM_ANDAMENTO';

type Icone = React.ComponentProps<typeof Ionicons>['name'];

const FILTROS: {
  id: FiltroPedidos;
  titulo: string;
  icone: Icone;
}[] = [
  { id: 'TODOS', titulo: 'Todos', icone: 'albums-outline' },
  { id: 'PENDENTE', titulo: 'Pendentes', icone: 'time-outline' },
  { id: 'ACEITA', titulo: 'Aceitos', icone: 'checkmark-circle-outline' },
  { id: 'EM_ANDAMENTO', titulo: 'Em andamento', icone: 'construct-outline' },
];

function corStatus(status: Solicitacao['status']) {
  switch (status) {
    case 'ACEITA':
      return '#2878D0';
    case 'EM_ANDAMENTO':
      return '#D88400';
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
    case 'PENDENTE':
      return 'PENDENTE';
    case 'ACEITA':
      return 'ACEITA';
    case 'EM_ANDAMENTO':
      return 'EM ANDAMENTO';
    case 'CONCLUIDA':
      return 'CONCLUÍDA';
    case 'RECUSADA':
      return 'RECUSADA';
    case 'CANCELADA':
      return 'CANCELADA';
    default:
      return status;
  }
}

function mensagemStatus(status: Solicitacao['status']) {
  switch (status) {
    case 'PENDENTE':
      return {
        texto: 'Aguardando resposta do profissional',
        icone: 'time-outline' as Icone,
        estilo: styles.waiting,
        estiloTexto: styles.waitingText,
      };
    case 'ACEITA':
      return {
        texto: 'Solicitação aceita pelo profissional',
        icone: 'checkmark-circle-outline' as Icone,
        estilo: styles.accepted,
        estiloTexto: styles.acceptedText,
      };
    default:
      return {
        texto: 'Serviço em andamento',
        icone: 'construct-outline' as Icone,
        estilo: styles.inProgress,
        estiloTexto: styles.inProgressText,
      };
  }
}

export default function PedidosScreen() {
  const [pedidos, setPedidos] = useState<Solicitacao[]>([]);
  const [filtro, setFiltro] = useState<FiltroPedidos>('TODOS');

  useFocusEffect(
    useCallback(() => {
      const pedidosAtivos = solicitacoes.filter(
        (pedido) =>
          pedido.status === 'PENDENTE' ||
          pedido.status === 'ACEITA' ||
          pedido.status === 'EM_ANDAMENTO'
      );

      setPedidos([...pedidosAtivos]);
    }, [])
  );

  const contadores = useMemo(
    () => ({
      TODOS: pedidos.length,
      PENDENTE: pedidos.filter(
        (pedido) => pedido.status === 'PENDENTE'
      ).length,
      ACEITA: pedidos.filter(
        (pedido) => pedido.status === 'ACEITA'
      ).length,
      EM_ANDAMENTO: pedidos.filter(
        (pedido) => pedido.status === 'EM_ANDAMENTO'
      ).length,
    }),
    [pedidos]
  );

  const pedidosFiltrados = useMemo(
    () =>
      filtro === 'TODOS'
        ? pedidos
        : pedidos.filter((pedido) => pedido.status === filtro),
    [pedidos, filtro]
  );

  function mensagemVazia() {
    switch (filtro) {
      case 'PENDENTE':
        return 'Você não possui solicitações aguardando resposta.';
      case 'ACEITA':
        return 'Você não possui solicitações aceitas neste momento.';
      case 'EM_ANDAMENTO':
        return 'Você não possui serviços em andamento neste momento.';
      default:
        return 'Você não possui serviços pendentes, aceitos ou em andamento neste momento.';
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#1F2328"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Meus pedidos
        </Text>

        <TouchableOpacity
          style={styles.historyHeaderButton}
          activeOpacity={0.7}
          onPress={() => router.push('/historico')}
          accessibilityLabel="Abrir histórico"
        >
          <Ionicons
            name="time-outline"
            size={23}
            color="#F04B2F"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Acompanhe seus serviços
        </Text>

        <Text style={styles.subtitle}>
          Aqui você encontra os serviços que ainda estão
          em andamento pelo CHAMA.
        </Text>

        <TouchableOpacity
          style={styles.historyCard}
          activeOpacity={0.8}
          onPress={() => router.push('/historico')}
        >
          <View style={styles.historyIcon}>
            <Ionicons
              name="time-outline"
              size={25}
              color="#F04B2F"
            />
          </View>

          <View style={styles.historyInfo}>
            <Text style={styles.historyTitle}>
              Histórico de serviços
            </Text>

            <Text style={styles.historyDescription}>
              Consulte serviços concluídos, recusados ou
              cancelados.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#A0A0A0"
          />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Pedidos atuais
          </Text>

          {pedidos.length > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {pedidos.length}
              </Text>
            </View>
          )}
        </View>

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
          {pedidosFiltrados.length === 1
            ? '1 pedido encontrado'
            : `${pedidosFiltrados.length} pedidos encontrados`}
        </Text>

        {pedidosFiltrados.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={42}
                color="#F04B2F"
              />
            </View>

            <Text style={styles.emptyTitle}>
              {filtro === 'TODOS'
                ? 'Nenhum pedido em andamento'
                : 'Nenhum resultado'}
            </Text>

            <Text style={styles.emptyDescription}>
              {mensagemVazia()}
            </Text>

            {filtro === 'TODOS' ? (
              <>
                <TouchableOpacity
                  style={styles.findButton}
                  activeOpacity={0.8}
                  onPress={() => router.replace('/cliente')}
                >
                  <Ionicons
                    name="search-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.findButtonText}>
                    Encontrar profissional
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emptyHistoryButton}
                  activeOpacity={0.7}
                  onPress={() => router.push('/historico')}
                >
                  <Text style={styles.emptyHistoryText}>
                    Consultar histórico
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.findButton}
                activeOpacity={0.8}
                onPress={() => setFiltro('TODOS')}
              >
                <Ionicons
                  name="albums-outline"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.findButtonText}>
                  Ver todos os pedidos
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const aviso = mensagemStatus(pedido.status);

            return (
              <View
                key={pedido.id}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name="construct-outline"
                      size={25}
                      color="#F04B2F"
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.service}>
                      {pedido.servico}
                    </Text>

                    <Text style={styles.professional}>
                      {pedido.profissional}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.status,
                      {
                        backgroundColor: `${corStatus(
                          pedido.status
                        )}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: corStatus(pedido.status),
                        },
                      ]}
                    >
                      {textoStatus(pedido.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.line} />

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

                <View style={styles.detailRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={17}
                    color="#777777"
                  />
                  <Text style={styles.detailText}>
                    Solicitado em {pedido.data}
                  </Text>
                </View>

                <Text style={styles.description}>
                  {pedido.descricao}
                </Text>

                <View style={aviso.estilo}>
                  <Ionicons
                    name={aviso.icone}
                    size={17}
                    color={corStatus(pedido.status)}
                  />

                  <Text style={aviso.estiloTexto}>
                    {aviso.texto}
                  </Text>
                </View>
              </View>
            );
          })
        )}
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
    height: 65,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1F2328',
    fontSize: 19,
    fontWeight: '800',
  },
  historyHeaderButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#1F2328',
    fontSize: 25,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6E747A',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },
  historyIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    color: '#1F2328',
    fontSize: 14,
    fontWeight: '800',
  },
  historyDescription: {
    color: '#777777',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#1F2328',
    fontSize: 18,
    fontWeight: '900',
  },
  counter: {
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  counterText: {
    color: '#F04B2F',
    fontSize: 10,
    fontWeight: '900',
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
    marginBottom: 15,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 15,
  },
  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#1F2328',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#777777',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 7,
  },
  findButton: {
    backgroundColor: '#F04B2F',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  findButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emptyHistoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 4,
  },
  emptyHistoryText: {
    color: '#F04B2F',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 15,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  service: {
    color: '#1F2328',
    fontSize: 15,
    fontWeight: '800',
  },
  professional: {
    color: '#777777',
    fontSize: 12,
    marginTop: 3,
  },
  status: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
  },
  line: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  detailText: {
    color: '#666666',
    fontSize: 12,
    flex: 1,
  },
  description: {
    color: '#3F4347',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF1EE',
    borderRadius: 11,
    padding: 10,
    marginTop: 15,
  },
  waitingText: {
    color: '#F04B2F',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
  accepted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF5FD',
    borderRadius: 11,
    padding: 10,
    marginTop: 15,
  },
  acceptedText: {
    color: '#2878D0',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
  inProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7E8',
    borderRadius: 11,
    padding: 10,
    marginTop: 15,
  },
  inProgressText: {
    color: '#D88400',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
});
