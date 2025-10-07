import ProfileSearchResult from "@/components/ProfileSearchResult";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


const Page = () => {

    const [search, setSearch] = useState('');
    const userList = useQuery(api.users.searchUsers, { search });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ 
                headerSearchBarOptions: {
                    placeholder: 'Search',
                    onChangeText: (event) => {
                        setSearch(event.nativeEvent.text);
                    },
                    tintColor: 'black',
                    autoFocus: true,
                    hideWhenScrolling: false,
                },

                }} />
                      <FlatList
        data={userList}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Colors.border }} />
        )}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No users found</Text>}
        renderItem={({ item }) => <ProfileSearchResult key={item._id} user={item} />}
      />
        </View>)
}

export default Page;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    user: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
  });