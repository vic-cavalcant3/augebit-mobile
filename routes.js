import { createStackNavigator } from "@react-navigation/stack";
import Agenda from "./pages/ag";



const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
        
      <Stack.Screen
        name="agendar"
        component={Agenda}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="entrada"
        component={Acesso}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="saida"
        component={saida}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="sucesso"
        component={Sucesso}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
