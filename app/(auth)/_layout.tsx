import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
