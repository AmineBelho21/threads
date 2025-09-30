import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Page = () => {
    const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams <{
        biostring?: string;
        linkstring?: string;
        userId?: string;
        imageUrl?: string;
    }>();

    const [bio, setBio] = useState(biostring);
    const [link, setLink] = useState(linkstring);
    const updateUser = useMutation(api.users.updateUser);

    const router = useRouter();

    const onDone = async () => {
        await updateUser({
            _id: userId as Id<'users'>,
            bio,
            websiteUrl: link,
        });
        router.dismiss();
    };

    return (
        <View>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={onDone}>
                            <Text>Done</Text>
                        </TouchableOpacity>
                    )
                }}
            />
            <Image source={{ uri: imageUrl}} style={styles.image} />
            <View style={styles.section}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                    value={bio}
                    onChangeText={setBio}
                    style={styles.bioInput}
                    multiline
                    numberOfLines={4}
                    textAlignVertical='top'
                    placeholder='Write something about yourself...'
                />
            </View>
                        <View style={styles.section}>
                <Text style={styles.label}>Link</Text>
                <TextInput
                    value={link}
                    onChangeText={setLink}
                    placeholder='https://example.com'
                    autoCapitalize='none'
                />
            </View>
        </View>
    )
}

export default Page;
const styles = StyleSheet.create({
    section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    padding: 8,
    margin: 16,
  },
  bioInput: {
    height: 100,
  },
    label: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },    
    image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
})
