import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Solicitacao,
  solicitacoes,
} from '@/constants/solicitacoes';

export default function PedidosScreen() {
  const [pedidos, setPedidos] =
    useState<Solicitacao[]>([]);

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

  function corStatus(
    status: Solicitacao['status']
  ) {
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

  function textoStatus(
    status: Solicitacao['status']
  ) {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
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
          onPress={() =>
            router.push('/historico')
          }
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
        {/* APRESENTAÇÃO */}

        <Text style={styles.title}>
          Acompanhe seus serviços
        </Text>

        <Text style={styles.subtitle}>
          Aqui você encontra os serviços que ainda
          estão em andamento pelo CHAMA.
        </Text>

        {/* BOTÃO HISTÓRICO */}

        <TouchableOpacity
          style={styles.historyCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push('/historico')
          }
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
              Consulte serviços concluídos, recusados
              ou cancelados.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#A0A0A0"
          />
        </TouchableOpacity>

        {/* PEDIDOS */}

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

        {pedidos.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={42}
                color="#F04B2F"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum pedido em andamento
            </Text>

            <Text style={styles.emptyDescription}>
              Você não possui serviços pendentes ou
              em andamento neste momento.
            </Text>

            <TouchableOpacity
              style={styles.findButton}
              activeOpacity={0.8}
              onPress={() =>
                router.replace('/cliente')
              }
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
              onPress={() =>
                router.push('/historico')
              }
            >
              <Text
                style={styles.emptyHistoryText}
              >
                Consultar histórico
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          pedidos.map((pedido) => (
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

                  <Text
                    style={styles.professional}
                  >
                    {pedido.profissional}
                  </Text>
                </View>

                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        `${corStatus(
                          pedido.status
                        )}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: corStatus(
                          pedido.status
                        ),
                      },
                    ]}
                  >
                    {textoStatus(
                      pedido.status
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.detailRow}>
                <Ionicons
                  name="location-outline"
                  size={17}
                  color="#777"
                />

                <Text style={styles.detailText}>
                  {pedido.endereco}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color="#777"
                />

                <Text style={styles.detailText}>
                  Solicitado em {pedido.data}
                </Text>
              </View>

              <Text style={styles.description}>
                {pedido.descricao}
              </Text>

              {/* PENDENTE */}

              {pedido.status === 'PENDENTE' && (
                <View style={styles.waiting}>
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color="#F04B2F"
                  />

                  <Text
                    style={styles.waitingText}
                  >
                    Aguardando resposta do
                    profissional
                  </Text>
                </View>
              )}

              {/* ACEITA */}

              {pedido.status === 'ACEITA' && (
                <View style={styles.accepted}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={17}
                    color="#2878D0"
                  />

                  <Text
                    style={styles.acceptedText}
                  >
                    Solicitação aceita pelo
                    profissional
                  </Text>
                </View>
              )}

              {/* EM ANDAMENTO */}

              {pedido.status ===
                'EM_ANDAMENTO' && (
                <View style={styles.inProgress}>
                  <Ionicons
                    name="construct-outline"
                    size={17}
                    color="#D88400"
                  />

                  <Text
                    style={styles.inProgressText}
                  >
                    Serviço em andamento
                  </Text>
                </View>
              )}
            </View>
          ))
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
  },

  emptyDescription: {
    color: '#777',
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
  },

  service: {
    color: '#1F2328',
    fontSize: 15,
    fontWeight: '800',
  },

  professional: {
    color: '#777',
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
    color: '#666',
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
  },
});