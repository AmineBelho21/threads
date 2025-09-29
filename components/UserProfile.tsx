import { StyleSheet, Text, View } from 'react-native';

type UserProfileProps = {
    userId?: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
    return (
        <View>
            <Text>User Profile</Text>
        </View>
    )
}
export default UserProfile;
const styles = StyleSheet.create({})
