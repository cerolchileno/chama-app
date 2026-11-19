
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  carregarEnderecosCliente,
  EnderecoCliente,
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
};

export default function EnderecosScreen() {
  const [enderecos, setEnderecos] = useState<EnderecoCliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        setCarregando(true);

        try {
          const lista = await carregarEnderecosCliente();

          if (ativo) {
            setEnderecos(lista);
          }
        } catch {
          if (ativo) {
            Alert.alert(
              'Erro ao carregar',
              'Não foi possível recuperar seus endereços.'
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
    }, [])
  );

  async function atualizarEnderecos(lista: EnderecoCliente[]) {
    if (processando) return;

    setProcessando(true);

    try {
      await salvarEnderecosCliente(lista);
      setEnderecos(lista);
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível atualizar seus endereços.'
      );
    } finally {
      setProcessando(false);
    }
  }

  function definirPrincipal(id: string) {
    if (processando) return;

    const listaAtualizada = enderecos.map((endereco) => ({
      ...endereco,
      principal: endereco.id === id,
    }));

    void atualizarEnderecos(listaAtualizada);
  }

  function excluirEndereco(endereco: EnderecoCliente) {
    if (processando) return;

    Alert.alert(
      'Excluir endereço',
      `Deseja realmente excluir "${endereco.apelido}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const restantes = enderecos.filter(
              (item) => item.id !== endereco.id
            );

            if (
              endereco.principal &&
              restantes.length > 0
            ) {
              restantes[0] = {
                ...restantes[0],
                principal: true,
              };
            }

            void atualizarEnderecos(restantes);
          },
        },
      ]
    );
  }

  function abrirFormulario(id?: string) {
    if (processando) return;

    if (id) {
      router.push({
        pathname: '/formulario-endereco',
        params: { id },
      });
      return;
    }

    router.push('/formulario-endereco');
  }

  function formatarEndereco(endereco: EnderecoCliente) {
    const linha = `${endereco.rua}, ${endereco.numero}`;

    return endereco.complemento.trim()
      ? `${linha} - ${endereco.complemento}`
      : linha;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.topBar}>
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
            Meus endereços
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="location"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            Seus locais de atendimento
          </Text>

          <Text style={styles.description}>
            Cadastre e organize os endereços onde deseja
            receber os serviços do CHAMA.
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Endereços cadastrados
            </Text>

            <Text style={styles.sectionSubtitle}>
              {enderecos.length}{' '}
              {enderecos.length === 1
                ? 'endereço salvo'
                : 'endereços salvos'}
            </Text>
          </View>

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {enderecos.length}
            </Text>
          </View>
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
            <Text style={styles.loadingText}>
              Carregando endereços...
            </Text>
          </View>
        ) : enderecos.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="map-outline"
                size={37}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum endereço cadastrado
            </Text>

            <Text style={styles.emptyDescription}>
              Adicione seu primeiro endereço para facilitar
              suas próximas solicitações de serviço.
            </Text>
          </View>
        ) : (
          enderecos.map((endereco) => (
            <View
              key={endereco.id}
              style={[
                styles.addressCard,
                endereco.principal && styles.primaryCard,
              ]}
            >
              <View style={styles.addressTop}>
                <View style={styles.addressIcon}>
                  <Ionicons
                    name={
                      endereco.apelido.toLowerCase().includes('casa')
                        ? 'home-outline'
                        : 'location-outline'
                    }
                    size={23}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.addressHeading}>
                  <Text style={styles.addressName}>
                    {endereco.apelido}
                  </Text>

                  {endereco.principal && (
                    <View style={styles.primaryBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={COLORS.primary}
                      />
                      <Text style={styles.primaryBadgeText}>
                        Principal
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.addressLine}>
                {formatarEndereco(endereco)}
              </Text>

              <Text style={styles.addressDetails}>
                {endereco.bairro} - {endereco.cidade}/{endereco.estado}
              </Text>

              <Text style={styles.addressCep}>
                CEP: {endereco.cep}
              </Text>

              <View style={styles.cardDivider} />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => abrirFormulario(endereco.id)}
                  disabled={processando}
                >
                  <Ionicons
                    name="create-outline"
                    size={17}
                    color={COLORS.dark}
                  />
                  <Text style={styles.actionText}>
                    Editar
                  </Text>
                </TouchableOpacity>

                {!endereco.principal && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => definirPrincipal(endereco.id)}
                    disabled={processando}
                  >
                    <Ionicons
                      name="star-outline"
                      size={17}
                      color={COLORS.primary}
                    />
                    <Text style={styles.actionText}>
                      Principal
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => excluirEndereco(endereco)}
                  disabled={processando}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color="#D64545"
                  />
                  <Text style={styles.deleteText}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            (carregando || processando) && styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={carregando || processando}
          onPress={() => abrirFormulario()}
        >
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={COLORS.white}
          />

          <Text style={styles.addButtonText}>
            Adicionar endereço
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.infoText}>
            Seus endereços ficam armazenados neste
            dispositivo. O preenchimento automático por CEP
            será integrado em uma próxima etapa.
          </Text>
        </View>
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
    backgroundColor: COLORS.dark,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
  headerInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  headerIcon: {
    width: 68,
    height: 68,
    borderRadius: 21,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 15,
    textAlign: 'center',
  },
  description: {
    color: '#C5C8CC',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
    maxWidth: 300,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  counter: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 38,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    marginBottom: 14,
  },
  primaryCard: {
    borderColor: '#F8B9AD',
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressHeading: {
    flex: 1,
  },
  addressName: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '900',
  },
  primaryBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.soft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    marginTop: 6,
  },
  primaryBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  addressLine: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 15,
  },
  addressDetails: {
    color: '#6E747A',
    fontSize: 12,
    marginTop: 5,
  },
  addressCep: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 7,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 17,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  actionText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '800',
  },
  deleteText: {
    color: '#D64545',
    fontSize: 12,
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.soft,
    padding: 15,
    borderRadius: 15,
    marginTop: 19,
  },
  infoText: {
    color: '#6E7379',
    fontSize: 11,
    lineHeight: 18,
    flex: 1,
  },
});
