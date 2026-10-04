import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categorias = [
  { nome: 'Montador', icone: 'construct-outline' },
  { nome: 'Ar-condicionado', icone: 'snow-outline' },
  { nome: 'Eletricista', icone: 'flash-outline' },
  { nome: 'Encanador', icone: 'water-outline' },
  { nome: 'Pintor', icone: 'color-palette-outline' },
  { nome: 'Limpeza', icone: 'sparkles-outline' },
  { nome: 'Marceneiro', icone: 'hammer-outline' },
  { nome: 'Mais serviços', icone: 'ellipsis-horizontal' },
];

const profissionais = [
  {
    id: '1',
    nome: 'Carlos Silva',
    servico: 'Eletricista',
    nota: '4,9',
  },
  {
    id: '2',
    nome: 'Rafael Lima',
    servico: 'Ar-condicionado',
    nota: '4,8',
  },
  {
    id: '3',
    nome: 'Juliana Costa',
    servico: 'Limpeza',
    nota: '4,9',
  },
];

export default function ClienteScreen() {
  const [busca, setBusca] = useState('');

  function abrirCategoria(servico: string) {
    if (servico === 'Mais serviços') {
      router.push({
        pathname: '/profissionais',
        params: {
          servico: 'Todos os serviços',
        },
      });

      return;
    }

    router.push({
      pathname: '/profissionais',
      params: {
        servico,
      },
    });
  }

  function pesquisarServico() {
    const termo = busca.trim();

    if (!termo) {
      Alert.alert(
        'Digite um serviço',
        'Informe o serviço que você está procurando.'
      );

      return;
    }

    router.push({
      pathname: '/profissionais',
      params: {
        servico: termo,
      },
    });
  }

  function abrirProfissional(
    id: string,
    servico: string
  ) {
    router.push({
      pathname: '/profissional',
      params: {
        id,
        servico,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.location}>
                Maricá, RJ
              </Text>

              <Ionicons
                name="chevron-down"
                size={15}
                color="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Notificações',
                  'Você ainda não possui novas notificações.'
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.brand}>CHAMA</Text>

          <Text style={styles.greeting}>Olá!</Text>

          <Text style={styles.question}>
            Qual serviço você precisa hoje?
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={21}
              color="#777777"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Qual serviço você precisa?"
              placeholderTextColor="#8B8B8B"
              value={busca}
              onChangeText={setBusca}
              returnKeyType="search"
              onSubmitEditing={pesquisarServico}
            />

            {busca.length > 0 && (
              <TouchableOpacity
                onPress={() => setBusca('')}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.8}
            onPress={pesquisarServico}
          >
            <Text style={styles.searchButtonText}>
              Buscar profissionais
            </Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORIAS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Categorias
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profissionais',
                  params: {
                    servico: 'Todos os serviços',
                  },
                })
              }
            >
              <Text style={styles.seeAll}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.nome}
                style={styles.categoryItem}
                activeOpacity={0.7}
                onPress={() =>
                  abrirCategoria(categoria.nome)
                }
              >
                <View style={styles.categoryIcon}>
                  <Ionicons
                    name={categoria.icone as any}
                    size={27}
                    color="#F04B2F"
                  />
                </View>

                <Text
                  style={styles.categoryText}
                  numberOfLines={2}
                >
                  {categoria.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BANNER */}

        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              Profissionais confiáveis perto de você
            </Text>

            <Text style={styles.bannerDescription}>
              Encontre o profissional ideal para o serviço
              que você precisa.
            </Text>

            <TouchableOpacity
              style={styles.bannerButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/profissionais',
                  params: {
                    servico: 'Todos os serviços',
                  },
                })
              }
            >
              <Text style={styles.bannerButtonText}>
                Encontrar profissional
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bannerIcon}>
            <Ionicons
              name="construct"
              size={58}
              color="#FFCE8A"
            />
          </View>
        </View>

        {/* PROFISSIONAIS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Profissionais em destaque
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profissionais',
                  params: {
                    servico: 'Todos os serviços',
                  },
                })
              }
            >
              <Text style={styles.seeAll}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {profissionais.map((profissional) => (
              <TouchableOpacity
                key={profissional.id}
                style={styles.professionalCard}
                activeOpacity={0.8}
                onPress={() =>
                  abrirProfissional(
                    profissional.id,
                    profissional.servico
                  )
                }
              >
                <View style={styles.professionalAvatar}>
                  <Ionicons
                    name="person"
                    size={38}
                    color="#F04B2F"
                  />
                </View>

                <Text style={styles.professionalName}>
                  {profissional.nome}
                </Text>

                <View style={styles.ratingRow}>
                  <Ionicons
                    name="star"
                    size={15}
                    color="#FFB000"
                  />

                  <Text style={styles.rating}>
                    {profissional.nota}
                  </Text>
                </View>

                <Text style={styles.professionalService}>
                  {profissional.servico}
                </Text>

                <View style={styles.professionalLocation}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color="#777"
                  />

                  <Text
                    style={
                      styles.professionalLocationText
                    }
                  >
                    Maricá, RJ
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* MENU INFERIOR */}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons
            name="home"
            size={23}
            color="#F04B2F"
          />

          <Text style={styles.navTextActive}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Pedidos',
              'A área de pedidos será conectada na próxima etapa do MVP.'
            )
          }
        >
          <Ionicons
            name="document-text-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Pedidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Favoritos',
              'A área de profissionais favoritos será implementada em uma próxima etapa.'
            )
          }
        >
          <Ionicons
            name="heart-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Perfil',
              'A área de perfil do cliente será implementada em uma próxima etapa.'
            )
          }
        >
          <Ionicons
            name="person-outline"
            size={23}
            color="#737373"
          />

          <Text style={styles.navText}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 90,
  },

  header: {
    backgroundColor: '#F04B2F',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  location: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '900',
  },

  question: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },

  searchContainer: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: '#222222',
    fontSize: 15,
  },

  searchButton: {
    height: 47,
    borderRadius: 14,
    backgroundColor: '#1F2328',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },

  sectionTitle: {
    color: '#1E1E1E',
    fontSize: 19,
    fontWeight: '800',
  },

  seeAll: {
    color: '#F04B2F',
    fontSize: 13,
    fontWeight: '700',
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 20,
  },

  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  categoryText: {
    color: '#333333',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  banner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#1F2328',
    borderRadius: 20,
    padding: 21,
    minHeight: 175,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  bannerContent: {
    width: '70%',
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 26,
  },

  bannerDescription: {
    color: '#D6D6D6',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  bannerButton: {
    backgroundColor: '#F04B2F',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 14,
  },

  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  bannerIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  professionalCard: {
    width: 145,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 17,
    padding: 13,
    marginRight: 12,
  },

  professionalAvatar: {
    height: 90,
    borderRadius: 13,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },

  professionalName: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '800',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  rating: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '700',
  },

  professionalService: {
    color: '#666666',
    fontSize: 11,
    marginTop: 5,
  },

  professionalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 2,
  },

  professionalLocationText: {
    color: '#888888',
    fontSize: 10,
  },

  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 7,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    gap: 3,
  },

  navText: {
    color: '#737373',
    fontSize: 10,
  },

  navTextActive: {
    color: '#F04B2F',
    fontSize: 10,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 20,
  },
});