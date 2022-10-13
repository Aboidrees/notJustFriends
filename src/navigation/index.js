import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatePostScreen, FeedScreen, ProfileScreen, UpdateProfileScreen } from "../screens";
import { FontAwesome } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <FontAwesome
                style={{ padding: 10, borderRadius: 30 }}
                onPress={() => navigation.navigate("Profile")}
                name="user"
                size={28}
                color="gray"
              />
            ),
          })}
        />
        <Stack.Screen name="Create Post" component={CreatePostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Update Profile" component={UpdateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
