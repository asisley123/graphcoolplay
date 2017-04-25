import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'exponent';
import { TabNavigator } from 'react-navigation';

class RecentChatsScreen extends React.Component {
  render() {
    return <Text>List of recent chats</Text>;
  }
}

class AllContactsScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>List of all contacts</Text>
      </View>
    );
  }
}

const MainScreenNavigator = TabNavigator(
  {
    Recent: { screen: RecentChatsScreen },
    All: { screen: AllContactsScreen },
    All2: { screen: AllContactsScreen }
  },
  { swipeEnabled: true }
);

export default class ListViewFooter extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MainScreenNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1'
  }
});
