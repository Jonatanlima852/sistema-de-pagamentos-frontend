import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';

const Preferences = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <SafeScreen>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader>Preferências do App</List.Subheader>
          
          <List.Item
            title="Notificações"
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          
          <List.Item
            title="Modo Escuro"
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
          
          <List.Item
            title="Autenticação Biométrica"
            right={() => (
              <Switch
                value={biometric}
                onValueChange={setBiometric}
              />
            )}
          />
        </List.Section>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Preferences; 