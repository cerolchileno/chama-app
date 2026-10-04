import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TipoUsuario = 'CLIENTE' | 'PRESTADOR';

export default function LoginScreen() {
  const [tipoUsuario, setTipoUsuario] =
    useState<TipoUsuario>('CLIENTE');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert(
        'Preencha os dados',
        'Informe seu e-mail e sua senha para continuar.'
      );

      return;
    }

    if (tipoUsuario === 'CLIENTE') {
      router.replace('/cliente');
      return;
    }

    router.replace('/prestador');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* VOLTAR */}

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

          {/* MARCA */}

          <View style={styles.brandContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                C
              </Text>
            </View>

            <Text style={styles.brand}>
              CHAMA
            </Text>

            <Text style={styles.slogan}>
              Precisa de um serviço? CHAMA.
            </Text>
          </View>

          {/* LOGIN */}

          <View style={styles.form}>
            <Text style={styles.title}>
              Bem-vindo de volta
            </Text>

            <Text style={styles.subtitle}>
              Escolha como deseja acessar sua
              conta.
            </Text>

            {/* TIPO DE USUÁRIO */}

            <Text style={styles.label}>
              Tipo de acesso
            </Text>

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  tipoUsuario === 'CLIENTE' &&
                    styles.typeCardActive,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setTipoUsuario('CLIENTE')
                }
              >
                <View
                  style={[
                    styles.typeIcon,
                    tipoUsuario === 'CLIENTE' &&
                      styles.typeIconActive,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={
                      tipoUsuario === 'CLIENTE'
                        ? '#FFFFFF'
                        : '#F04B2F'
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.typeTitle,
                    tipoUsuario === 'CLIENTE' &&
                      styles.typeTitleActive,
                  ]}
                >
                  Cliente
                </Text>

                <Text style={styles.typeDescription}>
                  Quero contratar
                </Text>

                {tipoUsuario === 'CLIENTE' && (
                  <View style={styles.selected}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeCard,
                  tipoUsuario === 'PRESTADOR' &&
                    styles.typeCardActive,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setTipoUsuario('PRESTADOR')
                }
              >
                <View
                  style={[
                    styles.typeIcon,
                    tipoUsuario ===
                      'PRESTADOR' &&
                      styles.typeIconActive,
                  ]}
                >
                  <Ionicons
                    name="construct-outline"
                    size={25}
                    color={
                      tipoUsuario ===
                      'PRESTADOR'
                        ? '#FFFFFF'
                        : '#F04B2F'
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.typeTitle,
                    tipoUsuario ===
                      'PRESTADOR' &&
                      styles.typeTitleActive,
                  ]}
                >
                  Prestador
                </Text>

                <Text style={styles.typeDescription}>
                  Quero trabalhar
                </Text>

                {tipoUsuario ===
                  'PRESTADOR' && (
                  <View style={styles.selected}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* EMAIL */}

            <Text style={styles.label}>
              E-mail
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777777"
              />

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* SENHA */}

            <Text style={styles.label}>
              Senha
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777777"
              />

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#999999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                Alert.alert(
                  'Recuperar senha',
                  'A recuperação de senha será conectada posteriormente.'
                )
              }
            >
              <Text style={styles.forgotText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            {/* ENTRAR */}

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={entrar}
            >
              <Text style={styles.loginButtonText}>
                Entrar como{' '}
                {tipoUsuario === 'CLIENTE'
                  ? 'Cliente'
                  : 'Prestador'}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.dividerText}>
                ou
              </Text>

              <View style={styles.divider} />
            </View>

            {/* CADASTRO */}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Ainda não tem uma conta?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push('/cadastro')
                }
              >
                <Text style={styles.registerLink}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>

            {/* AVISO MVP */}

            <View style={styles.developmentNotice}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#F04B2F"
              />

              <Text
                style={
                  styles.developmentNoticeText
                }
              >
                Durante o desenvolvimento do MVP,
                qualquer e-mail e senha preenchidos
                podem ser usados para testar os dois
                tipos de acesso.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 40,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F04B2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },

  brand: {
    color: '#1F2328',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },

  slogan: {
    color: '#777777',
    fontSize: 11,
    marginTop: 5,
  },

  form: {
    width: '100%',
  },

  title: {
    color: '#1F2328',
    fontSize: 28,
    fontWeight: '900',
  },

  subtitle: {
    color: '#6F7479',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 25,
  },

  label: {
    color: '#34383D',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },

  typeContainer: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 13,
  },

  typeCard: {
    flex: 1,
    minHeight: 125,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    padding: 14,
    position: 'relative',
  },

  typeCardActive: {
    borderColor: '#F04B2F',
    backgroundColor: '#FFF8F6',
  },

  typeIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  typeIconActive: {
    backgroundColor: '#F04B2F',
  },

  typeTitle: {
    color: '#1F2328',
    fontSize: 14,
    fontWeight: '800',
  },

  typeTitleActive: {
    color: '#F04B2F',
  },

  typeDescription: {
    color: '#888888',
    fontSize: 10,
    marginTop: 3,
  },

  selected: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F04B2F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },

  input: {
    flex: 1,
    color: '#1F2328',
    fontSize: 14,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  forgotText: {
    color: '#F04B2F',
    fontSize: 12,
    fontWeight: '700',
  },

  loginButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F04B2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E7E7',
  },

  dividerText: {
    color: '#999999',
    fontSize: 12,
    marginHorizontal: 12,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  registerText: {
    color: '#777777',
    fontSize: 13,
  },

  registerLink: {
    color: '#F04B2F',
    fontSize: 13,
    fontWeight: '800',
  },

  developmentNotice: {
    flexDirection: 'row',
    backgroundColor: '#FFF1EE',
    borderRadius: 14,
    padding: 13,
    gap: 9,
    marginTop: 25,
  },

  developmentNoticeText: {
    flex: 1,
    color: '#62666A',
    fontSize: 11,
    lineHeight: 17,
  },
});