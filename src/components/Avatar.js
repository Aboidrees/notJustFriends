import { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { S3Image } from "aws-amplify-react-native";
import { Image, StyleSheet } from "react-native";
import { Auth } from "aws-amplify";
import { dummy_img } from "../util";
import { User } from "../models";

export const Avatar = () => {
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

  return !!user?.image ? (
    <S3Image imgKey={user?.image} style={styles.profileImage} />
  ) : (
    <Image source={{ uri: dummy_img }} style={styles.profileImage} />
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
