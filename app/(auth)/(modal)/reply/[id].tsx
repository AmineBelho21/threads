import Thread from '@/components/Thread';
import ThreadComposer from '@/components/ThreadComposer';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string}>();
    const thread = useQuery(api.messages.getThreadById, { messageId: id as Id<'messages'>})
    return (
    <View>
      {thread ? (
        <Thread thread={thread as Doc<'messages'> & { creator: Doc<'users'> }} />
      ) : (
        <ActivityIndicator />
      )}

      <ThreadComposer isReply={true} threadId={id as Id<'messages'>} />
    </View>
  );
};
export default Page;