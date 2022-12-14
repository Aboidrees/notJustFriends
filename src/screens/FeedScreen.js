import { FlatList, StyleSheet, Image, Text, Pressable } from "react-native";
import FeedPost from "../components/FeedPost";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Post } from "../models";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { Avatar } from "../components/Avatar";

const img = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

export const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const createPost = () => navigation.navigate("Create Post");

  useEffect(() => {
    DataStore.query(Post).then(setPosts);
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedPost post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <Pressable onPress={createPost} style={styles.header}>
          <Avatar />

          <Text style={styles.name}>What's on your mind?</Text>
          <Entypo name="images" size={24} color="limegreen" style={styles.icon} />
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    color: "gray",
  },
  icon: {
    marginLeft: "auto",
  },
});
