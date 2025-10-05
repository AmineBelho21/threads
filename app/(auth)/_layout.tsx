import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "modal",
          title: "New Thread",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal-circle" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Stack.Screen
        name="(modal)/image/[url]"
        options={{
          presentation: "fullScreenModal",
          title: "",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
