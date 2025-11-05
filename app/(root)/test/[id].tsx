import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Test = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};

export default Test;
