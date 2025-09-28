import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#000",
            }}
        >
            <Tabs.Screen 
                name="feed" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="favorites" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="heart" size={24} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="create" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="add-circle" size={24} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="search" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="search" size={24} color={color} />
                    ),
                }} 
            />
        </Tabs>
    )
}

export default Layout;