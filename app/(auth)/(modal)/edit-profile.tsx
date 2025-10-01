import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as Sentry from "@sentry/react-native";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const Page = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring?: string;
    linkstring?: string;
    userId?: string;
    imageUrl?: string;
  }>();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    imageUrl || null
  );
  const [pendingImageStorageId, setPendingImageStorageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const router = useRouter();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleImageUpload = async (image: ImagePicker.ImagePickerAsset) => {
    try {
      setIsUploading(true);

      // Step 1: Get a short-lived upload URL
      console.log("Step 1: Getting upload URL...");
      const postUrl = await generateUploadUrl();
      console.log("Upload URL received:", postUrl);

      // Step 2: Fetch the image and convert to blob
      console.log("Step 2: Fetching image from:", image.uri);
      const response = await fetch(image.uri);
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size, "type:", blob.type);

      // Step 3: POST the file to the URL
      console.log("Step 3: Uploading to Convex...");
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.mimeType || "image/jpeg" },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);
      const { storageId } = uploadResult;
      console.log("Storage ID:", storageId);

      // Store the storage ID and update local preview
      setPendingImageStorageId(storageId);
      setSelectedImage(image.uri);

      Sentry.captureEvent({
        message: "Profile picture uploaded (pending save)",
        extra: {
          storageId,
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Sentry.captureException(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDone = async () => {
    try {
      // Prepare update object
      const updates: any = {
        _id: userId as Id<"users">,
        bio,
        websiteUrl: link,
      };

      // If there's a pending image, include it in the update
      if (pendingImageStorageId) {
        updates.imageUrl = pendingImageStorageId;
      }

      await updateUser(updates);

      Sentry.captureEvent({
        message: "User Profile updated",
        extra: {
          bio,
          link,
          hasNewImage: !!pendingImageStorageId,
        },
      });
      
      router.dismiss();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text style={{ fontWeight: "600" }}>
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TouchableOpacity
        onPress={pickImage}
        disabled={isUploading}
        style={{ alignSelf: "center", marginTop: 20, marginBottom: 20 }}
      >
        {isUploading ? (
          <View style={[styles.image, styles.loadingContainer]}>
            <ActivityIndicator size="large" />
          </View>
        ) : selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder="Your website or social media"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>
    </View>
  );
};

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
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  placeholderImage: {
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  loadingContainer: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});