
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  carregarEnderecosCliente,
  EnderecoCliente,
  gerarIdEndereco,
  salvarEnderecosCliente,
} from '@/constants/enderecosCliente';

const COLORS = {
  primary: '#F04B2F',
  dark: '#1F2328',
  background: '#F7F7F7',
  white: '#FFFFFF',
  muted: '#858B93',
  border: '#ECEEF0',
  soft: '#FFF1EE',
  danger: '#DC2626',
};

type RespostaViaCep = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type CamposEndereco = {
  apelido: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type ErrosFormulario = Partial<
  Record<keyof CamposEndereco, string>
>;

const CAMPOS_INICIAIS: CamposEndereco = {
  apelido: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

function formatarCep(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 8);

  if (numeros.length <= 5) {
    return numeros;
  }

  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

function validarCampos(
  campos: CamposEndereco
): ErrosFormulario {
  const erros: ErrosFormulario = {};

  if (!campos.apelido.trim()) {
    erros.apelido = 'Informe um nome para este endereço.';
  }

  if (!/^\d{8}$/.test(campos.cep.replace(/\D/g, ''))) {
    erros.cep = 'Informe um CEP com 8 dígitos.';
  }

  if (!campos.rua.trim()) {
    erros.rua = 'Informe a rua ou avenida.';
  }

  if (!campos.numero.trim()) {
    erros.numero = 'Informe o número ou S/N.';
  }

  if (!campos.bairro.trim()) {
    erros.bairro = 'Informe o bairro.';
  }

  if (!campos.cidade.trim()) {
    erros.cidade = 'Informe a cidade.';
  }

  if (!/^[A-Za-z]{2}$/.test(campos.estado.trim())) {
    erros.estado = 'Informe a UF com 2 letras.';
  }

  return erros;
}

export default function FormularioEnderecoScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const editando = typeof id === 'string' && id.length > 0;

  const [campos, setCampos] = useState<CamposEndereco>(
    CAMPOS_INICIAIS
  );
  const [enderecos, setEnderecos] = useState<EnderecoCliente[]>(
    []
  );
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [consultandoCep, setConsultandoCep] = useState(false);
  const [mensagemCep, setMensagemCep] = useState('');
  const [enderecoEncontrado, setEnderecoEncontrado] =
    useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await carregarEnderecosCliente();

        if (!ativo) return;

        setEnderecos(lista);

        if (editando) {
          const endereco = lista.find(
            (item) => item.id === id
          );

          if (!endereco) {
            setEnderecoEncontrado(false);

            Alert.alert(
              'Endereço não encontrado',
              'Não foi possível localizar este endereço.',
              [
                {
                  text: 'Voltar',
                  onPress: () => router.back(),
                },
              ]
            );

            return;
          }

          setCampos({
            apelido: endereco.apelido,
            cep: formatarCep(endereco.cep),
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
          });
        }
      } catch {
        if (ativo) {
          setEnderecoEncontrado(false);

          Alert.alert(
            'Erro ao carregar',
            'Não foi possível recuperar os endereços salvos.',
            [
              {
                text: 'Voltar',
                onPress: () => router.back(),
              },
            ]
          );
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
  }, [editando, id]);

  function atualizarCampo(
    campo: keyof CamposEndereco,
    valor: string
  ) {
    setCampos((anteriores) => ({
      ...anteriores,
      [campo]: valor,
    }));

    setErros((anteriores) => {
      if (!anteriores[campo]) {
        return anteriores;
      }

      const atualizados = { ...anteriores };
      delete atualizados[campo];

      return atualizados;
    });
  }

  async function consultarCep() {
    if (consultandoCep || salvando) return;

    const cep = campos.cep.replace(/\\D/g, '');
    if (!/^\\d{8}$/.test(cep)) {
      setMensagemCep('Informe um CEP com 8 dígitos para consultar.');
      return;
    }

    setConsultandoCep(true);
    setMensagemCep('');
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!resposta.ok) throw new Error('Falha na consulta');
      const dados: RespostaViaCep = await resposta.json();
      if (dados.erro) {
        setMensagemCep('CEP não encontrado. Confira os números digitados.');
        return;
      }

      setCampos((anteriores) => {
        // Não sobrescrever o formulário se o CEP mudou durante a consulta.
        if (anteriores.cep.replace(/\\D/g, '') !== cep) return anteriores;
        return {
          ...anteriores,
          rua: dados.logradouro || anteriores.rua,
          bairro: dados.bairro || anteriores.bairro,
          cidade: dados.localidade || anteriores.cidade,
          estado: dados.uf || anteriores.estado,
        };
      });
      setErros((anteriores) => {
        const atualizados = { ...anteriores };
        delete atualizados.cep;
        delete atualizados.rua;
        delete atualizados.bairro;
        delete atualizados.cidade;
        delete atualizados.estado;
        return atualizados;
      });
      setMensagemCep('Consulta concluída. Confira o endereço e informe o número.');
    } catch {
      setMensagemCep('Não foi possível consultar o CEP. Confira sua conexão ou preencha manualmente.');
    } finally {
      setConsultandoCep(false);
    }
  }

  async function salvar() {
    if (salvando || carregando || !enderecoEncontrado) {
      return;
    }

    const novosErros = validarCampos(campos);
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      Alert.alert(
        'Verifique os dados',
        'Corrija os campos destacados antes de salvar.'
      );
      return;
    }

    setSalvando(true);

    try {
      // Recarrega a lista para evitar trabalhar com dados
      // desatualizados durante a edição.
      const listaAtual = await carregarEnderecosCliente();

      const dadosNormalizados = {
        apelido: campos.apelido.trim(),
        cep: formatarCep(campos.cep),
        rua: campos.rua.trim(),
        numero: campos.numero.trim(),
        complemento: campos.complemento.trim(),
        bairro: campos.bairro.trim(),
        cidade: campos.cidade.trim(),
        estado: campos.estado.trim().toUpperCase(),
      };

      let listaAtualizada: EnderecoCliente[];

      if (editando) {
        const existente = listaAtual.find(
          (item) => item.id === id
        );

        if (!existente) {
          Alert.alert(
            'Endereço não encontrado',
            'Este endereço não está mais disponível.'
          );
          return;
        }

        listaAtualizada = listaAtual.map((item) =>
          item.id === id
            ? { ...item, ...dadosNormalizados }
            : item
        );
      } else {
        const novoEndereco: EnderecoCliente = {
          id: gerarIdEndereco(),
          ...dadosNormalizados,
          principal: listaAtual.length === 0,
        };

        listaAtualizada = [
          ...listaAtual,
          novoEndereco,
        ];
      }

      await salvarEnderecosCliente(listaAtualizada);
      setEnderecos(listaAtualizada);

      Alert.alert(
        'Sucesso!',
        editando
          ? 'Endereço atualizado com sucesso.'
          : 'Endereço cadastrado com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar o endereço. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  function renderizarCampo(
    titulo: string,
    campo: keyof CamposEndereco,
    placeholder: string,
    opcoes?: {
      keyboardType?: 'default' | 'numeric';
      maxLength?: number;
      autoCapitalize?: 'none' | 'words' | 'characters';
    }
  ) {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {titulo}
          {campo !== 'complemento' ? (
            <Text style={styles.required}> *</Text>
          ) : null}
        </Text>

        <TextInput
          style={[
            styles.input,
            erros[campo] ? styles.inputError : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9CA1A7"
          value={campos[campo]}
          onChangeText={(valor) => {
            let novoValor = valor;

            if (campo === 'cep') {
              novoValor = formatarCep(valor);
            }

            if (campo === 'estado') {
              novoValor = valor
                .replace(/[^a-zA-Z]/g, '')
                .slice(0, 2)
                .toUpperCase();
            }

            atualizarCampo(campo, novoValor);
            if (campo === 'cep') setMensagemCep('');
          }}
          keyboardType={opcoes?.keyboardType ?? 'default'}
          maxLength={opcoes?.maxLength}
          autoCapitalize={
            opcoes?.autoCapitalize ?? 'words'
          }
          editable={!salvando}
        />

        {erros[campo] ? (
          <Text style={styles.errorText}>
            {erros[campo]}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {editando ? 'Editar endereço' : 'Novo endereço'}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introIcon}>
            <Ionicons
              name="location-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            {editando
              ? 'Atualize seu endereço'
              : 'Onde será o atendimento?'}
          </Text>

          <Text style={styles.subtitle}>
            Preencha os dados do local onde deseja
            receber os serviços.
          </Text>

          {carregando ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />
              <Text style={styles.loadingText}>
                Carregando informações...
              </Text>
            </View>
          ) : enderecoEncontrado ? (
            <View style={styles.formCard}>
              {renderizarCampo(
                'Nome do endereço',
                'apelido',
                'Ex.: Casa, Trabalho'
              )}

              {renderizarCampo(
                'CEP',
                'cep',
                '00000-000',
                {
                  keyboardType: 'numeric',
                  maxLength: 9,
                  autoCapitalize: 'none',
                }
              )}

              <TouchableOpacity
                style={[styles.cepButton, (consultandoCep || salvando) && styles.disabledButton]}
                onPress={() => void consultarCep()}
                disabled={consultandoCep || salvando}
                accessibilityRole="button"
                accessibilityLabel="Consultar endereço pelo CEP"
              >
                {consultandoCep ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Ionicons name="search-outline" size={19} color={COLORS.primary} />
                )}
                <Text style={styles.cepButtonText}>
                  {consultandoCep ? 'Consultando CEP...' : 'Buscar endereço pelo CEP'}
                </Text>
              </TouchableOpacity>
              {!!mensagemCep && (
                <Text style={styles.cepFeedback} accessibilityRole="text">
                  {mensagemCep}
                </Text>
              )}

              {renderizarCampo(
                'Rua ou avenida',
                'rua',
                'Digite o logradouro'
              )}

              {renderizarCampo(
                'Número',
                'numero',
                'Ex.: 123 ou S/N'
              )}

              {renderizarCampo(
                'Complemento (opcional)',
                'complemento',
                'Ex.: Casa 2, apartamento 301'
              )}

              {renderizarCampo(
                'Bairro',
                'bairro',
                'Digite o bairro'
              )}

              {renderizarCampo(
                'Cidade',
                'cidade',
                'Digite a cidade'
              )}

              {renderizarCampo(
                'Estado (UF)',
                'estado',
                'Ex.: RJ',
                {
                  maxLength: 2,
                  autoCapitalize: 'characters',
                }
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  salvando && styles.disabledButton,
                ]}
                activeOpacity={0.8}
                disabled={salvando}
                onPress={() => void salvar()}
              >
                {salvando ? (
                  <ActivityIndicator
                    color={COLORS.white}
                  />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color={COLORS.white}
                    />

                    <Text style={styles.saveButtonText}>
                      {editando
                        ? 'Salvar alterações'
                        : 'Cadastrar endereço'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.footerNote}>
                * Campos obrigatórios
              </Text>
            </View>
          ) : (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle-outline"
                size={35}
                color={COLORS.danger}
              />

              <Text style={styles.errorCardTitle}>
                Não foi possível abrir o formulário
              </Text>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.returnButton}
              >
                <Text style={styles.returnButtonText}>
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.dark,
    height: 67,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 42,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 45,
  },
  introIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: COLORS.dark,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6E747A',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 23,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 55,
    gap: 13,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  fieldContainer: {
    marginBottom: 17,
  },
  label: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  required: {
    color: COLORS.primary,
  },
  input: {
    minHeight: 53,
    borderWidth: 1,
    borderColor: '#E1E3E5',
    borderRadius: 13,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.dark,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF7F7',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 6,
  },
  cepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    padding: 13,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
    marginBottom: 8,
  },
  cepButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  cepFeedback: {
    color: '#6E7379',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 18,
  },
  cepNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
    marginBottom: 18,
  },
  cepNoticeText: {
    flex: 1,
    color: '#6E7379',
    fontSize: 11,
    lineHeight: 17,
  },
  saveButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  footerNote: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 16,
  },
  errorCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    gap: 15,
  },
  errorCardTitle: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  returnButtonText: {
    color: COLORS.white,
    fontWeight: '800',
  },
});
