import { router } from 'expo-router';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>

          <Text style={styles.appName}>CHAMA</Text>

          <Text style={styles.slogan}>
            Precisa de um serviço? CHAMA.
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>
            Encontre quem resolve.
          </Text>

          <Text style={styles.description}>
            Encontre profissionais, solicite serviços e acompanhe tudo
            de forma simples em um só lugar.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/cadastro')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Criar minha conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footer}>
        Serviços perto de você, quando precisar.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2328',
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 20,
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: '#E8543E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
  },

  appName: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
  },

  slogan: {
    color: '#FFCE8A',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 7,
  },

  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
    marginBottom: 14,
  },

  description: {
    color: '#D3D6DA',
    fontSize: 17,
    lineHeight: 26,
  },

  buttonsContainer: {
    gap: 13,
  },

  primaryButton: {
    backgroundColor: '#E8543E',
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  secondaryButton: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  footer: {
    color: '#92979D',
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 25,
  },
});