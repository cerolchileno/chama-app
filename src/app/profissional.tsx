
import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  buscarProfissionalPorId,
  formatarPrecoCentavos,
  PRESTADOR_DEMONSTRACAO_ID,
} from '../constants/profissionais';

import {
  listarServicosPrestador,
  type ServicoPrestador,
} from '../constants/servicosPrestador';

export default function ProfissionalScreen() {
  const { id, servico } = useLocalSearchParams<{
    id?: string;
    servico?: string;
  }>();

  const profissional = buscarProfissionalPorId(id ?? '');

  const prestadorDemonstracao =
    profissional?.id === PRESTADOR_DEMONSTRACAO_ID;

  const [servicos, setServicos] = useState<ServicoPrestador[]>([]);
  const [servicoSelecionadoId, setServicoSelecionadoId] =
    useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      if (!prestadorDemonstracao) {
        setServicos([]);
        setServicoSelecionadoId(null);
        setCarregando(false);
        setErro(false);

        return () => {
          ativo = false;
        };
      }

      async function carregar() {
        setCarregando(true);
        setErro(false);

        try {
          const lista = await listarServicosPrestador(
            PRESTADOR_DEMONSTRACAO_ID
          );

          if (!ativo) return;

          const ativos = lista.filter((item) => item.ativo);

          setServicos(ativos);

          setServicoSelecionadoId((anterior) => {
            if (
              anterior &&
              ativos.some((item) => item.id === anterior)
            ) {
              return anterior;
            }

            return ativos[0]?.id ?? null;
          });
        } catch (error) {
          console.error('Erro ao carregar serviços:', error);

          if (ativo) {
            setErro(true);
            setServicos([]);
            setServicoSelecionadoId(null);
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      void carregar();

      return () => {
        ativo = false;
      };
    }, [prestadorDemonstracao])
  );

  const servicoSelecionado = servicos.find(
    (item) => item.id === servicoSelecionadoId
  );

  function solicitarServico() {
    if (!profissional) {
      Alert.alert(
        'Profissional indisponível',
        'Não foi possível identificar este profissional.'
      );
      return;
    }

    if (prestadorDemonstracao) {
      if (!servicoSelecionado) {
        Alert.alert(
          'Selecione um serviço',
          'Escolha um serviço disponível antes de continuar.'
        );
        return;
      }

      router.push({
        pathname: '/solicitar',
        params: {
          profissional: profissional.nome,
          prestadorId: profissional.id,
          servico: servicoSelecionado.nome,
          servicoId: servicoSelecionado.id,
        },
      });

      return;
    }

    router.push({
      pathname: '/solicitar',
      params: {
        profissional: profissional.nome,
        prestadorId: profissional.id,
        servico: servico || 'Serviço',
      },
    });
  }

  if (!profissional) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons
            name="person-circle-outline"
            size={65}
            color="#F04B2F"
          />
          <Text style={styles.notFoundTitle}>
            Profissional não encontrado
          </Text>
          <TouchableOpacity
            style={styles.backAction}
            onPress={() => router.back()}
          >
            <Text style={styles.backActionText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() =>
              Alert.alert(
                'Favoritos',
                'O recurso de favoritos será disponibilizado futuramente.'
              )
            }
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color="#F04B2F"
            />
          </TouchableOpacity>

          <View style={styles.heroAvatar}>
            <Ionicons
              name="person"
              size={75}
              color="#F04B2F"
            />
          </View>
        </View>

        <View style={styles.profile}>
          <Text style={styles.name}>
            {profissional.nome}
          </Text>

          <View style={styles.ratingRow}>
            {profissional.nota !== null ? (
              <>
                <Ionicons
                  name="star"
                  size={18}
                  color="#FFB000"
                />

                <Text style={styles.rating}>
                  {profissional.nota}
                </Text>

                <Text style={styles.reviews}>
                  ({profissional.avaliacoes} avaliações)
                </Text>
              </>
            ) : (
              <Text style={styles.reviews}>
                Ainda sem avaliações
              </Text>
            )}
          </View>

          <Text style={styles.service}>
            {prestadorDemonstracao
              ? 'Serviços cadastrados'
              : servico || 'Serviços profissionais'}
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons
                name="location-outline"
                size={22}
                color="#1F2328"
              />
              <Text style={styles.statValue}>
                {profissional.distancia ?? '—'}
              </Text>
              <Text style={styles.statLabel}>
                {profissional.distancia
                  ? 'Maricá, RJ'
                  : 'Não informada'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Ionicons
                name="briefcase-outline"
                size={22}
                color="#1F2328"
              />
              <Text style={styles.statValue}>
                {profissional.servicosRealizados !== null
                  ? `${profissional.servicosRealizados}+`
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>
                serviços realizados
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#1F2328"
              />
              <Text style={styles.statValue}>
                {profissional.experiencia ?? '—'}
              </Text>
              <Text style={styles.statLabel}>
                experiência
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sobre mim
            </Text>
            <Text style={styles.about}>
              {prestadorDemonstracao
                ? 'Perfil demonstrativo utilizado para visualizar os serviços cadastrados no CHAMA.'
                : 'Profissional especializado em serviços residenciais, buscando oferecer atendimento com qualidade, responsabilidade e pontualidade.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Serviços oferecidos
            </Text>

            {prestadorDemonstracao ? (
              carregando ? (
                <ActivityIndicator
                  size="large"
                  color="#F04B2F"
                />
              ) : erro ? (
                <Text style={styles.emptyText}>
                  Não foi possível carregar os serviços.
                </Text>
              ) : servicos.length === 0 ? (
                <Text style={styles.emptyText}>
                  Este profissional não possui serviços ativos.
                </Text>
              ) : (
                <View style={styles.servicesList}>
                  {servicos.map((item) => {
                    const selecionado =
                      servicoSelecionadoId === item.id;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.serviceCard,
                          selecionado &&
                            styles.serviceCardSelected,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setServicoSelecionadoId(item.id)
                        }
                      >
                        <View style={styles.serviceCardHeader}>
                          <Ionicons
                            name={
                              selecionado
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={23}
                            color={
                              selecionado
                                ? '#F04B2F'
                                : '#888'
                            }
                          />

                          <View style={styles.serviceCardInfo}>
                            <Text style={styles.serviceName}>
                              {item.nome}
                            </Text>
                            <Text style={styles.serviceCategory}>
                              {item.categoria}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.serviceDescription}>
                          {item.descricao}
                        </Text>

                        <Text style={styles.servicePrice}>
                          {formatarPrecoCentavos(
                            item.precoCentavos
                          )}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )
            ) : (
              <View style={styles.tags}>
                {[servico || 'Serviços gerais', 'Instalações', 'Manutenção', 'Reparos em geral'].map(
                  (item, index) => (
                    <View key={`${item}-${index}`} style={styles.tag}>
                      <Text style={styles.tagText}>
                        {item}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Avaliações
            </Text>

            {prestadorDemonstracao ? (
              <Text style={styles.emptyText}>
                Este profissional ainda não possui avaliações.
              </Text>
            ) : (
              <View style={styles.review}>
                <View style={styles.reviewAvatar}>
                  <Ionicons
                    name="person"
                    size={20}
                    color="#F04B2F"
                  />
                </View>

                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>
                    Juliana M.
                  </Text>

                  <View style={styles.reviewRating}>
                    <Ionicons
                      name="star"
                      size={14}
                      color="#FFB000"
                    />
                    <Text style={styles.reviewScore}>
                      5,0
                    </Text>
                  </View>

                  <Text style={styles.reviewText}>
                    Excelente profissional. Atendimento rápido e serviço de qualidade.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.requestButton,
            prestadorDemonstracao &&
              (carregando ||
                erro ||
                !servicoSelecionado) &&
              styles.requestButtonDisabled,
          ]}
          disabled={
            prestadorDemonstracao &&
            (carregando || erro || !servicoSelecionado)
          }
          onPress={solicitarServico}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.requestButtonText}>
            Solicitar serviço
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingBottom: 110,
  },
  hero: {
    height: 240,
    backgroundColor: '#1F2328',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroAvatar: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    padding: 22,
  },
  name: {
    fontSize: 27,
    fontWeight: '900',
    color: '#1F2328',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  rating: {
    fontWeight: '800',
    fontSize: 15,
  },
  reviews: {
    color: '#777',
    fontSize: 13,
  },
  service: {
    color: '#F04B2F',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 25,
    backgroundColor: '#F7F7F7',
    borderRadius: 17,
    paddingVertical: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },
  statLabel: {
    color: '#777',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#DDDDDD',
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F2328',
    marginBottom: 10,
  },
  about: {
    color: '#62666A',
    fontSize: 14,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
  },
  tagText: {
    color: '#444',
    fontSize: 12,
  },
  review: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '800',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  reviewScore: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  requestButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F04B2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  requestButtonDisabled: {
    opacity: 0.5,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  serviceCardSelected: {
    borderColor: '#F04B2F',
    backgroundColor: '#FFF8F6',
  },
  serviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  serviceCardInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2328',
  },
  serviceCategory: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },
  serviceDescription: {
    color: '#666',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  servicePrice: {
    color: '#F04B2F',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
  },
  emptyText: {
    color: '#777',
    fontSize: 13,
    lineHeight: 20,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 15,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2328',
    textAlign: 'center',
  },
  backAction: {
    backgroundColor: '#F04B2F',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
