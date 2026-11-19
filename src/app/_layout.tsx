
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { carregarSolicitacoes } from '../constants/solicitacoes';

export default function RootLayout() {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function inicializarAplicativo() {
      try {
        await carregarSolicitacoes();
      } catch (error) {
        console.error(
          'Erro ao inicializar solicitações:',
          error
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void inicializarAplicativo();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <View style={styles.carregamento}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F7F7F7',
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  carregamento: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
});
