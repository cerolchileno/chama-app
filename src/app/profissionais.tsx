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

const profissionais = [
  {
    id: '1',
    nome: 'Carlos Silva',
    nota: '4,9',
    avaliacoes: 124,
    distancia: '2,1 km',
    preco: 'R$ 80',
  },
  {
    id: '2',
    nome: 'Marcos Oliveira',
    nota: '4,8',
    avaliacoes: 96,
    distancia: '3,4 km',
    preco: 'R$ 70',
  },
  {
    id: '3',
    nome: 'André Santos',
    nota: '4,8',
    avaliacoes: 82,
    distancia: '4,2 km',
    preco: 'R$ 90',
  },
  {
    id: '4',
    nome: 'Paulo Ribeiro',
    nota: '4,7',
    avaliacoes: 68,
    distancia: '5,1 km',
    preco: 'R$ 80',
  },
];

export default function ProfissionaisScreen() {
  const { servico } = useLocalSearchParams<{ servico?: string }>();
  const titulo = servico || 'Profissionais';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="#1F2328" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{titulo}</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.search}>
          <Ionicons name="search" size={20} color="#777" />
          <Text style={styles.searchText}>
            Buscar profissional ou serviço...
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          <TouchableOpacity style={styles.filterActive}>
            <Text style={styles.filterActiveText}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Mais bem avaliados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Mais próximos</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.resultTitle}>
          Profissionais encontrados
        </Text>

        {profissionais.map((profissional) => (
          <TouchableOpacity
            key={profissional.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/profissional',
                params: {
                  id: profissional.id,
                  servico: titulo,
                },
              })
            }
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={37} color="#F04B2F" />
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profissional.nome}</Text>

                <Ionicons
                  name="heart-outline"
                  size={21}
                  color="#333"
                />
              </View>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={15} color="#FFB000" />

                <Text style={styles.rating}>
                  {profissional.nota}
                </Text>

                <Text style={styles.reviews}>
                  ({profissional.avaliacoes})
                </Text>
              </View>

              <Text style={styles.service}>{titulo}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.distance}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color="#777"
                  />

                  <Text style={styles.distanceText}>
                    {profissional.distancia} • Maricá, RJ
                  </Text>
                </View>

                <View>
                  <Text style={styles.from}>A partir de</Text>
                  <Text style={styles.price}>
                    {profissional.preco}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2328',
  },

  headerSpace: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  search: {
    height: 53,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  searchText: {
    color: '#888',
    fontSize: 14,
  },

  filters: {
    gap: 9,
    paddingVertical: 18,
  },

  filterActive: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F04B2F',
    backgroundColor: '#FFF3F0',
  },

  filterActiveText: {
    color: '#F04B2F',
    fontWeight: '700',
    fontSize: 12,
  },

  filter: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: '#FFFFFF',
  },

  filterText: {
    color: '#444',
    fontSize: 12,
  },

  resultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2328',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  avatar: {
    width: 82,
    height: 100,
    backgroundColor: '#FFF1EE',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  info: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2328',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 5,
  },

  rating: {
    fontSize: 13,
    fontWeight: '700',
  },

  reviews: {
    color: '#777',
    fontSize: 11,
  },

  service: {
    color: '#666',
    fontSize: 12,
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },

  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  distanceText: {
    color: '#777',
    fontSize: 10,
  },

  from: {
    color: '#888',
    fontSize: 9,
    textAlign: 'right',
  },

  price: {
    color: '#1F2328',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'right',
  },
});