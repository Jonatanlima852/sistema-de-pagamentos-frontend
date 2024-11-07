import React from "react";
import {
    View,
    StyleSheet,
    Text,
} from "react-native";


const SignIn = () => {

    console.error('opa')

    return (
        <View>
            <Text>Oiiiiiiiiiiiiiiiiiiiiiii</Text>
            <Text>Oiiiiiiiiiiiiiiiiiiiiiii</Text>
            <Text>Oiiiiiiiiiiiiiiiiiiiiiii</Text>
            <Text>Oiiiiiiiiiiiiiiiiiiiiiii</Text>
            <Text>Oiiiiiiiiiiiiiiiiiiiiiii</Text>
        </View>
    );
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    logo: {
        width: 150,
        height: 150,
    },
    formContainer: {
        width: "100%",
    },
    inputArea: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#fff",
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: "#333",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Sombras para Android
    },
    submitButton: {
        backgroundColor: "#3b3dbf",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    submitText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#3b3dbf",
        fontSize: 16,
        textDecorationLine: "underline",
    },
});

