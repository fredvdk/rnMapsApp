import MenuBar from "@/components/menuBar";
import { AppDispatch, RootState } from "@/store";
import { toggleStatesOverlay } from "@/store/slices/settingsSlice";
import React from "react";
import { View, Text, Switch } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const settings = () => {
  const showStatesOverlay = useSelector((state: RootState) => state.settings.showStatesOverlay);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <MenuBar>
      <View style={{ flexDirection: 'column', alignItems: 'center' }} >
        <Text style={{ alignSelf: 'center', marginLeft: 10, fontSize: 16, padding: 5 }}>Overlay States</Text>
        <Switch
          value={showStatesOverlay}
          onValueChange={(value: boolean) => { dispatch(toggleStatesOverlay()); }}
        />
      </View>
      </MenuBar>
  );
}   
export default settings;