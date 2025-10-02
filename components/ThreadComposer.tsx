import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer = ({
  isPreview,
  isReply,
  threadId,
}: ThreadComposerProps) => {
  const router = useRouter();
  const [threadContent, setThreadContent] = useState("");
  const { userProfile } = useUserProfile();
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const addThread = useMutation(api.messages.addThreadMessage);

  const handleSubmit = async () => {
    addThread({
      threadId,
      content: threadContent,
    });
    setThreadContent("");
    setMediaFiles([]);
    router.back();
  };

  const removeThread = () => {
    setThreadContent("");
    setMediaFiles([]);
  };

  const handleCancel = async () => {
    setThreadContent("");
    Alert.alert("Discard Thread ?", "", [
      {
        text: "Discard",
        style: "destructive",
        onPress: () => router.back(),
      },
      {
        text: "Save Draft",
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const selectImage = async () => {
    console.log("select image");
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/(auth)/(modal)/create");
      }}
      style={
        isPreview && {
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 100,
          pointerEvents: "box-only",
        }
      }
    >
      <View>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={handleCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.topRow}>
          {userProfile && (
            <Image
              source={{ uri: userProfile?.imageUrl as string }}
              style={styles.avatar}
            />
          )}

          <View style={styles.centerContainer}>
            <Text style={styles.name}>
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isReply ? "Reply to thread" : "What's new?"}
              value={threadContent}
              onChangeText={setThreadContent}
              multiline
              autoFocus={!isPreview}
            />
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => selectImage()}
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => selectImage()}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="gif" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic-outline" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="stats-chart-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
            onPress={removeThread}
          >
            <Ionicons name="send" size={24} color={Colors.border} />
          </TouchableOpacity>
        </View>

        <View style={[styles.keyboardAccessory]}>
          <Text style={styles.keyboardAccessoryText}>
            {isReply
              ? "Everyone can reply and quote"
              : "Profiles that you follow can reply and quote"}
          </Text>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ThreadComposer;
const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  keyboardAccessory: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
