import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { colors } from '../../../theme';

const Settings = ({ navigation }) => {
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
      title: 'Minhas Metas',
      icon: 'flag',
      route: 'Goals',
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
      route: 'Logout',
      color: colors.error,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {settingsItems.map((item, index) => (
          <React.Fragment key={item.route}>
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
                <List.Icon {...props} icon="chevron-right" />
              )}
              onPress={() => navigation.navigate(item.route)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default Settings; 