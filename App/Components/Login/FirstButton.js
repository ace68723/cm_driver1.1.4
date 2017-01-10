'use strict';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const styles = StyleSheet.create({

    firstButtonBox:{
      flexDirection: 'row',
      marginTop:30,
      height: 50,
      // backgroundColor: '#aaaaaa'
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
    },
    button: {
      flex:1,
      backgroundColor: '#ff8b00',
      borderColor: '#ff8b00',
      borderWidth: 1,
      borderRadius: 8,
      alignItems:'center',
      justifyContent:'center',
    },
});


export default (props) => {
        return(
          <View style={styles.firstButtonBox}>
             <TouchableOpacity
                 style={styles.button}
                 onPress = { props.handleSubmit }
                 activeOpacity={0.4}>
                    <Text style={ styles.buttonText }>Login </Text>
             </TouchableOpacity>
         </View>
        )

}
