import { tokenCache } from "@/utlis/cache";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from "@expo-google-fonts/dm-sans";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error("Missing Publishable Key. Please set the EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.");
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
 unsavedChangesWarning: false,
} );

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular, 
    DMSans_500Medium,
    DMSans_700Bold
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  return (
    <Slot />
  );
}


export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey!} 
      tokenCache={tokenCache} 
    >
      <ClerkLoaded>
        <ConvexProvider client={convex}>
          <InitialLayout />
        </ConvexProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
