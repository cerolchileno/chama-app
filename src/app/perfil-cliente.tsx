
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#F04B2F',
  dark: '#1F2328',
  background: '#F7F7F7',
  white: '#FFFFFF',
  muted: '#858B93',
  border: '#ECEEF0',
  soft: '#FFF1EE',
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function PerfilClienteScreen() {
  function aviso(titulo: string) {
    Alert.alert(
      titulo,
      'Essa funcionalidade será implementada em uma próxima etapa do CHAMA.'
    );
  }

  function sairDaConta() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  }

  function MenuItem({
    icon,
    title,
    subtitle,
    onPress,
    danger = false,
  }: {
    icon: IconName;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
  }) {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <View
          style={[
            styles.menuIcon,
            danger && styles.dangerIcon,
          ]}
        >
          <Ionicons
            name={icon}
            size={21}
            color={danger ? '#D64545' : COLORS.primary}
          />
        </View>

        <View style={styles.menuTextContainer}>
          <Text
            style={[
              styles.menuTitle,
              danger && { color: '#D64545' },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.menuSubtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {!danger && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#AAB0B6"
          />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Meu perfil
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => aviso('Configurações')}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={43}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.userName}>
              Cliente CHAMA
            </Text>

            <View style={styles.accountBadge}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#FFFFFF"
              />
              <Text style={styles.accountBadgeText}>
                Conta de cliente
              </Text>
            </View>

            <Text style={styles.profileDescription}>
              Seus serviços, informações e preferências em um só lugar.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Ionicons
                name="sparkles"
                size={25}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>
                Sua experiência CHAMA
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Gerencie suas solicitações e acompanhe seus atendimentos.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Acesso rápido
          </Text>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push('/pedidos')}
            >
              <View style={styles.quickIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={25}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.quickTitle}>
                Meus pedidos
              </Text>
              <Text style={styles.quickSubtitle}>
                Em andamento
              </Text>
              <Ionicons
                name="arrow-forward"
                size={17}
                color={COLORS.primary}
                style={styles.quickArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push('/historico')}
            >
              <View style={styles.quickIcon}>
                <Ionicons
                  name="time-outline"
                  size={25}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.quickTitle}>
                Histórico
              </Text>
              <Text style={styles.quickSubtitle}>
                Serviços encerrados
              </Text>
              <Ionicons
                name="arrow-forward"
                size={17}
                color={COLORS.primary}
                style={styles.quickArrow}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            Minha conta
          </Text>

          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              title="Dados pessoais"
              subtitle="Nome, telefone e e-mail"
              onPress={() => aviso('Dados pessoais')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="location-outline"
              title="Meus endereços"
              subtitle="Gerencie seus locais de atendimento"
              onPress={() => aviso('Meus endereços')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="heart-outline"
              title="Profissionais favoritos"
              subtitle="Acesse seus profissionais preferidos"
              onPress={() => aviso('Favoritos')}
            />
          </View>

          <Text style={styles.sectionTitle}>
            Preferências e suporte
          </Text>

          <View style={styles.menuCard}>
            <MenuItem
              icon="notifications-outline"
              title="Notificações"
              subtitle="Avisos e atualizações de pedidos"
              onPress={() => aviso('Notificações')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacidade e segurança"
              subtitle="Proteção dos dados da sua conta"
              onPress={() => aviso('Privacidade e segurança')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="help-circle-outline"
              title="Central de ajuda"
              subtitle="Dúvidas e suporte"
              onPress={() => aviso('Central de ajuda')}
            />
          </View>

          <View style={styles.menuCard}>
            <MenuItem
              icon="log-out-outline"
              title="Sair da conta"
              subtitle="Voltar para a tela de acesso"
              danger
              onPress={sairDaConta}
            />
          </View>

          <Text style={styles.footer}>
            CHAMA • Precisa de um serviço? CHAMA.
          </Text>
          <Text style={styles.version}>
            Versão MVP
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
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
  backButton: {
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
  profileInfo: {
    alignItems: 'center',
    marginTop: 22,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.soft,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 13,
  },
  accountBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  accountBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  profileDescription: {
    color: '#C5C8CC',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 19,
    maxWidth: 290,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },
  welcomeCard: {
    backgroundColor: COLORS.soft,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    color: '#6E7379',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 25,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    minHeight: 158,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
  },
  quickIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 13,
  },
  quickSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  quickArrow: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  menuItem: {
    minHeight: 72,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  dangerIcon: {
    backgroundColor: '#FFF0F0',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '800',
  },
  menuSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 71,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 17,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#A6AAB0',
    fontSize: 10,
    marginTop: 5,
  },
});
