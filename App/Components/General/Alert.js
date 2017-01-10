'use strict';
import React, {
  AlertIOS
} from 'react-native';
const Alert = {
  errorAlert(message){
    AlertIOS.alert(
      '馋猫订餐提醒您',
      message.toString(),
      [
        {text: 'OK', onPress: () => {}},
      ]
    )
  }
}

module.exports = Alert;
