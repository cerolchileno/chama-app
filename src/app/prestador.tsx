
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRESTADOR_DEMONSTRACAO_ID } from '@/constants/profissionais';
import {
  alterarStatusSolicitacao,
  carregarSolicitacoes,
  listarSolicitacoesPorPrestador,
  type Solicitacao,
  type StatusSolicitacao,
} from '@/constants/solicitacoes';

const COR = '#F04B2F';
const ESCURO = '#1F2328';

export default function PrestadorScreen() {
  const [pedidos, setPedidos] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [operacaoEmAndamento, setOperacaoEmAndamento] =
    useState<string | null>(null);

  const operacaoPendente = useRef(false);
  const telaAtiva = useRef(false);

  const carregarPedidos = useCallback(() => {
    setPedidos(
      listarSolicitacoesPorPrestador(
        PRESTADOR_DEMONSTRACAO_ID
      )
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      telaAtiva.current = true;
      setCarregando(true);

      async function inicializar() {
        try {
          await carregarSolicitacoes();

          if (telaAtiva.current) {
            carregarPedidos();
          }
        } catch (error) {
          console.error(
            'Erro ao carregar solicitações do prestador:',
            error
          );

          if (telaAtiva.current) {
            Alert.alert(
              'Erro ao carregar',
              'Não foi possível carregar as solicitações. Tente novamente.'
            );
          }
        } finally {
          if (telaAtiva.current) {
            setCarregando(false);
          }
        }
      }

      void inicializar();

      return () => {
        telaAtiva.current = false;
      };
    }, [carregarPedidos])
  );

  async function executarAlteracao(
    id: string,
    novoStatus: StatusSolicitacao,
    tituloSucesso: string,
    mensagemSucesso: string
  ) {
    if (operacaoPendente.current) return;

    operacaoPendente.current = true;
    setOperacaoEmAndamento(id);

    try {
      const sucesso = await alterarStatusSolicitacao(
        id,
        novoStatus,
        PRESTADOR_DEMONSTRACAO_ID
      );

      if (!sucesso) {
        Alert.alert(
          'Não foi possível atualizar',
          'A solicitação não pertence a este prestador ou a alteração de status não é permitida.'
        );
        return;
      }

      if (telaAtiva.current) {
        carregarPedidos();
        Alert.alert(tituloSucesso, mensagemSucesso);
      }
    } catch (error) {
      console.error(
        'Erro ao atualizar status da solicitação:',
        error
      );

      if (telaAtiva.current) {
        Alert.alert(
          'Erro ao salvar',
          'Não foi possível salvar a alteração no dispositivo. Tente novamente.'
        );
      }
    } finally {
      operacaoPendente.current = false;

      if (telaAtiva.current) {
        setOperacaoEmAndamento(null);
      }
    }
  }

  function aceitarPedido(id: string) {
    void executarAlteracao(
      id,
      'ACEITA',
      'Solicitação aceita',
      'O cliente poderá acompanhar a atualização pelo CHAMA.'
    );
  }

  function recusarPedido(id: string) {
    if (operacaoPendente.current) return;

    Alert.alert(
      'Recusar solicitação',
      'Deseja realmente recusar este serviço?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: () => {
            void executarAlteracao(
              id,
              'RECUSADA',
              'Solicitação recusada',
              'O pedido foi marcado como recusado.'
            );
          },
        },
      ]
    );
  }

  function iniciarServico(id: string) {
    void executarAlteracao(
      id,
      'EM_ANDAMENTO',
      'Serviço iniciado',
      'O pedido agora está em andamento.'
    );
  }

  function concluirServico(id: string) {
    void executarAlteracao(
      id,
      'CONCLUIDA',
      'Serviço concluído',
      'O atendimento foi marcado como concluído.'
    );
  }

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
        return COR;
    }
  }

  function textoStatus(status: Solicitacao['status']) {
    const nomes: Record<Solicitacao['status'], string> = {
      PENDENTE: 'Pendente',
      ACEITA: 'Aceita',
      RECUSADA: 'Recusada',
      EM_ANDAMENTO: 'Em andamento',
      CONCLUIDA: 'Concluída',
      CANCELADA: 'Cancelada',
    };

    return nomes[status];
  }

  const pendentes = pedidos.filter(
    (pedido) => pedido.status === 'PENDENTE'
  ).length;

  const ativos = pedidos.filter(
    (pedido) =>
      pedido.status === 'ACEITA' ||
      pedido.status === 'EM_ANDAMENTO'
  ).length;

  const concluidos = pedidos.filter(
    (pedido) => pedido.status === 'CONCLUIDA'
  ).length;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.brand}>CHAMA</Text>
              <Text style={styles.mode}>
                Área do profissional
              </Text>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() =>
                Alert.alert(
                  'Notificações',
                  pendentes > 0
                    ? `Você possui ${pendentes} solicitação(ões) aguardando resposta.`
                    : 'Você não possui novas solicitações.'
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />

              {pendentes > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationNumber}>
                    {pendentes}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.greeting}>
            Olá, profissional!
          </Text>

          <Text style={styles.headerDescription}>
            Acompanhe suas solicitações e atendimentos.
          </Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="time-outline"
                size={24}
                color={COR}
              />
            </View>

            <Text style={styles.summaryNumber}>
              {pendentes}
            </Text>

            <Text style={styles.summaryLabel}>
              Pendentes
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="construct-outline"
                size={24}
                color={COR}
              />
            </View>

            <Text style={styles.summaryNumber}>
              {ativos}
            </Text>

            <Text style={styles.summaryLabel}>
              Em atendimento
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={COR}
              />
            </View>

            <Text style={styles.summaryNumber}>
              {concluidos}
            </Text>

            <Text style={styles.summaryLabel}>
              Concluídos
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Solicitações
          </Text>

          <Text style={styles.sectionDescription}>
            Serviços enviados para você
          </Text>

          {carregando ? (
            <View style={styles.empty}>
              <ActivityIndicator
                size="large"
                color={COR}
              />

              <Text style={styles.emptyDescription}>
                Carregando solicitações...
              </Text>
            </View>
          ) : pedidos.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="briefcase-outline"
                  size={40}
                  color={COR}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Nenhuma solicitação
              </Text>

              <Text style={styles.emptyDescription}>
                Quando um cliente solicitar seus serviços,
                o pedido aparecerá aqui.
              </Text>
            </View>
          ) : (
            pedidos.map((pedido) => {
              const processando =
                operacaoEmAndamento === pedido.id;

              const bloqueado =
                operacaoEmAndamento !== null;

              return (
                <View
                  key={pedido.id}
                  style={styles.requestCard}
                >
                  <View style={styles.requestHeader}>
                    <View style={styles.serviceIcon}>
                      <Ionicons
                        name="construct-outline"
                        size={26}
                        color={COR}
                      />
                    </View>

                    <View style={styles.requestInfo}>
                      <Text style={styles.serviceName}>
                        {pedido.servico}
                      </Text>

                      <Text style={styles.requestDate}>
                        Solicitado em {pedido.data}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
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

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#777777"
                    />

                    <Text style={styles.detailText}>
                      {pedido.endereco}
                    </Text>
                  </View>

                  <Text style={styles.descriptionLabel}>
                    Descrição do serviço
                  </Text>

                  <Text style={styles.description}>
                    {pedido.descricao}
                  </Text>

                  {processando && (
                    <View style={styles.processingRow}>
                      <ActivityIndicator
                        size="small"
                        color={COR}
                      />

                      <Text style={styles.processingText}>
                        Salvando alteração...
                      </Text>
                    </View>
                  )}

                  {pedido.status === 'PENDENTE' && (
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[
                          styles.rejectButton,
                          bloqueado &&
                            styles.disabledButton,
                        ]}
                        disabled={bloqueado}
                        onPress={() =>
                          recusarPedido(pedido.id)
                        }
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color="#D63C3C"
                        />

                        <Text style={styles.rejectText}>
                          Recusar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.acceptButton,
                          bloqueado &&
                            styles.disabledButton,
                        ]}
                        disabled={bloqueado}
                        onPress={() =>
                          aceitarPedido(pedido.id)
                        }
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="#FFFFFF"
                        />

                        <Text style={styles.acceptText}>
                          Aceitar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {pedido.status === 'ACEITA' && (
                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        bloqueado &&
                          styles.disabledButton,
                      ]}
                      disabled={bloqueado}
                      onPress={() =>
                        iniciarServico(pedido.id)
                      }
                    >
                      <Ionicons
                        name="play-outline"
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text
                        style={styles.primaryButtonText}
                      >
                        Iniciar serviço
                      </Text>
                    </TouchableOpacity>
                  )}

                  {pedido.status === 'EM_ANDAMENTO' && (
                    <TouchableOpacity
                      style={[
                        styles.completeButton,
                        bloqueado &&
                          styles.disabledButton,
                      ]}
                      disabled={bloqueado}
                      onPress={() =>
                        concluirServico(pedido.id)
                      }
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text
                        style={styles.primaryButtonText}
                      >
                        Concluir serviço
                      </Text>
                    </TouchableOpacity>
                  )}

                  {pedido.status === 'CONCLUIDA' && (
                    <View style={styles.completedBox}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#1A9B63"
                      />

                      <Text style={styles.completedText}>
                        Atendimento concluído
                      </Text>
                    </View>
                  )}

                  {(pedido.status === 'RECUSADA' ||
                    pedido.status === 'CANCELADA') && (
                    <View style={styles.rejectedBox}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color="#D63C3C"
                      />

                      <Text style={styles.rejectedText}>
                        {pedido.status === 'RECUSADA'
                          ? 'Solicitação recusada'
                          : 'Solicitação cancelada'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="home"
            size={23}
            color={COR}
          />

          <Text style={styles.navTextActive}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/meus-servicos')}
        >
          <Ionicons
            name="briefcase-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Serviços
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/historico')}
        >
          <Ionicons
            name="time-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Histórico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push('/perfil-prestador')
          }
        >
          <Ionicons
            name="person-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: ESCURO,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  brand: {
    color: COR,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 2,
  },
  mode: {
    color: '#BFC3C7',
    fontSize: 11,
    marginTop: 3,
  },
  notificationButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationNumber: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  headerDescription: {
    color: '#C9CDD0',
    fontSize: 14,
    marginTop: 6,
  },
  summary: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 20,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNumber: {
    color: ESCURO,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 7,
  },
  summaryLabel: {
    color: '#777777',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 27,
  },
  sectionTitle: {
    color: ESCURO,
    fontSize: 21,
    fontWeight: '900',
  },
  sectionDescription: {
    color: '#777777',
    fontSize: 12,
    marginTop: 3,
    marginBottom: 17,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 35,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: ESCURO,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 17,
  },
  emptyDescription: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  requestInfo: {
    flex: 1,
  },
  serviceName: {
    color: ESCURO,
    fontSize: 15,
    fontWeight: '800',
  },
  requestDate: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 9,
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
  },
  detailText: {
    flex: 1,
    color: '#62666A',
    fontSize: 12,
  },
  descriptionLabel: {
    color: ESCURO,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 15,
  },
  description: {
    color: '#62666A',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  processingText: {
    color: '#777777',
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 18,
  },
  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#F1B5B5',
    backgroundColor: '#FFF5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  rejectText: {
    color: '#D63C3C',
    fontWeight: '800',
    fontSize: 13,
  },
  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    backgroundColor: COR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  primaryButton: {
    height: 49,
    borderRadius: 13,
    backgroundColor: '#2878D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },
  completeButton: {
    height: 49,
    borderRadius: 13,
    backgroundColor: '#1A9B63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFFAF5',
    borderRadius: 12,
    padding: 12,
    marginTop: 17,
  },
  completedText: {
    color: '#1A9B63',
    fontSize: 12,
    fontWeight: '800',
  },
  rejectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF3F3',
    borderRadius: 12,
    padding: 12,
    marginTop: 17,
  },
  rejectedText: {
    color: '#D63C3C',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 7,
  },
  navItem: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    color: '#737373',
    fontSize: 10,
  },
  navTextActive: {
    color: COR,
    fontSize: 10,
    fontWeight: '700',
  },
});
