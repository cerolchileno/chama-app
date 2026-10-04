import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SolicitarScreen() {
  const { profissional, servico } =
    useLocalSearchParams<{
      profissional?: string;
      servico?: string;
    }>();

  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');

  function enviarSolicitacao() {
    if (!descricao.trim() || !endereco.trim()) {
      Alert.alert(
        'Preencha os dados',
        'Informe o endereço e descreva o serviço que você precisa.'
      );

      return;
    }

    Alert.alert(
      'Solicitação enviada!',
      `Seu pedido foi enviado para ${profissional}.`,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/cliente'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={25}
            color="#1F2328"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Solicitar serviço
        </Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.professionalCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={32}
              color="#F04B2F"
            />
          </View>

          <View>
            <Text style={styles.professionalName}>
              {profissional}
            </Text>

            <Text style={styles.service}>{servico}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          Conte o que você precisa
        </Text>

        <Text style={styles.subtitle}>
          Essas informações ajudarão o profissional a entender
          melhor a solicitação.
        </Text>

        <Text style={styles.label}>Endereço do serviço</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={21}
            color="#777"
          />

          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Digite o endereço"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.label}>
          Descreva o serviço
        </Text>

        <TextInput
          style={styles.descriptionInput}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: preciso instalar duas tomadas na sala..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        />

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#F04B2F"
          />

          <Text style={styles.noticeText}>
            O profissional receberá sua solicitação e poderá
            aceitar ou recusar o atendimento.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={enviarSolicitacao}
        >
          <Text style={styles.buttonText}>
            Enviar solicitação
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F2328',
  },

  content: {
    padding: 22,
  },

  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  professionalName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2328',
  },

  service: {
    color: '#F04B2F',
    fontSize: 13,
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2328',
  },

  subtitle: {
    color: '#6D7277',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    color: '#34383D',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },

  inputContainer: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 9,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2328',
  },

  descriptionInput: {
    minHeight: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    padding: 15,
    fontSize: 15,
    color: '#1F2328',
  },

  notice: {
    flexDirection: 'row',
    backgroundColor: '#FFF1EE',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 20,
  },

  noticeText: {
    flex: 1,
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
  },

  button: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F04B2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});