import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type UserProfileProps = {
  userId?: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {userId: userId as Id<"users">,});

  const { userProfile } = useUserProfile();
  const isSelf = userProfile?._id === userId;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
        <Image
          source={{ uri: profile?.imageUrl as string }}
          style={styles.image}
        />
      </View>
      <Text style={styles.bio}>{profile?.bio ? profile?.bio : 'No bio yet'}</Text>
      <Text>
        {profile?.followersCount} followers · {profile?.websiteUrl}
      </Text>

      <View style={styles.buttonRow}>
        {isSelf && (
            <>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
            </>
        )}
        {!isSelf && (
            <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
            </>
        )}
      </View>
    </View>
  );
};
export default UserProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileTextContainer: {
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  bio: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonText: {   
        fontWeight: 'bold'
    },
fullButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
