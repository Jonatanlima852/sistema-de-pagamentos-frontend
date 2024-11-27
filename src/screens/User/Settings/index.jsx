import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useAuth } from '../../../hooks/useAuth';

const Settings = ({ navigation }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const settingsItems = [
    {
      title: 'Editar Perfil',
      icon: 'account-edit',
      route: 'EditProfile',
    },
    {
      title: 'Minhas Categorias',
      icon: 'tag-multiple',
      route: 'Categories',
    },
    {
      title: 'Minhas Contas',
      icon: 'bank',
      route: 'Accounts',
    },
    {
      title: 'Meus Limites',
      icon: 'chart-line',
      route: 'Limits',
    },
    {
      title: 'Configurações',
      icon: 'cog',
      route: 'Preferences',
    },
    {
      title: 'Sair da Conta',
      icon: 'logout',
      onPress: handleLogout,
      color: colors.error,
    },
  ];

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Configurações</Text>
        <List.Section>
          {settingsItems.map((item, index) => (
            <React.Fragment key={item.route || item.title}>
              <List.Item
                title={item.title}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={item.icon}
                    color={item.color || colors.text}
                  />
                )}
                right={props => (
                  item.route && <List.Icon {...props} icon="chevron-right" />
                )}
                onPress={item.onPress || (() => navigation.navigate(item.route))}
                titleStyle={[
                  styles.itemTitle,
                  item.color && { color: item.color }
                ]}
              />
              {index < settingsItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Section>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemTitle: {
    fontSize: 18,
  },
  title: {
    margin: 28,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 28
  },
});

export default Settings; 