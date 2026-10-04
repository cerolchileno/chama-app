import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹ Voltar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.brand}>CHAMA</Text>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>
              Entre para continuar procurando ou oferecendo serviços.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#9A9A9A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#9A9A9A"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não tem uma conta?
            </Text>

            <TouchableOpacity onPress={() => router.push('/cadastro')}>
              <Text style={styles.registerLink}> Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 40,
  },

  backText: {
    color: '#E8543E',
    fontSize: 16,
    fontWeight: '700',
  },

  header: {
    marginBottom: 35,
  },

  brand: {
    color: '#E8543E',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  title: {
    color: '#1F2328',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    color: '#6E747A',
    fontSize: 16,
    lineHeight: 23,
  },

  form: {
    gap: 10,
  },

  label: {
    color: '#34383D',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E3E5',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2328',
  },

  loginButton: {
    backgroundColor: '#E8543E',
    height: 58,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  registerText: {
    color: '#6E747A',
    fontSize: 14,
  },

  registerLink: {
    color: '#E8543E',
    fontSize: 14,
    fontWeight: '700',
  },
});