import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Button, Text } from "react-native-paper";
import Animated, { 
    FadeInDown, 
    FadeInUp,
    SlideInRight,
} from 'react-native-reanimated';
import { colors } from '../../../theme';



const Splash = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Animated.View 
                entering={FadeInDown.duration(1000).springify()}
                style={styles.header}
            >
                <Text variant="displayMedium" style={styles.title}>
                    Finance<Text style={styles.titleAccent}>Pro</Text>
                </Text>
                <Text variant="titleMedium" style={styles.subtitle}>
                    Seu dinheiro sob controle
                </Text>
            </Animated.View>

            <Animated.View 
                entering={SlideInRight.duration(1000).delay(500)}
                style={styles.imageContainer}
            >
            </Animated.View>

            <Animated.View 
                entering={FadeInUp.duration(1000).delay(1000)}
                style={styles.content}
            >
                <Text variant="bodyLarge" style={styles.description}>
                    Gerencie suas finanças de forma inteligente e eficiente. 
                    Acompanhe despesas, receitas e investimentos em um só lugar.
                </Text>

                <View style={styles.features}>
                    {[
                        "✓ Controle de despesas simplificado",
                        "✓ Análise detalhada de gastos",
                        "✓ Metas financeiras personalizadas",
                        "✓ Relatórios intuitivos"
                    ].map((feature, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.duration(800).delay(1500 + index * 200)}
                        >
                            <Text style={styles.featureText}>{feature}</Text>
                        </Animated.View>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('SignIn')}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Começar
                    </Button>
                </View>
            </Animated.View>
        </View>
    );
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
    },
    title: {
        fontWeight: 'bold',
        color: colors.text,
    },
    titleAccent: {
        color: colors.primary,
    },
    subtitle: {
        color: colors.textLight,
        marginTop: 8,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    description: {
        textAlign: 'center',
        color: colors.textLight,
        lineHeight: 24,
        marginBottom: 30,
    },
    features: {
        marginBottom: 30,
    },
    featureText: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 12,
        paddingLeft: 10,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    buttonContent: {
        paddingVertical: 8,
    },
}); 