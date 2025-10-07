import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShadowVisible: false, headerTitleAlign: 'center',headerTitle: 'Search' }} />
    </Stack>
  );
};

export default Layout;
