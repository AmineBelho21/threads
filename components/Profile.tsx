 
import { Colors } from '@/constants/Colors';
import { Id } from '@/convex/_generated/dataModel';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserProfile from './UserProfile';

type ProfileProps = {
    userId?: Id<'users'>;
    showBackButton?: boolean;
}

const Profile = ({ userId, showBackButton = false }: ProfileProps) => {
    const { userProfile } = useUserProfile();
    const { top } = useSafeAreaInsets();
    const { signOut } = useAuth();
    const router = useRouter();

    return (
        <View style={[ styles.container, { paddingTop: top } ]}>
            <FlatList 
                data={[]}
                renderItem={({ item }) => (<Text>test iniz</Text>)}
                ListEmptyComponent={() => (<Text>No data available</Text>)}
                ItemSeparatorComponent={() => (<View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Colors.border }} />)}
                ListHeaderComponent={() =>(
                <>
                  <View style= {styles.header}>
                    { showBackButton ? (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name='chevron-back' size={24} style={{ color: 'black' }} />
                            <Text>Back</Text>
                        </TouchableOpacity>
                    ) : (
                        <MaterialCommunityIcons name='web' size={24} />
                    )}     
                    <View style={styles.headerIcons}>
                        <Ionicons  name='logo-instagram' size={24} style={{ color: 'black' }} />
                        <TouchableOpacity onPress={() => signOut()}>
                            <Ionicons name='log-out-outline' size={24} style={{ color: 'black' }} />
                        </TouchableOpacity>
                    </View>      
                  </View>
                  {userId ? <UserProfile userId={userId} /> : <UserProfile userId={userProfile?._id} />}
                </>
                )}
            />
        </View>
    )
}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})