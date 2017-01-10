/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from './App/Components/Login/Login';
import Router from './App/Components/Router'
import codePush from "react-native-code-push";
// var VectorWidget = require('./VectorWidget');

  // <Login /> <VectorWidget /> <Router/>
class cm_driver extends Component {
  componentDidMount() {
      codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME});
  }
  render() {
    return (
      <View style={styles.container}>
         <Router/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('cm_driver', () => cm_driver);
