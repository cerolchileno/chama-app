
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

export default function CadastroScreen() {
  const [tipo, setTipo] = useState<TipoUsuario>('CLIENTE');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

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

  function validarCadastro() {
    const novosErros: Record<string, string> = {};
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
      novosErros.telefone = 'Informe um telefone brasileiro válido com DDD.';
    }

    if (senha.length < 8) {
      novosErros.senha = 'A senha deve conter pelo menos 8 caracteres.';
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    Alert.alert(
      'Dados validados!',
      'Os dados do cadastro estão corretos. A criação de contas será conectada ao sistema de autenticação em uma próxima etapa.',
      [{ text: 'Entendi' }]
    );
  }

  function limparErro(campo: string) {
    setErros((anteriores) => {
      if (!anteriores[campo]) return anteriores;
      const atualizados = { ...anteriores };
      delete atualizados[campo];
      return atualizados;
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹ Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.brand}>CHAMA</Text>

          <Text style={styles.title}>Crie sua conta</Text>

          <Text style={styles.subtitle}>
            Primeiro, escolha como você deseja utilizar o CHAMA.
          </Text>

          <View style={styles.profileRow}>
            <TouchableOpacity
              style={[
                styles.profileCard,
                tipo === 'CLIENTE' && styles.profileCardSelected,
              ]}
              onPress={() => setTipo('CLIENTE')}
            >
              <Text style={styles.profileIcon}>👤</Text>

              <Text
                style={[
                  styles.profileTitle,
                  tipo === 'CLIENTE' && styles.profileTitleSelected,
                ]}
              >
                Cliente
              </Text>

              <Text style={styles.profileDescription}>
                Quero contratar serviços
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.profileCard,
                tipo === 'PRESTADOR' && styles.profileCardSelected,
              ]}
              onPress={() => setTipo('PRESTADOR')}
            >
              <Text style={styles.profileIcon}>🧰</Text>

              <Text
                style={[
                  styles.profileTitle,
                  tipo === 'PRESTADOR' && styles.profileTitleSelected,
                ]}
              >
                Prestador
              </Text>

              <Text style={styles.profileDescription}>
                Quero oferecer serviços
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>

            <TextInput
              style={[styles.input, erros.nome && styles.inputError]}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={(valor) => {
                setNome(valor);
                limparErro('nome');
              }}
              autoCapitalize="words"
              autoComplete="name"
            />

            {erros.nome ? (
              <Text style={styles.errorText}>{erros.nome}</Text>
            ) : null}

            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={[styles.input, erros.email && styles.inputError]}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(valor) => {
                setEmail(valor);
                limparErro('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            {erros.email ? (
              <Text style={styles.errorText}>{erros.email}</Text>
            ) : null}

            <Text style={styles.label}>Telefone</Text>

            <TextInput
              style={[styles.input, erros.telefone && styles.inputError]}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              value={telefone}
              onChangeText={(valor) => {
                setTelefone(formatarTelefone(valor));
                limparErro('telefone');
              }}
              keyboardType="phone-pad"
              maxLength={15}
              autoComplete="tel"
            />

            {erros.telefone ? (
              <Text style={styles.errorText}>{erros.telefone}</Text>
            ) : null}

            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={[styles.input, erros.senha && styles.inputError]}
              placeholder="Crie uma senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={(valor) => {
                setSenha(valor);
                limparErro('senha');
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
            />

            {erros.senha ? (
              <Text style={styles.errorText}>{erros.senha}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={validarCadastro}
            >
              <Text style={styles.buttonText}>
                Criar conta como{' '}
                {tipo === 'CLIENTE' ? 'cliente' : 'prestador'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já possui uma conta?</Text>

            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}> Entrar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.notice}>
            Cadastro em demonstração. Nenhuma conta será criada nesta etapa.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 25,
  },

  backText: {
    color: '#E8543E',
    fontSize: 16,
    fontWeight: '700',
  },

  brand: {
    color: '#E8543E',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  title: {
    color: '#1F2328',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#6E747A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 25,
  },

  profileRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  profileCard: {
    flex: 1,
    minHeight: 145,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E3E5',
    borderRadius: 16,
    padding: 15,
  },

  profileCardSelected: {
    borderColor: '#E8543E',
    backgroundColor: '#FFF4F1',
  },

  profileIcon: {
    fontSize: 27,
    marginBottom: 10,
  },

  profileTitle: {
    color: '#1F2328',
    fontSize: 17,
    fontWeight: '800',
  },

  profileTitleSelected: {
    color: '#E8543E',
  },

  profileDescription: {
    color: '#72777C',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  form: {
    gap: 9,
  },

  label: {
    color: '#34383D',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 7,
  },

  input: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E3E5',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2328',
  },

  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF7F7',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -3,
  },

  button: {
    height: 58,
    backgroundColor: '#E8543E',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  loginText: {
    color: '#72777C',
    fontSize: 14,
  },

  loginLink: {
    color: '#E8543E',
    fontSize: 14,
    fontWeight: '700',
  },

  notice: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 18,
  },
});
