import { tokenCache } from "@/utlis/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from "@expo-google-fonts/dm-sans";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://7cfc51944203a25cd6a9200fec787920@o4510098045599744.ingest.de.sentry.io/4510098056478800',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(auth)';

    if (isSignedIn && !inTabsGroup) {
      router.replace('/(auth)/(tabs)/feed');
    } else if (!isSignedIn && inTabsGroup) {
      router.replace('/(public)');
    }
  }, [isSignedIn]);

  return (
    <Slot />
  );
}


export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey!} 
      tokenCache={tokenCache} 
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
});