/* eslint-disable @typescript-eslint/no-unused-vars */
import Thread from "@/components/Thread";
import ThreadComposer from "@/components/ThreadComposer";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from '@/convex/_generated/dataModel';
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { FlatList, Image, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    }
  );

  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const onLoadMore = () => {
    loadMore(5);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <FlatList
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <Thread thread={item as Doc<'messages'> & { creator: Doc<'users'>}} />}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{ paddingVertical: top }}
      ListHeaderComponent={
        <View style={{ paddingBottom: 40 }}>
            <Image
                source={require('@/assets/images/threads-logo-black.png')}
                style={{ width: 40, height: 40, alignSelf: 'center'  }}
            
            />
          <ThreadComposer isPreview />
        </View>
      }
    />
  );
};

export default Page;
const styles = StyleSheet.create({});
