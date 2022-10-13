import { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { Entypo, AntDesign, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import LikeImage from "../../assets/images/like.png";
import { User } from "../models";
import { S3Image } from "aws-amplify-react-native";
import { dummy_img } from "../util";

const FeedPost = ({ post }) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  // fetch user and save it in state
  useEffect(() => {
    if (!post.postUserId) return;

    DataStore.query(User, post.postUserId).then(setUser);
  }, [post.postUserId]);

  return (
    <View style={styles.post}>
      {/* Post Header with details about the author */}
      <Pressable onPress={() => navigation.navigate("Profile", { id: post.postUserId })} style={styles.header}>
        {user?.image ? (
          <S3Image imgKey={user.image} style={styles.profileImage} />
        ) : (
          <Image source={{ uri: dummy_img }} style={styles.profileImage} />
        )}

        <View>
          <Text style={styles.name}>{post?.User?.name}</Text>
          <Text style={styles.subtitle}>{post.createdAt}</Text>
        </View>
        <Entypo name="dots-three-horizontal" size={18} color="gray" style={styles.icon} />
      </Pressable>
      {/* Post body with description and image */}
      {post.description && <Text style={styles.description}>{post.description}</Text>}
      {post.image && <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />}

      {/* Post footer with likes and button */}
      <View style={styles.footer}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <Image source={LikeImage} style={styles.likeIcon} />
          <Text style={styles.likedBy}>Muhammad and {post.numberOfLikes} others</Text>
          <Text style={styles.shares}>{post.numberOfShares} shares</Text>
        </View>

        {/* Buttons row */}
        <View style={styles.buttonsRow}>
          {/* Like button */}
          <Pressable
            onPress={() => setIsLiked(!isLiked)} //<- onPress event toggles isLiked
            style={styles.iconButton}
          >
            <AntDesign name="like2" size={18} color={isLiked ? "royalblue" : "gray"} />
            <Text style={[styles.iconButtonText, { color: isLiked ? "royalblue" : "gray" }]}>Like</Text>
          </Pressable>

          {/* Comment button */}
          <View style={styles.iconButton}>
            <FontAwesome5 name="comment-alt" size={16} color="gray" />
            <Text style={styles.iconButtonText}>Comment</Text>
          </View>

          {/* Share button */}
          <View style={styles.iconButton}>
            <MaterialCommunityIcons name="share-outline" size={18} color="gray" />
            <Text style={styles.iconButtonText}>Share</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeedPost;

const styles = StyleSheet.create({
  post: {
    width: "100%",
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "500",
  },
  subtitle: {
    color: "gray",
  },
  icon: {
    marginLeft: "auto",
  },

  description: {
    lineHeight: 20,
    padding: 10,
    paddingTop: 0,
    letterSpacing: 0.3,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  footer: {
    paddingHorizontal: 10,
  },

  // Stats Row
  statsRow: {
    paddingVertical: 10,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  likeIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  likedBy: {
    color: "gray",
  },
  shares: {
    color: "gray",
    marginLeft: "auto",
  },

  // Buttons Row
  buttonsRow: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButtonText: {
    color: "gray",
    marginLeft: 5,
    fontWeight: "500",
  },
});
