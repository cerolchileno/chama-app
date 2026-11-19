
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
  carregarPerfilCliente,
  salvarPerfilCliente,
} from '@/constants/perfilCliente';

type ErrosFormulario = {
  nome?: string;
  email?: string;
  telefone?: string;
};

const COLORS = {
  primary: '#F04B2F',
  dark: '#1F2328',
  background: '#F7F7F7',
  white: '#FFFFFF',
  muted: '#858B93',
  border: '#ECEEF0',
  soft: '#FFF1EE',
};

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 2) {
    return numeros.length ? `(${numeros}` : '';
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export default function DadosPessoaisScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [erros, setErros] = useState<ErrosFormulario>({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const perfil = await carregarPerfilCliente();

        if (!ativo) return;

        if (perfil) {
          setNome(perfil.nome);
          setEmail(perfil.email);
          setTelefone(formatarTelefone(perfil.telefone));
        }
      } catch {
        if (ativo) {
          Alert.alert(
            'Erro ao carregar',
            'Não foi possível recuperar os dados pessoais salvos.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  function limparErro(campo: keyof ErrosFormulario) {
    setErros((anteriores) => {
      if (!anteriores[campo]) return anteriores;

      const atualizados = { ...anteriores };
      delete atualizados[campo];

      return atualizados;
    });
  }

  function validarFormulario() {
    const novosErros: ErrosFormulario = {};

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const telefoneNumeros = telefone.replace(/\D/g, '');

    if (nomeLimpo.split(/\s+/).filter(Boolean).length < 2) {
      novosErros.nome = 'Informe seu nome e sobrenome.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      novosErros.email = 'Informe um e-mail válido.';
    }

    if (!/^[1-9]{2}[2-9]\d{7,8}$/.test(telefoneNumeros)) {
      novosErros.telefone =
        'Informe um telefone brasileiro válido com DDD.';
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function salvarDados() {
    if (salvando || carregando) return;
    if (!validarFormulario()) return;

    setSalvando(true);

    try {
      await salvarPerfilCliente({
        nome,
        email,
        telefone,
      });

      Alert.alert(
        'Dados salvos!',
        'Suas informações foram atualizadas neste dispositivo.',
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
        'Não foi possível salvar suas informações. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.dark}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Dados pessoais
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introIcon}>
            <Ionicons
              name="person-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            Suas informações
          </Text>

          <Text style={styles.subtitle}>
            Atualize seus dados de contato. As informações
            serão armazenadas localmente neste dispositivo.
          </Text>

          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />
              <Text style={styles.loadingText}>
                Carregando informações...
              </Text>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.label}>
                Nome completo
              </Text>

              <TextInput
                style={[
                  styles.input,
                  erros.nome && styles.inputError,
                ]}
                placeholder="Digite seu nome e sobrenome"
                placeholderTextColor="#999999"
                value={nome}
                onChangeText={(valor) => {
                  setNome(valor);
                  limparErro('nome');
                }}
                autoCapitalize="words"
                autoComplete="name"
                editable={!salvando}
              />

              {erros.nome ? (
                <Text style={styles.errorText}>
                  {erros.nome}
                </Text>
              ) : null}

              <Text style={styles.label}>
                E-mail
              </Text>

              <TextInput
                style={[
                  styles.input,
                  erros.email && styles.inputError,
                ]}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={(valor) => {
                  setEmail(valor);
                  limparErro('email');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!salvando}
              />

              {erros.email ? (
                <Text style={styles.errorText}>
                  {erros.email}
                </Text>
              ) : null}

              <Text style={styles.label}>
                Telefone
              </Text>

              <TextInput
                style={[
                  styles.input,
                  erros.telefone && styles.inputError,
                ]}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#999999"
                value={telefone}
                onChangeText={(valor) => {
                  setTelefone(formatarTelefone(valor));
                  limparErro('telefone');
                }}
                keyboardType="phone-pad"
                maxLength={15}
                autoComplete="tel"
                editable={!salvando}
              />

              {erros.telefone ? (
                <Text style={styles.errorText}>
                  {erros.telefone}
                </Text>
              ) : null}

              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  Esta é uma funcionalidade local do MVP.
                  Os dados ainda não são sincronizados com
                  uma conta online.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  salvando && styles.saveButtonDisabled,
                ]}
                activeOpacity={0.8}
                disabled={salvando}
                onPress={() => void salvarDados()}
              >
                {salvando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.saveButtonText}>
                      Salvar alterações
                    </Text>
                  </>
                )}
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
    height: 65,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 25,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6E747A',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 15,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 13,
  },
  input: {
    height: 54,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E1E3E5',
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 15,
    color: COLORS.dark,
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF7F7',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.soft,
    padding: 13,
    borderRadius: 12,
    marginTop: 24,
  },
  infoText: {
    color: '#6E7379',
    fontSize: 11,
    lineHeight: 17,
    flex: 1,
  },
  saveButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
