
import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  carregarEnderecosCliente,
  type EnderecoCliente,
} from '@/constants/enderecosCliente';

import {
  adicionarSolicitacao,
} from '@/constants/solicitacoes';

import {
  listarServicosPrestador,
} from '@/constants/servicosPrestador';

import {
  buscarProfissionalPorId,
  PRESTADOR_DEMONSTRACAO_ID,
} from '@/constants/profissionais';

const COLORS = {
  primary: '#F04B2F',
  dark: '#1F2328',
  background: '#F7F7F7',
  white: '#FFFFFF',
  muted: '#858B93',
  border: '#ECEEF0',
  soft: '#FFF1EE',
};

type ModoEndereco = 'SALVO' | 'MANUAL';

function formatarEndereco(endereco: EnderecoCliente): string {
  const complemento = endereco.complemento.trim()
    ? `, ${endereco.complemento.trim()}`
    : '';

  return (
    `${endereco.rua.trim()}, ${endereco.numero.trim()}` +
    complemento +
    ` - ${endereco.bairro.trim()}, ` +
    `${endereco.cidade.trim()}/${endereco.estado.trim()}` +
    ` - CEP ${endereco.cep.trim()}`
  );
}

export default function SolicitarScreen() {
  const {
    profissional,
    servico,
    prestadorId,
    servicoId,
  } = useLocalSearchParams<{
    profissional?: string;
    servico?: string;
    prestadorId?: string;
    servicoId?: string;
  }>();

  const [descricao, setDescricao] = useState('');
  const [enderecoManual, setEnderecoManual] = useState('');

  const [enderecosSalvos, setEnderecosSalvos] = useState<
    EnderecoCliente[]
  >([]);

  const [enderecoSelecionadoId, setEnderecoSelecionadoId] =
    useState<string | null>(null);

  const [modoEndereco, setModoEndereco] =
    useState<ModoEndereco>('MANUAL');

  const [carregandoEnderecos, setCarregandoEnderecos] =
    useState(true);

  const [enviando, setEnviando] = useState(false);

  // Proteção imediata contra dois toques antes
  // da atualização do estado do React.
  const envioEmAndamento = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarEnderecos() {
        setCarregandoEnderecos(true);

        try {
          const lista = await carregarEnderecosCliente();

          if (!ativo) return;

          setEnderecosSalvos(lista);

          setEnderecoSelecionadoId((idAnterior) => {
            if (
              idAnterior &&
              lista.some((item) => item.id === idAnterior)
            ) {
              return idAnterior;
            }

            return (
              lista.find((item) => item.principal)?.id ??
              lista[0]?.id ??
              null
            );
          });

          if (lista.length === 0) {
            setModoEndereco('MANUAL');
          }
        } catch (error) {
          console.error(
            'Erro ao carregar endereços da solicitação:',
            error
          );

          if (ativo) {
            Alert.alert(
              'Erro ao carregar endereços',
              'Não foi possível recuperar seus endereços salvos. Você ainda pode digitar o endereço manualmente.'
            );
          }
        } finally {
          if (ativo) {
            setCarregandoEnderecos(false);
          }
        }
      }

      void carregarEnderecos();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const enderecoSelecionado = enderecosSalvos.find(
    (item) => item.id === enderecoSelecionadoId
  );

  function selecionarEndereco(id: string) {
    setEnderecoSelecionadoId(id);
    setModoEndereco('SALVO');
  }

  async function enviarSolicitacao() {
    if (
      envioEmAndamento.current ||
      carregandoEnderecos
    ) {
      return;
    }

    const endereco =
      modoEndereco === 'SALVO'
        ? enderecoSelecionado
          ? formatarEndereco(enderecoSelecionado)
          : ''
        : enderecoManual.trim();

    if (!endereco || !descricao.trim()) {
      Alert.alert(
        'Preencha os dados',
        'Informe o endereço e descreva o serviço que você precisa.'
      );
      return;
    }

    envioEmAndamento.current = true;
    setEnviando(true);

    try {
      let nomeProfissional =
        profissional || 'Profissional não informado';

      let nomeServico = servico || 'Serviço';

      let prestadorIdValidado: string | undefined;
      let servicoIdValidado: string | undefined;

      if (prestadorId === PRESTADOR_DEMONSTRACAO_ID) {
        if (!servicoId) {
          Alert.alert(
            'Serviço não selecionado',
            'Volte ao perfil do profissional e selecione um serviço.'
          );
          return;
        }

        const profissionalEncontrado =
          buscarProfissionalPorId(prestadorId);

        if (!profissionalEncontrado) {
          Alert.alert(
            'Profissional indisponível',
            'Não foi possível identificar o profissional.'
          );
          return;
        }

        const servicos = await listarServicosPrestador(
          prestadorId
        );

        const servicoEncontrado = servicos.find(
          (item) =>
            item.id === servicoId &&
            item.prestadorId === prestadorId &&
            item.ativo
        );

        if (!servicoEncontrado) {
          Alert.alert(
            'Serviço indisponível',
            'Este serviço não está mais disponível. Volte ao perfil do profissional e escolha outro serviço.'
          );
          return;
        }

        nomeProfissional = profissionalEncontrado.nome;
        nomeServico = servicoEncontrado.nome;
        prestadorIdValidado = prestadorId;
        servicoIdValidado = servicoEncontrado.id;
      } else {
        if (servicoId) {
          Alert.alert(
            'Dados inconsistentes',
            'Não foi possível validar o serviço selecionado. Volte ao perfil do profissional.'
          );
          return;
        }

        if (prestadorId) {
          const profissionalEncontrado =
            buscarProfissionalPorId(prestadorId);

          if (!profissionalEncontrado) {
            Alert.alert(
              'Profissional indisponível',
              'Não foi possível identificar o profissional selecionado.'
            );
            return;
          }

          nomeProfissional = profissionalEncontrado.nome;
          prestadorIdValidado = profissionalEncontrado.id;
        }
      }

      const sucesso = await adicionarSolicitacao({
        id: Date.now().toString(),
        ...(prestadorIdValidado
          ? { prestadorId: prestadorIdValidado }
          : {}),
        ...(servicoIdValidado
          ? { servicoId: servicoIdValidado }
          : {}),
        profissional: nomeProfissional,
        servico: nomeServico,
        endereco,
        descricao: descricao.trim(),
        status: 'PENDENTE',
        data: new Date().toLocaleDateString('pt-BR'),
      });

      if (!sucesso) {
        Alert.alert(
          'Não foi possível registrar',
          'Ocorreu um conflito ao registrar a solicitação. Tente novamente.'
        );
        return;
      }

      Alert.alert(
        'Solicitação salva!',
        `Seu pedido para ${nomeProfissional} foi salvo no aplicativo.`,
        [
          {
            text: 'Ver meus pedidos',
            onPress: () => router.replace('/pedidos'),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro ao persistir solicitação:',
        error
      );

      Alert.alert(
        'Erro ao salvar solicitação',
        'Não foi possível salvar seu pedido no dispositivo. Verifique o armazenamento e tente novamente.'
      );
    } finally {
      envioEmAndamento.current = false;
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={COLORS.dark}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Solicitar serviço
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.professionalCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={32}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.professionalInfo}>
            <Text style={styles.professionalName}>
              {profissional || 'Profissional'}
            </Text>

            <Text style={styles.service}>
              {servico || 'Serviço'}
            </Text>
          </View>

          <View style={styles.badge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={COLORS.primary}
            />

            <Text style={styles.badgeText}>
              CHAMA
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          Conte o que você precisa
        </Text>

        <Text style={styles.subtitle}>
          Passe as informações necessárias para que o
          profissional possa analisar sua solicitação.
        </Text>

        <View style={styles.sectionHeading}>
          <Text style={styles.label}>
            Endereço do serviço
          </Text>

          <TouchableOpacity
            style={styles.manageLink}
            onPress={() => router.push('/enderecos')}
          >
            <Ionicons
              name="settings-outline"
              size={15}
              color={COLORS.primary}
            />

            <Text style={styles.manageLinkText}>
              Gerenciar
            </Text>
          </TouchableOpacity>
        </View>

        {carregandoEnderecos ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />

            <Text style={styles.loadingText}>
              Carregando endereços...
            </Text>
          </View>
        ) : (
          <>
            {enderecosSalvos.length > 0 ? (
              <View style={styles.modeContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    modoEndereco === 'SALVO' &&
                      styles.modeButtonActive,
                  ]}
                  onPress={() => setModoEndereco('SALVO')}
                >
                  <Ionicons
                    name="bookmark-outline"
                    size={18}
                    color={
                      modoEndereco === 'SALVO'
                        ? COLORS.primary
                        : COLORS.muted
                    }
                  />

                  <Text
                    style={[
                      styles.modeText,
                      modoEndereco === 'SALVO' &&
                        styles.modeTextActive,
                    ]}
                  >
                    Endereço salvo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    modoEndereco === 'MANUAL' &&
                      styles.modeButtonActive,
                  ]}
                  onPress={() => setModoEndereco('MANUAL')}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={
                      modoEndereco === 'MANUAL'
                        ? COLORS.primary
                        : COLORS.muted
                    }
                  />

                  <Text
                    style={[
                      styles.modeText,
                      modoEndereco === 'MANUAL' &&
                        styles.modeTextActive,
                    ]}
                  >
                    Digitar endereço
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyAddressBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text style={styles.emptyAddressText}>
                  Você ainda não possui endereços salvos.
                  Digite um endereço abaixo ou cadastre um
                  em Meus endereços.
                </Text>
              </View>
            )}

            {modoEndereco === 'SALVO' &&
            enderecosSalvos.length > 0 ? (
              <View style={styles.savedAddresses}>
                {enderecosSalvos.map((item) => {
                  const selecionado =
                    enderecoSelecionadoId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.addressCard,
                        selecionado &&
                          styles.addressCardSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        selecionarEndereco(item.id)
                      }
                    >
                      <View style={styles.addressRadio}>
                        <Ionicons
                          name={
                            selecionado
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={23}
                          color={
                            selecionado
                              ? COLORS.primary
                              : COLORS.muted
                          }
                        />
                      </View>

                      <View style={styles.addressDetails}>
                        <View style={styles.addressTitleRow}>
                          <Text style={styles.addressName}>
                            {item.apelido}
                          </Text>

                          {item.principal && (
                            <View style={styles.primaryBadge}>
                              <Text
                                style={
                                  styles.primaryBadgeText
                                }
                              >
                                Principal
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.addressText}>
                          {formatarEndereco(item)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={21}
                  color="#777"
                />

                <TextInput
                  style={styles.input}
                  value={enderecoManual}
                  onChangeText={setEnderecoManual}
                  placeholder="Digite o endereço"
                  placeholderTextColor="#999"
                  editable={!enviando}
                />
              </View>
            )}
          </>
        )}

        <Text style={styles.label}>
          Descreva o serviço
        </Text>

        <TextInput
          style={styles.descriptionInput}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: preciso instalar duas tomadas na sala..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          maxLength={500}
          editable={!enviando}
        />

        <Text style={styles.counter}>
          {descricao.length}/500
        </Text>

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.noticeText}>
            Ao registrar, sua solicitação ficará como
            Pendente. O profissional poderá aceitar ou
            recusar o atendimento.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (enviando || carregandoEnderecos) &&
              styles.buttonDisabled,
          ]}
          onPress={() => void enviarSolicitacao()}
          disabled={enviando || carregandoEnderecos}
          activeOpacity={0.8}
        >
          {enviando ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={COLORS.white}
            />
          )}

          <Text style={styles.buttonText}>
            {enviando
              ? 'Salvando...'
              : 'Enviar solicitação'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 65,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
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
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.dark,
  },
  headerSpace: {
    width: 40,
  },
  content: {
    padding: 22,
    paddingBottom: 45,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  service: {
    color: COLORS.primary,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.soft,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.dark,
  },
  subtitle: {
    color: '#6D7277',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 28,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#34383D',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  manageLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
  },
  manageLinkText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  modeButton: {
    flex: 1,
    minHeight: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  modeButtonActive: {
    backgroundColor: COLORS.soft,
    borderColor: COLORS.primary,
  },
  modeText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  modeTextActive: {
    color: COLORS.primary,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    marginBottom: 18,
    backgroundColor: COLORS.white,
    borderRadius: 14,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  emptyAddressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    backgroundColor: COLORS.soft,
    borderRadius: 13,
    marginBottom: 14,
  },
  emptyAddressText: {
    flex: 1,
    color: '#6E7379',
    fontSize: 11,
    lineHeight: 17,
  },
  savedAddresses: {
    marginBottom: 18,
    gap: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },
  addressCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFAF9',
  },
  addressRadio: {
    marginRight: 11,
    marginTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  addressName: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
  },
  primaryBadge: {
    backgroundColor: COLORS.soft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  primaryBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  addressText: {
    color: '#6D7277',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  inputContainer: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 9,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
  },
  descriptionInput: {
    minHeight: 135,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    padding: 15,
    fontSize: 15,
    color: COLORS.dark,
  },
  counter: {
    color: '#999',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  notice: {
    flexDirection: 'row',
    backgroundColor: COLORS.soft,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 20,
  },
  noticeText: {
    flex: 1,
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    height: 58,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 25,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
