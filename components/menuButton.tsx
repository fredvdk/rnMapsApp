
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native"

type MenuButtonProps = {
    caption: string;
    onPress: () => void;
};

const MenuButton = ({ caption, onPress }: MenuButtonProps) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.btntext}>{caption}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',       
        marginHorizontal: 5,
        marginVertical: 15,
        padding: 10,
        backgroundColor: '#2f95dc',
        borderRadius: 5
    },
    btntext: {
        color: 'white',
        padding: 2,
        fontSize: 14,
        fontWeight: '500',
    }
});


export default MenuButton;