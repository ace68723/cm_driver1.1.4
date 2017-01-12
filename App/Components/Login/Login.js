'use strict';
import React, { Component } from 'react';
import {
  AlertIOS,
  Animated,
  AppState,
  DeviceEventEmitter,
  Dimensions,
  Easing,
  Keyboard,
  TouchableOpacity,
  NativeEventEmitter,
  View,
  Modal,
  Text,
  TextInput,
} from 'react-native'
// var ReactART = require('ReactNativeART');

import FirstButton from './FirstButton';
import Loading from '../General/Loading';

import Auth from '../../Modules/AuthModule/Auth';

import moment from 'moment';

// device(size): get device height and width
const {height, width} = Dimensions.get('window');
const deviceHeight = height;
const deviceWidth = width;

// const(refs): define view refeneces
const USERNAME_INPUTREF = 'Username_Input';
const PASSWORD_INPUTREF = 'Password_Input';
const SUBMIT_BUTTON = 'Submit_Button';


import { MDWampBridge,NativeEvent,RNLocation as Location,} from 'NativeModules';


class Login extends Component {
    constructor() {
      super()
      this.state = {
        viewBottom:new Animated.Value(0),
        logoOpacity:new Animated.Value(1),
        modalVisible:true,
        onFocusAnim: new Animated.Value(0),
        lineLeft:0,
        lineTop:0,
        lineWidth: new Animated.Value(0),
        viewOpacity: new Animated.Value(1),
      };
      this.onFocus = this.onFocus.bind(this);
      this._setModalVisible = this._setModalVisible.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this._hideKeyboard = this._hideKeyboard.bind(this);
      this._keyboardWillShow = this._keyboardWillShow.bind(this);
      this._keyboardWillHide = this._keyboardWillHide.bind(this);

      this._doLogin = this._doLogin.bind(this);

      this._doAuth = this._doAuth.bind(this);
    }
    componentWillMount(){
      //System(Gesture):  handle view Gesture Response
       this._gestureHandlers = {
         onStartShouldSetResponder: ()=>{
           this._hideKeyboard();
           console.log('onStartShouldSetResponder')
         },
         onMoveShouldSetResponder: ()=>{console.log('onMoveShouldSetResponder')},
         onResponderGrant: ()=>{console.log('onResponderGrant')},
         onResponderMove: ()=>{console.log('onResponderMove')},
         onResponderRelease: ()=>{console.log('onResponderRelease')}
       }

       //Event(Keybaord): hanlde keybord event, add keyabord event listener
        this._keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
        this._keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));


        const testData = {
              result: [1, 2],
              entities: {
                articles: {
                  1: {
                    id: 1,
                    title: 'Some Article',
                    author: 1
                  },
                  2: {
                    id: 2,
                    title: 'Other Article',
                    author: 1
                  }
                },
                users: {
                  1: {
                    id: 1,
                    name: 'Dan'
                  }
                }
              }
            }
            console.log(testData.entities.users[1])
     }
     componentDidMount(){
      this._doAuth();
    }
    componentWillUnmount() {
      // Event(Keybaord): remove keybaord event
      this._keyboardWillShowSubscription.remove();
      this._keyboardWillHideSubscription.remove();
    }

    _keyboardWillShow(e) {
        // keyboard(e.endCoordinates.height): get keyboard height
        const keyboardHeight = e.endCoordinates.height;
        // submitButton(position): get submitButton position
        this.refs[SUBMIT_BUTTON].measure((ox, oy, width, height, px, py) =>{
            // submitButton(marginBottom)
            const submitButton = deviceHeight - py - height;
            // if true, submitButton has covered by keyboard
            console.log(keyboardHeight,submitButton)
            if(keyboardHeight>submitButton ){
              //View(bottom): add enough space for keyboard appear

              Animated.timing(this.state.viewBottom, {
                  toValue: keyboardHeight-submitButton + 60,
                  easing: Easing.out(Easing.quad),
                  duration: 300,
              }).start()
              // View(logo): logo fadeout;
              Animated.timing(this.state.logoOpacity, {
                  toValue: 0,
                  easing: Easing.out(Easing.quad),
                  duration: 300,
              }).start()

            }
         });
         this.onFocus()


    }
    _keyboardWillHide(e) {
      //View(bottom): init viewBottom to default
      Animated.timing(this.state.viewBottom, {
          toValue: 0,
          easing: Easing.out(Easing.quad),
          duration: 300,
        }).start()
        Animated.timing(this.state.logoOpacity, {
            toValue: 1,
            easing: Easing.out(Easing.quad),
            duration: 300,
        }).start()
        // view(inputLine)
        Animated.sequence([
            Animated.delay(100),
            Animated.timing(this.state.lineWidth, {
                toValue: 0,
                duration: 300,
              })
        ]).start()
    }
    onFocus(){
        this.refs[USERNAME_INPUTREF].measure((ox, oy, width, height, px, py) =>{
          this.renderAnimationLine(ox,oy,width,height)
        });
    }
    renderAnimationLine(lineLeft,lineTop,lineWidth,objectHeight){
      // console.log(lineWidth,lineTop)
      this.setState({
        lineLeft:lineLeft,
        lineTop:lineTop+objectHeight,
        // lineWidth:lineWidth,
      })


        Animated.sequence([
            Animated.delay(100),
            Animated.timing(this.state.lineWidth, {
                toValue: lineWidth,
                duration: 300,
              })
        ]).start()

    }
    _setModalVisible(visible){
      console.log(visible)
      this.setState({modalVisible: visible});
    }
    _handleSubmit(){
      this._hideKeyboard()
      this._doLogin()
    }
    async _doLogin(){
      if(this.state.username && this.state.password){
        const loginData = {
          username:this.state.username,
          password:this.state.password
        }
        try {
          const loginResult = await Auth.AppLogin(loginData);
          this._doAuth();
        } catch (e) {
          console.log(e);
        } finally {

        }

      }

    }
    async _doAuth(){
      try {
        const authResult = await Auth.doAuth();
        if(authResult){
          console.log('auth SUCCESSFUL')

          // this.token = authResult.token;
          // MDWampBridge.startMDWamp(this.token);

          // setTimeout(function () {
          //   MDWampBridge.call("task_refresh",[authResult.token]);
          // }, 3000);
          Animated.timing(this.state.viewOpacity,{
              delay: 500,
              toValue: 0,
              duration: 1000, //550ms
          }).start()
          const hideLogin = this.props.hideLogin
          setTimeout(function () {
            hideLogin()
          }, 1500);

        }else{
          // AlertIOS.alert(
          //    '登陆失败',
          //    ''
          //   );
          // AlertIOS.alert(
          //    '登陆失败',
          //    '123'
          //   );
        }
      } catch (e) {
        console.log(e)
      }
    }
    _hideKeyboard(){
      // keyboar(hide): hide keyboard by blur input
      this.refs[USERNAME_INPUTREF].blur()
      this.refs[PASSWORD_INPUTREF].blur()
    }

    render(){
      return(
        <Animated.View style={{opacity:this.state.viewOpacity,position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:'#ffffff'}}>
            <Animated.View style={{flex:1,padding:50,bottom:this.state.viewBottom}} {...this._gestureHandlers}>

                <Animated.View style={{opacity:this.state.logoOpacity}}>
                    <Text style={{color:'#ff8b00',marginTop:30,fontSize:28,fontWeight:'500',alignSelf:'flex-start'}}>
                      ChanMao Driver
                    </Text>
                </Animated.View>

                <Text style={{color:'#485465',marginTop:40,fontSize:25,fontWeight:'500',alignSelf:'flex-start'}}>
                  Welcome back,
                </Text>
                <Text style={{color:'#a4afc0',marginTop:15,fontSize:23,fontWeight:'300',alignSelf:'flex-start'}}>
                  sign in to continues to chanmao driver
                </Text>
                <TextInput
                      style={[styles.fistInput,{marginTop:40}]}
                      placeholder="Username"
                      keyboardType = { 'url'}
                      autoCorrect= { false}
                      returnKeyType={'next'}
                      ref={USERNAME_INPUTREF}
                      onChangeText={(username) => {
                        this.setState({username});
                      }}
                  />
                <TextInput
                        style={styles.fistInput}
                        placeholder="Password"
                        keyboardType = { 'email-address'}
                        autoCorrect= { false}
                        returnKeyType={'next'}
                        secureTextEntry={true}
                        ref={PASSWORD_INPUTREF}
                        onChangeText={(password) => {
                          this.setState({password});
                        }}
                    />
                <View ref={SUBMIT_BUTTON}style={{marginTop:15}}>
                  <FirstButton   handleSubmit = {this._handleSubmit}/>
                </View>
                <View style={{position:'absolute',bottom:5,width:width,alignItems:'center'}}>
                  <Text allowFontScaling={false} style={{marginBottom:5}}>
                    v1.1.4
                  </Text>
                  <Text allowFontScaling={false} style={{fontSize:11}}>
                    Chanmao Inc. All Copyrights Reserved
                  </Text>
                </View>

                <Animated.View style={{position:'absolute',
                                       left:this.state.lineLeft,
                                       top:this.state.lineTop,
                                       width:this.state.lineWidth,
                                       height:2,
                                       backgroundColor:'#ff8b00',}}>
                </Animated.View>
          </Animated.View>

        </Animated.View>


      )
    }
}

// <Loading loadingVisible={this.state.loadingVisible}
//          loadingResult={this.state.loadingResult}/>
const styles = {
  fistInput:{
    fontSize: 18,
    borderRadius: 8,
    color: '#000',
    height:40,
    marginTop:5,
  },
}

module.exports = Login;
