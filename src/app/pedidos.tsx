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
      setPedidos([...solicitacoes]);
    }, [])
  );

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
    return status.replace('_', ' ');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
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

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Acompanhe seus serviços
        </Text>

        <Text style={styles.subtitle}>
          Aqui você encontra as solicitações feitas pelo
          CHAMA.
        </Text>

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
              Nenhum pedido ainda
            </Text>

            <Text style={styles.emptyDescription}>
              Quando você solicitar um serviço, ele
              aparecerá aqui.
            </Text>

            <TouchableOpacity
              style={styles.findButton}
              onPress={() =>
                router.replace('/cliente')
              }
            >
              <Text style={styles.findButtonText}>
                Encontrar profissional
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

                  <Text style={styles.professional}>
                    {pedido.profissional}
                  </Text>
                </View>

                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        `${corStatus(pedido.status)}15`,
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
                    {textoStatus(pedido.status)}
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

              {pedido.status === 'PENDENTE' && (
                <View style={styles.waiting}>
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color="#F04B2F"
                  />

                  <Text style={styles.waitingText}>
                    Aguardando resposta do profissional
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

  headerSpace: {
    width: 40,
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
    marginTop: 7,
    marginBottom: 25,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
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
    textAlign: 'center',
    marginTop: 7,
  },

  findButton: {
    backgroundColor: '#F04B2F',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 22,
  },

  findButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
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
});