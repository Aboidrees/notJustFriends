import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Navigation } from "./src/navigation";
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native/dist/Auth";
import { useEffect, useState } from "react";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  const [authUser, setAuthUser] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(setAuthUser);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Navigation />
    </View>
  );
}

export default withAuthenticator(App);
