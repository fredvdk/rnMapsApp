import React from "react";
import { View, StyleSheet } from "react-native";

type MenuBarProps = {
  children?: React.ReactNode;
};

const MenuBar = ({children}: MenuBarProps) => {
  return (
    <View style={styles.menuBar}>   
        {children}
    </View>
  );
}

const styles = StyleSheet.create({
  menuBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',   
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default MenuBar;