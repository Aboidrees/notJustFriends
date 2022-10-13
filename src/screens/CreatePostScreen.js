import { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Post, User, Storage } from "../models";
import { View, Text, StyleSheet, TextInput, Image, Button, ScrollView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { S3Image } from "aws-amplify-react-native";
import { Auth } from "aws-amplify";
import { uploadFile, dummy_img, pickImage } from "../util";

const user = {
  id: "u1",
  image: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
  name: "Muhammad Yousif",
};

export const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, userData.attributes.sub);
      if (dbUser) {
        setUser(dbUser);
      } else {
        navigation.navigate("Update Profile");
      }
    };
    fetchUser();
  }, []);

  const onPost = async () => {
    const newPost = {
      description,
      postUserId: user?.id,
      numberOfLikes: 0,
      numberOfShares: 0,
      _version: 1,
    };

    if (image) newPost.image = await uploadFile(image);

    console.log(newPost);
    // await DataStore.save(new Post(newPost));
    // setDescription("");
    // setImage("");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          {user?.image ? (
            <S3Image imgKey={user?.image} style={styles.profileImage} />
          ) : (
            <Image source={{ uri: dummy_img }} style={styles.profileImage} />
          )}

          <Text style={styles.name}>{user?.name}</Text>
          <Entypo onPress={() => pickImage(setImage)} name="images" size={24} color="limegreen" style={styles.icon} />
        </View>

        <TextInput
          placeholder="What's on your mind?"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.buttonContainer}>
          <Button onPress={onPost} title="Post" disabled={!description} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
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
  input: {},
  buttonContainer: {
    marginTop: "auto",
  },
  icon: {
    marginLeft: "auto",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
});
