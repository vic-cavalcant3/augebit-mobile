import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";

export default function Agendamento() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [profissional, setProfissional] = useState("");
  const [loading, setLoading] = useState(false);

  const profissionais = [
    { label: "Selecione um profissional", value: "" },
    { label: "Dr. João Silva - Psicólogo", value: "Dr. João Silva" },
    { label: "Dra. Maria Santos - Psiquiatra", value: "Dra. Maria Santos" },
    { label: "Dr. Pedro Costa - Terapeuta", value: "Dr. Pedro Costa" },
    { label: "Dra. Ana Oliveira - Psicóloga", value: "Dra. Ana Oliveira" },
    { label: "Dr. Carlos Lima - Psiquiatra", value: "Dr. Carlos Lima" },
  ];

  const formatarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const dismissKeyboard = () => {
    try {
      if (Keyboard && typeof Keyboard.dismiss === "function") {
        Keyboard.dismiss();
      }
    } catch (error) {
      console.log("Erro ao dismissar teclado:", error);
    }
  };

  const agendar = async () => {
    if (!nome.trim() || !cpf.trim() || !telefone.trim() || !email.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido");
      return;
    }

    if (!profissional) {
      Alert.alert("Erro", "Selecione um profissional");
      return;
    }

    if (!data || !hora) {
      Alert.alert("Erro", "Preencha a data e horário da consulta");
      return;
    }

    const dataCompleta = new Date(`${data}T${hora}`);
    if (isNaN(dataCompleta.getTime()) || dataCompleta <= new Date()) {
      Alert.alert("Erro", "Informe uma data e horário válidos no futuro");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          cpf: cpf.replace(/[^\d]+/g, ""),
          telefone,
          email,
          data_sessao: dataCompleta.toISOString(),
          profissional,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Sucesso!", "Agendamento realizado com sucesso!");
        setNome("");
        setCpf("");
        setTelefone("");
        setEmail("");
        setData("");
        setHora("");
        setProfissional("");
      } else {
        Alert.alert("Erro", result.message || "Erro ao realizar agendamento");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <View style={styles.headerContent}>
            <Text style={styles.message}>Agendar Sessão</Text>
            <Text style={styles.subMessage}>
              Preencha os dados para marcar sua consulta
            </Text>
          </View>
          <View style={styles.decorativeCircle}></View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Nome completo"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="id-card-o"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="000.000.000-00"
                    style={styles.input}
                    value={cpf}
                    onChangeText={(text) => setCpf(formatarCPF(text))}
                    keyboardType="numeric"
                    maxLength={14}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather
                    name="phone"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Telefone"
                    style={styles.input}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="email"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Detalhes da Consulta</Text>

              <View style={styles.inputContainer}>
                <Feather
                  name="calendar"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Data (AAAA-MM-DD)"
                  style={styles.input}
                  value={data}
                  onChangeText={setData}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather
                  name="clock"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Horário (HH:MM)"
                  style={styles.input}
                  value={hora}
                  onChangeText={setHora}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="medical-services"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={profissional}
                    style={styles.picker}
                    onValueChange={(itemValue) => setProfissional(itemValue)}
                  >
                    {profissionais.map((prof) => (
                      <Picker.Item
                        key={prof.value}
                        label={prof.label}
                        value={prof.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={agendar}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Agendando..." : "Confirmar Agendamento"}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
        <StatusBar style="light" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  containerHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
    backgroundColor: "#6C63FF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  headerContent: {
    zIndex: 2,
  },
  decorativeCircle: {
    position: "absolute",
    right: -50,
    top: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  message: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 5,
  },
  subMessage: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  containerForm: {
    backgroundColor: "#F8F9FA",
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#6C63FF",
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  dateInput: {
    flex: 1,
    height: 40,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    color: "#333",
  },
  button: {
    backgroundColor: "#6C63FF",
    width: "100%",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
});