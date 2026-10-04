import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const profissionais: Record<
  string,
  {
    nome: string;
    nota: string;
    avaliacoes: number;
    distancia: string;
    servicos: number;
    experiencia: string;
  }
> = {
  '1': {
    nome: 'Carlos Silva',
    nota: '4,9',
    avaliacoes: 124,
    distancia: '2,1 km',
    servicos: 120,
    experiencia: '3 anos',
  },

  '2': {
    nome: 'Marcos Oliveira',
    nota: '4,8',
    avaliacoes: 96,
    distancia: '3,4 km',
    servicos: 98,
    experiencia: '4 anos',
  },

  '3': {
    nome: 'André Santos',
    nota: '4,8',
    avaliacoes: 82,
    distancia: '4,2 km',
    servicos: 87,
    experiencia: '2 anos',
  },

  '4': {
    nome: 'Paulo Ribeiro',
    nota: '4,7',
    avaliacoes: 68,
    distancia: '5,1 km',
    servicos: 72,
    experiencia: '3 anos',
  },
};

export default function ProfissionalScreen() {
  const { id = '1', servico = 'Eletricista' } =
    useLocalSearchParams<{
      id?: string;
      servico?: string;
    }>();

  const profissional =
    profissionais[id] || profissionais['1'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons
              name="heart-outline"
              size={24}
              color="#F04B2F"
            />
          </TouchableOpacity>

          <View style={styles.heroAvatar}>
            <Ionicons
              name="person"
              size={75}
              color="#F04B2F"
            />
          </View>
        </View>

        <View style={styles.profile}>
          <Text style={styles.name}>{profissional.nome}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FFB000" />

            <Text style={styles.rating}>
              {profissional.nota}
            </Text>

            <Text style={styles.reviews}>
              ({profissional.avaliacoes} avaliações)
            </Text>
          </View>

          <Text style={styles.service}>{servico}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons
                name="location-outline"
                size={22}
                color="#1F2328"
              />

              <Text style={styles.statValue}>
                {profissional.distancia}
              </Text>

              <Text style={styles.statLabel}>Maricá, RJ</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Ionicons
                name="briefcase-outline"
                size={22}
                color="#1F2328"
              />

              <Text style={styles.statValue}>
                {profissional.servicos}+
              </Text>

              <Text style={styles.statLabel}>serviços</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#1F2328"
              />

              <Text style={styles.statValue}>
                {profissional.experiencia}
              </Text>

              <Text style={styles.statLabel}>experiência</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre mim</Text>

            <Text style={styles.about}>
              Profissional especializado em serviços residenciais,
              buscando oferecer atendimento com qualidade,
              responsabilidade e pontualidade.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Serviços oferecidos
            </Text>

            <View style={styles.tags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{servico}</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  Instalações
                </Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  Manutenção
                </Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  Reparos em geral
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações</Text>

            <View style={styles.review}>
              <View style={styles.reviewAvatar}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#F04B2F"
                />
              </View>

              <View style={styles.reviewContent}>
                <Text style={styles.reviewName}>
                  Juliana M.
                </Text>

                <View style={styles.reviewRating}>
                  <Ionicons
                    name="star"
                    size={14}
                    color="#FFB000"
                  />
                  <Text style={styles.reviewScore}>5,0</Text>
                </View>

                <Text style={styles.reviewText}>
                  Excelente profissional. Atendimento rápido e
                  serviço de qualidade.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() =>
            router.push({
              pathname: '/solicitar',
              params: {
                profissional: profissional.nome,
                servico,
              },
            })
          }
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.requestButtonText}>
            Solicitar serviço
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

  scroll: {
    paddingBottom: 110,
  },

  hero: {
    height: 240,
    backgroundColor: '#1F2328',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  heroAvatar: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 18,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  favoriteButton: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profile: {
    padding: 22,
  },

  name: {
    fontSize: 27,
    fontWeight: '900',
    color: '#1F2328',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },

  rating: {
    fontWeight: '800',
    fontSize: 15,
  },

  reviews: {
    color: '#777',
    fontSize: 13,
  },

  service: {
    color: '#F04B2F',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },

  stats: {
    flexDirection: 'row',
    marginTop: 25,
    backgroundColor: '#F7F7F7',
    borderRadius: 17,
    paddingVertical: 18,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },

  statLabel: {
    color: '#777',
    fontSize: 10,
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: '#DDDDDD',
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F2328',
    marginBottom: 10,
  },

  about: {
    color: '#62666A',
    fontSize: 14,
    lineHeight: 22,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
  },

  tagText: {
    color: '#444',
    fontSize: 12,
  },

  review: {
    flexDirection: 'row',
    paddingVertical: 8,
  },

  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  reviewContent: {
    flex: 1,
  },

  reviewName: {
    fontSize: 14,
    fontWeight: '800',
  },

  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },

  reviewScore: {
    fontSize: 12,
    fontWeight: '700',
  },

  reviewText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  requestButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F04B2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});