import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

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
  Solicitacao,
  solicitacoes,
} from '@/constants/solicitacoes';

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<Solicitacao[]>([]);

  function carregarHistorico() {
    const encerrados = solicitacoes.filter(
      (pedido) =>
        pedido.status === 'CONCLUIDA' ||
        pedido.status === 'RECUSADA' ||
        pedido.status === 'CANCELADA'
    );

    setHistorico([...encerrados]);
  }

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [])
  );

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

  function iconeStatus(
    status: Solicitacao['status']
  ) {
    if (status === 'CONCLUIDA') {
      return 'checkmark-circle';
    }

    return 'close-circle';
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
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Histórico
          </Text>

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

          {historico.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="time-outline"
                  size={42}
                  color="#F04B2F"
                />
              </View>

              <Text style={styles.emptyTitle}>
                Histórico vazio
              </Text>

              <Text style={styles.emptyDescription}>
                Quando um serviço for concluído, recusado
                ou cancelado, ele aparecerá nesta tela.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {historico.map((pedido) => (
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
                          backgroundColor:
                            `${corStatus(
                              pedido.status
                            )}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          iconeStatus(
                            pedido.status
                          ) as any
                        }
                        size={14}
                        color={corStatus(
                          pedido.status
                        )}
                      />

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

                  {pedido.status === 'CONCLUIDA' && (
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

  bottomSpace: {
    height: 20,
  },
});