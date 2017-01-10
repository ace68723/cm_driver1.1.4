'use strict';
import React, {
  AlertIOS
} from 'react-native';
const Alert = {
  errorAlert(message){
    AlertIOS.alert(
      'Chanmao Driver',
      message,
      [
        {text: 'OK', onPress: () =>{}},
      ]
    )
  }
}

module.exports = Alert;
