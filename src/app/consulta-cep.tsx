import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput,
  TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Endereco = {
  cep: string; logradouro: string; bairro: string;
  localidade: string; uf: string; erro?: boolean;
};

export default function ConsultaCep() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function consultar() {
    const limpo = cep.replace(/\D/g, '');
    setErro(''); setEndereco(null);
    if (limpo.length !== 8) {
      setErro('Digite um CEP com 8 numeros.'); return;
    }
    setCarregando(true);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      if (!resposta.ok) throw new Error('Falha na consulta.');
      const dados: Endereco = await resposta.json();
      if (dados.erro) { setErro('CEP nao encontrado.'); return; }
      setEndereco(dados);
    } catch {
      setErro('Nao foi possivel consultar. Verifique a internet.');
    } finally { setCarregando(false); }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <Text style={styles.titulo}>CHAMA - Consulta de CEP</Text>
      <Text style={styles.label}>CEP</Text>
      <TextInput style={styles.campo} value={cep}
        onChangeText={setCep} keyboardType="number-pad"
        placeholder="Ex.: 01001000" maxLength={9} />
      <TouchableOpacity style={styles.botao} onPress={consultar}
        disabled={carregando}>
        <Text style={styles.botaoTexto}>Consultar endereco</Text>
      </TouchableOpacity>
      {carregando && <ActivityIndicator />}
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
      {endereco && <View style={styles.resultado}>
        <Text>CEP: {endereco.cep}</Text>
        <Text>Rua: {endereco.logradouro || 'Nao informada'}</Text>
        <Text>Bairro: {endereco.bairro || 'Nao informado'}</Text>
        <Text>Cidade: {endereco.localidade}</Text>
        <Text>UF: {endereco.uf}</Text>
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24, backgroundColor: '#F7F7F7' },
  titulo: { fontSize: 24, fontWeight: '800', color: '#E8543E',
    marginBottom: 25 },
  label: { fontSize: 16, marginBottom: 8 },
  campo: { backgroundColor: '#FFF', borderWidth: 1,
    borderColor: '#DDD', borderRadius: 12, padding: 14 },
  botao: { backgroundColor: '#E8543E', borderRadius: 12,
    padding: 16, marginTop: 16, alignItems: 'center' },
  botaoTexto: { color: '#FFF', fontWeight: '700' },
  erro: { color: '#B91C1C', marginTop: 16 },
  resultado: { backgroundColor: '#FFF', padding: 16,
    marginTop: 20, borderRadius: 12, gap: 7 },
});