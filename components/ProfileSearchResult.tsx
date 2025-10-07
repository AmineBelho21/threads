import { Colors } from "@/constants/Colors";
import { Doc } from "@/convex/_generated/dataModel";

import { StyleSheet, Text, View } from "react-native";

type ProfileSearchResultProps = {
    user: Doc<'users'>;
}

const ProfileSearchResult = ({ user }: ProfileSearchResultProps) => {
    return (
        <View>
            <Text>{user.username}</Text>
        </View>
    )
}

export default ProfileSearchResult;
const styles = StyleSheet.create({
    container: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    infoContainer: {
      flex: 1,
      gap: 6,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    username: {
      fontSize: 14,
      color: 'gray',
    },
    followers: {
      fontSize: 14,
    },
    followButton: {
      padding: 8,
      paddingHorizontal: 24,
      borderRadius: 10,
      borderColor: Colors.border,
      borderWidth: 1,
    },
    followButtonText: {
      fontWeight: 'bold',
    },
  });