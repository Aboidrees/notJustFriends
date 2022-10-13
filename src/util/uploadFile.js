import { Storage } from "aws-amplify";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (fileUri) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const key = `${uuidv4()}.png`;
    await Storage.put(key, blob, { contentType: "image/png" });
    return key;
  } catch (err) {
    console.log("Error uploading file:", err);
  }
};
