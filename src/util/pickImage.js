import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

export const pickImage = async (setImage) => {
  let result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.cancelled) setImage(result.uri);
};
