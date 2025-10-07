import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useUserProfile } from './useUserProfile';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const usePush = () => {
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    const { userProfile } = useUserProfile();
    const updateUser = useMutation(api.users.updateUser)
    const router = useRouter();

    useEffect(() => {
        if (!Device.isDevice) return;
        registerForPushNotificationsAsync().then((token) => {
            if (token && userProfile?._id) {
                updateUser({ _id: userProfile?._id, pushToken: token })
            }
        })
            .catch((error) => {
                console.log(error)
            })

        // Recieved notification
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log('recieved notification', notification);
        });

        // Tapped on notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const threadId = response.notification.request.content.data.threadId;
            console.log(
                '🚀 ~ responseListener.current=Notifications.addNotificationResponseReceivedListener ~ threadId:',
                threadId
            );
            router.push(`/feed/${threadId}`);
        });



    }, [userProfile?._id])



    function handleRegistrationError(errorMessage: string) {
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                handleRegistrationError('Permission not granted to get push token for push notification!');
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError('Project ID not found');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(pushTokenString);
                return pushTokenString;
            } catch (e: unknown) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }
};