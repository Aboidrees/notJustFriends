import { DataStore } from "aws-amplify";
import { useState, useEffect } from "react";
import { S3Image } from "aws-amplify-react-native";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, Pressable, Button } from "react-native";
import { uploadFile, dummy_img, pickImage } from "../util";
import { User } from "../models";

const createUser = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      createdAt
      updatedAt
      name
      image
      _version
      _lastChangedAt
      _deleted
    }
  }
`;

const UpdateProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, userData.attributes.sub);
      setUser(dbUser);
      setName(dbUser?.name || "");
    };

    fetchUser();
  }, []);

  const onCreate = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const newUser = { id: userData.attributes.sub, name, _version: 1 };
    if (image) newUser.image = await uploadFile(image);
    await API.graphql(graphqlOperation(createUser, { input: newUser }));
  };

  const onUpdate = async () => {
    let imageKey;
    if (image) imageKey = await uploadFile(image);

    await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.name = name;
        if (imageKey) {
          updated.image = imageKey;
        }
      })
    );
  };

  const onSave = async () => {
    if (user) {
      await onUpdate();
    } else {
      await onCreate();
    }
    navigation.navigate("Feed");
  };

  let renderImage = <Image source={{ uri: dummy_img }} style={styles.image} />;
  if (image) {
    renderImage = <Image source={{ uri: image }} style={styles.image} />;
  } else if (user?.image) {
    renderImage = <S3Image imgKey={user.image} style={styles.image} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginBottom: insets.bottom }]}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <Pressable onPress={() => pickImage(setImage)} style={styles.imagePickerContainer}>
        {renderImage}
        <Text>Change photo</Text>
      </Pressable>

      <TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />

      <View style={styles.buttonContainer}>
        <Button onPress={onSave} title="Save" disabled={!name} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    padding: 10,
  },
  imagePickerContainer: {
    alignItems: "center",
  },
  image: {
    width: "30%",
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 500,
  },
  input: {
    borderColor: "lightgrayVa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
    marginVertical: 10,
    padding: 10,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 10,
    alignSelf: "stretch",
  },
});

export { UpdateProfileScreen };
