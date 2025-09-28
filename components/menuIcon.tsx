import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { View, Text } from "react-native";

type MenuIconProps = {
  name: any;
  size: number;
  text: string;
  onPress: () => void;
};

const MenuIcon = ({ name, onPress, size, text }: MenuIconProps) => {
  return (
    <View style={{ alignItems: "center", marginHorizontal: 0, padding: 5 }}>
      <MaterialIcons name={name} size={size} color="black" onPress={onPress} />
      <Text>{text}</Text>
    </View>
  );
}

export default MenuIcon;