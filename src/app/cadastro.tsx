import { router } from 'expo-router';
import { useState } from 'react';
import {
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

  return (
    <SafeAreaView style={styles.container}>
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
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Telefone</Text>

          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Crie uma senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
});