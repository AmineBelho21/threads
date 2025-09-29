import { tokenCache } from "@/utlis/cache";
import { ClerkLoaded, ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from "@expo-google-fonts/dm-sans";
import * as Sentry from "@sentry/react-native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error("Missing Publishable Key. Please set the EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.");
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  attachScreenshot: true,
  debug: true, // Keep true to see console logs
  tracesSampleRate: 1.0,
  _experiments: {
    profileSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    Sentry.reactNavigationIntegration(), // Add this!
    Sentry.mobileReplayIntegration({
      maskAllText: false, // Set to false to see actual content in replays
      maskAllImages: false,
    }),
  ],
  // Important: Enable replays
  enableCaptureFailedRequests: true,
});

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
  const user = useUser();

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

  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({ 
        email: user.user.emailAddresses[0].emailAddress, 
        id: user.user.id 
    });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return (
    <Slot />
  );
}

// Fixed Sentry.wrap syntax
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