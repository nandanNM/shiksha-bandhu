import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/providers/auth-provider";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { profile } = useAuth();
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            <Image
              source={
                profile?.avatar_url
                  ? { uri: profile.avatar_url }
                  : images.avatar
              }
              className="size-12 rounded-full"
            />

            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">
                Good Morning
              </Text>
              <Text className="text-base font-rubik-medium text-black-300">
                {profile?.full_name}
              </Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6" />
        </View>
      </View>

      <Search />
    </SafeAreaView>
  );
}
