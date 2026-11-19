
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  alterarDisponibilidadeServico,
  cadastrarServico,
  editarServico,
  listarServicosPrestador,
  type ServicoPrestador,
} from '@/constants/servicosPrestador';

import {
  converterPrecoParaCentavos,
  validarServico,
  type DadosServico,
} from '@/constants/regrasServico';

const COLORS = {
  primary: '#F04B2F',
  dark: '#1F2328',
  background: '#F7F7F7',
  white: '#FFFFFF',
  muted: '#858B93',
  border: '#ECEEF0',
  soft: '#FFF1EE',
  success: '#15803D',
};

const PRESTADOR_DEMONSTRACAO_ID = 'prestador-demonstracao';

type Formulario = {
  nome: string;
  categoria: string;
  descricao: string;
  preco: string;
};

const FORMULARIO_VAZIO: Formulario = {
  nome: '',
  categoria: '',
  descricao: '',
  preco: '',
};

function formatarPreco(precoCentavos: number): string {
  return (precoCentavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function precoParaFormulario(precoCentavos: number): string {
  const reais = Math.floor(precoCentavos / 100);
  const centavos = String(precoCentavos % 100).padStart(2, '0');

  return `${reais},${centavos}`;
}

export default function MeusServicosScreen() {
  const [servicos, setServicos] = useState<ServicoPrestador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alterandoId, setAlterandoId] = useState<string | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(
    FORMULARIO_VAZIO
  );

  const carregar = useCallback(async () => {
    try {
      const lista = await listarServicosPrestador(
        PRESTADOR_DEMONSTRACAO_ID
      );

      setServicos(lista);
    } catch {
      Alert.alert(
        'Erro ao carregar',
        'Não foi possível carregar seus serviços.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar])
  );

  const ativos = servicos.filter((servico) => servico.ativo).length;

  function atualizarCampo(
    campo: keyof Formulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function abrirCadastro() {
    setEditandoId(null);
    setFormulario({ ...FORMULARIO_VAZIO });
    setFormularioAberto(true);
  }

  function abrirEdicao(servico: ServicoPrestador) {
    setEditandoId(servico.id);
    setFormulario({
      nome: servico.nome,
      categoria: servico.categoria,
      descricao: servico.descricao,
      preco: precoParaFormulario(servico.precoCentavos),
    });
    setFormularioAberto(true);
  }

  function cancelarFormulario() {
    if (salvando) {
      return;
    }

    setFormularioAberto(false);
    setEditandoId(null);
    setFormulario({ ...FORMULARIO_VAZIO });
  }

  async function salvar() {
    if (salvando) {
      return;
    }

    const precoCentavos = converterPrecoParaCentavos(
      formulario.preco
    );

    if (precoCentavos === null) {
      Alert.alert(
        'Preço inválido',
        'Informe um valor maior que zero. Exemplo: 80,50.'
      );
      return;
    }

    const dados: DadosServico = {
      nome: formulario.nome,
      categoria: formulario.categoria,
      descricao: formulario.descricao,
      precoCentavos,
    };

    const erros = validarServico(dados);
    const primeiroErro = Object.values(erros)[0];

    if (primeiroErro) {
      Alert.alert('Verifique os dados', primeiroErro);
      return;
    }

    setSalvando(true);

    try {
      const resultado = editandoId
        ? await editarServico(
            PRESTADOR_DEMONSTRACAO_ID,
            editandoId,
            dados
          )
        : await cadastrarServico(
            PRESTADOR_DEMONSTRACAO_ID,
            dados
          );

      if (!resultado.sucesso) {
        Alert.alert('Não foi possível salvar', resultado.erro);
        return;
      }

      await carregar();
      cancelarFormulario();
      setFormularioAberto(false);
      setEditandoId(null);
      setFormulario({ ...FORMULARIO_VAZIO });

      Alert.alert(
        'Sucesso',
        editandoId
          ? 'Serviço atualizado com sucesso.'
          : 'Serviço cadastrado com sucesso.'
      );
    } catch {
      Alert.alert(
        'Erro',
        'Ocorreu um problema ao salvar o serviço.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alterarDisponibilidade(
    servico: ServicoPrestador,
    ativo: boolean
  ) {
    if (alterandoId !== null) {
      return;
    }

    setAlterandoId(servico.id);

    try {
      const resultado = await alterarDisponibilidadeServico(
        PRESTADOR_DEMONSTRACAO_ID,
        servico.id,
        ativo
      );

      if (!resultado.sucesso) {
        Alert.alert('Erro', resultado.erro);
        return;
      }

      await carregar();
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível alterar a disponibilidade.'
      );
    } finally {
      setAlterandoId(null);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={23}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Meus serviços</Text>

              <View style={styles.topButton}>
                <Ionicons
                  name="construct-outline"
                  size={22}
                  color={COLORS.white}
                />
              </View>
            </View>

            <Text style={styles.headerSubtitle}>
              Organize os serviços que você oferece aos clientes.
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.summaryCard}>
              <View>
                <Text style={styles.summaryLabel}>
                  Serviços cadastrados
                </Text>
                <Text style={styles.summaryNumber}>
                  {servicos.length}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View>
                <Text style={styles.summaryLabel}>
                  Serviços ativos
                </Text>
                <Text style={styles.summaryNumber}>
                  {ativos}
                </Text>
              </View>

              <Ionicons
                name="briefcase-outline"
                size={30}
                color={COLORS.primary}
              />
            </View>

            {!formularioAberto && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={abrirCadastro}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={21}
                  color={COLORS.white}
                />
                <Text style={styles.primaryButtonText}>
                  Cadastrar novo serviço
                </Text>
              </TouchableOpacity>
            )}

            {formularioAberto && (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {editandoId
                    ? 'Editar serviço'
                    : 'Cadastrar serviço'}
                </Text>

                <Text style={styles.label}>Nome do serviço</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Instalação de tomadas"
                  placeholderTextColor={COLORS.muted}
                  value={formulario.nome}
                  onChangeText={(valor) =>
                    atualizarCampo('nome', valor)
                  }
                  maxLength={100}
                />

                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Eletricista"
                  placeholderTextColor={COLORS.muted}
                  value={formulario.categoria}
                  onChangeText={(valor) =>
                    atualizarCampo('categoria', valor)
                  }
                  maxLength={60}
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descreva o serviço oferecido"
                  placeholderTextColor={COLORS.muted}
                  value={formulario.descricao}
                  onChangeText={(valor) =>
                    atualizarCampo('descricao', valor)
                  }
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                />

                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 80,50"
                  placeholderTextColor={COLORS.muted}
                  value={formulario.preco}
                  onChangeText={(valor) =>
                    atualizarCampo('preco', valor)
                  }
                  keyboardType="decimal-pad"
                />

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    salvando && styles.disabledButton,
                  ]}
                  onPress={() => void salvar()}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={21}
                      color={COLORS.white}
                    />
                  )}

                  <Text style={styles.primaryButtonText}>
                    {salvando
                      ? 'Salvando...'
                      : editandoId
                        ? 'Salvar alterações'
                        : 'Cadastrar serviço'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelarFormulario}
                  disabled={salvando}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              Serviços oferecidos
            </Text>

            {carregando ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loading}
              />
            ) : servicos.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="file-tray-outline"
                  size={42}
                  color={COLORS.muted}
                />
                <Text style={styles.emptyTitle}>
                  Nenhum serviço cadastrado
                </Text>
                <Text style={styles.emptyDescription}>
                  Cadastre seu primeiro serviço para começar a
                  organizar suas ofertas profissionais.
                </Text>
              </View>
            ) : (
              servicos.map((servico) => (
                <View key={servico.id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceIcon}>
                      <Ionicons
                        name="construct-outline"
                        size={23}
                        color={COLORS.primary}
                      />
                    </View>

                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>
                        {servico.nome}
                      </Text>
                      <Text style={styles.serviceCategory}>
                        {servico.categoria}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        !servico.ativo && styles.inactiveBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          !servico.ativo && styles.inactiveText,
                        ]}
                      >
                        {servico.ativo ? 'Ativo' : 'Inativo'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.serviceDescription}>
                    {servico.descricao}
                  </Text>

                  <Text style={styles.servicePrice}>
                    {formatarPreco(servico.precoCentavos)}
                  </Text>

                  <View style={styles.serviceFooter}>
                    <View style={styles.switchRow}>
                      <Switch
                        value={servico.ativo}
                        onValueChange={(ativo) =>
                          void alterarDisponibilidade(
                            servico,
                            ativo
                          )
                        }
                        disabled={alterandoId !== null}
                        trackColor={{
                          false: '#D1D5DB',
                          true: '#F7B1A5',
                        }}
                        thumbColor={
                          servico.ativo
                            ? COLORS.primary
                            : '#F3F4F6'
                        }
                      />
                      <Text style={styles.switchLabel}>
                        Disponível
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => abrirEdicao(servico)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={COLORS.primary}
                      />
                      <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <Text style={styles.footer}>
              CHAMA • Precisa de um serviço? CHAMA.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.dark,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#C5C8CC',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 23,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  summaryNumber: {
    color: COLORS.dark,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 5,
  },
  summaryDivider: {
    height: 42,
    width: 1,
    backgroundColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    minHeight: 54,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    marginTop: 18,
    paddingHorizontal: 15,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    color: COLORS.dark,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  label: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 13,
    marginBottom: 7,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.dark,
  },
  textArea: {
    minHeight: 105,
    paddingTop: 13,
    paddingBottom: 13,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  cancelText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 26,
    marginBottom: 14,
  },
  loading: {
    marginTop: 40,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
  },
  serviceCategory: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  inactiveBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '800',
  },
  inactiveText: {
    color: '#6B7280',
  },
  serviceDescription: {
    color: '#6E7379',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
  },
  servicePrice: {
    color: COLORS.primary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12,
  },
  serviceFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 15,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  switchLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  editText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 22,
    fontWeight: '600',
  },
});
