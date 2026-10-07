import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  adicionarAvaliacao,
  buscarSolicitacaoPorId,
} from '@/constants/solicitacoes';

export default function AvaliarScreen() {
  const params = useLocalSearchParams<{
    id?: string;
  }>();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const pedido = id
    ? buscarSolicitacaoPorId(id)
    : undefined;

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] =
    useState('');

  function enviarAvaliacao() {
    if (!id || !pedido) {
      Alert.alert(
        'Erro',
        'Não foi possível localizar este serviço.'
      );
      return;
    }

    if (pedido.status !== 'CONCLUIDA') {
      Alert.alert(
        'Avaliação indisponível',
        'Somente serviços concluídos podem ser avaliados.'
      );
      return;
    }

    if (pedido.avaliacao) {
      Alert.alert(
        'Serviço já avaliado',
        'Este atendimento já possui uma avaliação.'
      );
      return;
    }

    if (nota === 0) {
      Alert.alert(
        'Escolha uma nota',
        'Selecione de 1 a 5 estrelas para avaliar o atendimento.'
      );
      return;
    }

    const sucesso = adicionarAvaliacao(
      id,
      nota,
      comentario
    );

    if (!sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível registrar sua avaliação.'
      );
      return;
    }

    Alert.alert(
      'Avaliação enviada!',
      'Obrigado por avaliar o atendimento.',
      [
        {
          text: 'Voltar ao histórico',
          onPress: () =>
            router.replace('/historico'),
        },
      ]
    );
  }

  if (!pedido) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Avaliar atendimento
            </Text>

            <View style={styles.headerPlaceholder} />
          </View>
        </View>

        <View style={styles.notFound}>
          <View style={styles.notFoundIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color="#F04B2F"
            />
          </View>

          <Text style={styles.notFoundTitle}>
            Serviço não encontrado
          </Text>

          <Text style={styles.notFoundText}>
            Não foi possível localizar o serviço
            selecionado.
          </Text>

          <TouchableOpacity
            style={styles.backToHistoryButton}
            activeOpacity={0.8}
            onPress={() =>
              router.replace('/historico')
            }
          >
            <Text
              style={styles.backToHistoryButtonText}
            >
              Voltar ao histórico
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Avaliar atendimento
            </Text>

            <View style={styles.headerPlaceholder} />
          </View>

          <Text style={styles.headerDescription}>
            Conte como foi sua experiência.
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* SERVIÇO */}

          <View style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <Ionicons
                name="construct-outline"
                size={27}
                color="#F04B2F"
              />
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceLabel}>
                Serviço realizado
              </Text>

              <Text style={styles.serviceName}>
                {pedido.servico}
              </Text>

              <Text style={styles.professionalName}>
                {pedido.profissional}
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={26}
              color="#1A9B63"
            />
          </View>

          {/* AVALIAÇÃO */}

          <View style={styles.ratingCard}>
            <View style={styles.ratingIcon}>
              <Ionicons
                name="star-outline"
                size={28}
                color="#F04B2F"
              />
            </View>

            <Text style={styles.ratingTitle}>
              Como foi o atendimento?
            </Text>

            <Text style={styles.ratingDescription}>
              Sua avaliação ajuda a melhorar a
              experiência no CHAMA.
            </Text>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(
                (estrela) => (
                  <TouchableOpacity
                    key={estrela}
                    activeOpacity={0.7}
                    style={styles.starButton}
                    onPress={() =>
                      setNota(estrela)
                    }
                  >
                    <Ionicons
                      name={
                        estrela <= nota
                          ? 'star'
                          : 'star-outline'
                      }
                      size={40}
                      color="#FFB000"
                    />
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.ratingText}>
              {nota === 0 &&
                'Toque nas estrelas para avaliar'}

              {nota === 1 &&
                '1 estrela — Muito ruim'}

              {nota === 2 &&
                '2 estrelas — Ruim'}

              {nota === 3 &&
                '3 estrelas — Regular'}

              {nota === 4 &&
                '4 estrelas — Muito bom'}

              {nota === 5 &&
                '5 estrelas — Excelente'}
            </Text>
          </View>

          {/* COMENTÁRIO */}

          <View style={styles.commentSection}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentTitle}>
                Deixe um comentário
              </Text>

              <Text style={styles.optional}>
                Opcional
              </Text>
            </View>

            <Text style={styles.commentDescription}>
              Conte o que você achou do atendimento
              realizado.
            </Text>

            <TextInput
              style={styles.commentInput}
              placeholder="Ex.: Profissional pontual, educado e realizou o serviço muito bem."
              placeholderTextColor="#A0A0A0"
              multiline
              textAlignVertical="top"
              maxLength={300}
              value={comentario}
              onChangeText={setComentario}
            />

            <Text style={styles.counter}>
              {comentario.length}/300
            </Text>
          </View>

          {/* AVISO */}

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#2878D0"
            />

            <Text style={styles.infoText}>
              A avaliação ficará vinculada a este
              atendimento e poderá ajudar outros
              usuários na escolha de profissionais.
            </Text>
          </View>

          {/* BOTÃO */}

          <TouchableOpacity
            style={[
              styles.submitButton,
              nota === 0 &&
                styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={enviarAvaliacao}
          >
            <Ionicons
              name="star"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.submitButtonText}>
              Enviar avaliação
            </Text>
          </TouchableOpacity>
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

  header: {
    backgroundColor: '#1F2328',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 27,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  headerPlaceholder: {
    width: 42,
  },

  headerDescription: {
    color: '#BFC3C7',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  serviceIcon: {
    width: 53,
    height: 53,
    borderRadius: 15,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  serviceInfo: {
    flex: 1,
  },

  serviceLabel: {
    color: '#8A8A8A',
    fontSize: 10,
    fontWeight: '700',
  },

  serviceName: {
    color: '#1F2328',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },

  professionalName: {
    color: '#777777',
    fontSize: 12,
    marginTop: 3,
  },

  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 22,
    alignItems: 'center',
    marginTop: 18,
  },

  ratingIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingTitle: {
    color: '#1F2328',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 15,
  },

  ratingDescription: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },

  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  starButton: {
    paddingHorizontal: 3,
    paddingVertical: 5,
  },

  ratingText: {
    color: '#62666A',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    minHeight: 18,
    textAlign: 'center',
  },

  commentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 17,
    marginTop: 18,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  commentTitle: {
    color: '#1F2328',
    fontSize: 16,
    fontWeight: '900',
  },

  optional: {
    color: '#8A8A8A',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  commentDescription: {
    color: '#777777',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  commentInput: {
    minHeight: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: '#1F2328',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },

  counter: {
    color: '#A0A0A0',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 6,
  },

  infoBox: {
    backgroundColor: '#EEF5FD',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 18,
  },

  infoText: {
    flex: 1,
    color: '#45647F',
    fontSize: 11,
    lineHeight: 17,
  },

  submitButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#F04B2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  notFoundIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundTitle: {
    color: '#1F2328',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 18,
  },

  notFoundText: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },

  backToHistoryButton: {
    backgroundColor: '#F04B2F',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 20,
  },

  backToHistoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});