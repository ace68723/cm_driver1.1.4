'use strict';

const  AuthApi        = require( './AuthApi');
const  AuthConstants  = require( './AuthConstants');
const  AuthStore      = require( './AuthStore');
const  AppConstants   = require('../../Constants/AppConstants')
const  DeviceInfo     = require('react-native-device-info');
const  Alert          = require('../System/Alert');
const  Realm          = require('realm');


const AppUserInfoSchema = {
      name: 'AppUserInfo',
      primaryKey: 'param',
      properties: {
        param:       'string',
        value:      'string'
      }
    }

const OrderDetialSchema = {
  name: 'OrderDetial',
  primaryKey: 'oid',
  properties: {
    oid:'string',
    comment:'string',
    created:'string',
    dlexp:'string',
    oid:'string',
    rid:'string',
    status:'string',
    total:'string'
  }
};
const RestaurantInfoSchema = {
  name: 'RestaurantInfo',
  primaryKey: 'rid',
  properties: {
      rid:'string',
      addr:"string",
      lat:"string",
      lng:"string",
      name:"string",
      postal:"string",
      tel:"string",
      unit:"string"
  }
};
const UserAddressSchema = {
  name: 'UserAddress',
  primaryKey: 'uaid',
  properties: {
      uaid:'string',
      addr:"string",
      buzz:"string",
      lat:"string",
      lng:"string",
      name:"string",
      postal:"string",
      tel:"string",
      unit:"string"
  }
};
const OrdersSchema = {
  name: 'Orders',
  primaryKey: 'oid',
  properties: {
    oid:'string',
    bdate:'string',
    order:'OrderDetial',
    restaurant:'RestaurantInfo',
    address:'UserAddress'
  }
};


let realm = new Realm({schema: [AppUserInfoSchema,OrderDetialSchema,RestaurantInfoSchema,UserAddressSchema,OrdersSchema]});
// setTimeout(function () {
//
//   realm.write(() => {
//
//      realm.create('Orders', {oid: '335',
//                              bdate:'string',
//                              order: {
//                                oid:'335',
//                                comment:'52456',
//                                created:'string',
//                                dlexp:'string',
//                                rid:'string',
//                                status:'10',
//                                total:'string'
//                             },
//                             restaurant:{
//                               rid:'52',
//                               addr:"3280 Midland Avenue, Toronto",
//                               lat:"43.805878",
//                               lng:"-79.288177",
//                               name:"测试商家(请勿下单)",
//                               postal:"M8Y 0B6",
//                               tel:"6476256266",
//                               unit:"111"
//                             },
//                             user:{
//                               uid:'32',
//                               addr:"1571 Sandhurst Cir, Scarborough, ON M1V 1V2加拿大",
//                               buzz:"",
//                               lat:"43.808895",
//                               lng:"-79.269852",
//                               name:"Aiden",
//                               postal:"M1V 1V2",
//                               tel:"5555555555",
//                               unit:""
//                             }
//                           }, true );
//   });
//
// }, 1000);




console.log(realm.path)

// version
const VERSION         = AppConstants.CMVERSION;
//constants
const ERROR_STORE     = AuthConstants.ERROR_STORE;
const ERROR_NETWORK   = AuthConstants.ERROR_NETWORK;
const ERROR_PASSWORD  = AuthConstants.ERROR_PASSWORD;
const ERROR_AUTH      = AuthConstants.ERROR_AUTH;
const SUCCESS         = AuthConstants.SUCCESS;
const FAIL            = AuthConstants.FAIL;
const SUCCESS_LOGIN   = AuthConstants.SUCCESS_LOGIN;
const TOKEN           = AuthConstants.TOKEN;
const UID             = AuthConstants.UID;
const STARTED         = AuthConstants.STARTED;
// message
const ERROR_NETWORK_MESSAGE   = AuthConstants.ERROR_NETWORK_MESSAGE;
const ERROR_PASSWORD_MESSAGE  = AuthConstants.ERROR_PASSWORD_MESSAGE;
const ERROR_AUTH_MESSAGE      = AuthConstants.ERROR_AUTH_MESSAGE;
const ERROR_STORE_MESSAGE     = AuthConstants.ERROR_STORE_MESSAGE;

let _token = "";
let loginStarted = false;
let authStarted = false;
const AuthModule = {

    async doAuth(){
      const token = AuthModule.getToken()
      if(token){
        try {
          const userInfo = formatAuth(token)
          const authResult = await AuthApi.AppAuth(userInfo)
          if(authResult.result == 0 ){
            return authResult
          }else{
            // Alert.errorAlert(authResult.message)
            console.log(authResult)
          }
        } catch (e) {
          console.log(e)
          // return e
        }

      }

    },

    async AppLogin(io_data){
        const username = io_data.username;
        const password = io_data.password;
        const deviceToken = io_data.deviceToken;
        const data = {username,password}
        const userInfo = formatLogin(data)
        try {
          const loginResult = await AuthApi.AppLogin(userInfo)
          console.log(loginResult)
            if(loginResult.result == 0){
              realm.write(() => {
                realm.create('AppUserInfo', {param: 'token', value:loginResult.token}, true);
                realm.create('AppUserInfo', {param: 'driver_id', value:loginResult.driver_id}, true);
                realm.create('AppUserInfo', {param: 'uid', value:loginResult.uid}, true);
                realm.create('AppUserInfo', {param: 'name', value:'1236'}, true);
                realm.create('AppUserInfo', {param: 'bdate', value:''}, true);
              });
              return loginResult
            }else{
              Alert.errorAlert(loginResult.message)
            }
          } catch (e) {
          console.log(e)
          // return e
        }
    },
    getToken() {
      let tokenObject = realm.objectForPrimaryKey('AppUserInfo','token');
      if(tokenObject){
          let token = tokenObject.value
          return token
      }

    },
    getDriverID() {
      let driverIDObject = realm.objectForPrimaryKey('AppUserInfo','driver_id');
      if(driverIDObject){
          let driverID = driverIDObject.value
          return driverID
      }
    },
    async logout(){
        const result = await AuthStore.removeData([TOKEN, UID]);
        _token = '';
        return result
    }
}

const loginResult = (res) => {
        if(res.result == FAIL){
            throw res
         }else{
            let la_data = [
              [TOKEN, res.token],
              [UID, res.uid]
            ]
            return la_data
         }
}
const getSuccess = () => {
    const success = Object.assign({},{
      result: SUCCESS,
      message: SUCCESS_LOGIN
    });
    return success
}
const getError = (error) => {
  switch (error) {
    case ERROR_NETWORK:
      error = Object.assign({},{
        result: FAIL,
        message: ERROR_NETWORK_MESSAGE
      });
      return error
      break
    case ERROR_PASSWORD:
      error = Object.assign({},{
        result: FAIL,
        message: ERROR_PASSWORD_MESSAGE
      });
      return error
      break
    case ERROR_STORE:
      error = Object.assign({},{
        result: FAIL,
        message: ERROR_STORE_MESSAGE
      });
      return error
      break
    case STARTED:
      error = Object.assign({},{
        result: FAIL,
        message: STARTED
      });
      return error
      break
      case ERROR_AUTH:
        error = Object.assign({},{
          result: FAIL,
          message: ERROR_AUTH_MESSAGE
        });
        return error
        break

    default:

    }
}
const formatLogin = (io_data) => {
  const userInfo = Object.assign({},{
    os:    DeviceInfo.getModel() +" | " +
           DeviceInfo.getSystemName() +" | " +
           DeviceInfo.getSystemVersion() +" | " +
           DeviceInfo.getDeviceName(),
    deviceToken:io_data.deviceToken,
    username:io_data.username,
    password:io_data.password,
    uuid: DeviceInfo.getUniqueID(),
    version : VERSION
  });

  return userInfo
}
const formatAuth = (token) => {
  const userInfo = Object.assign({},{
    os:  DeviceInfo.getModel() +" | " +
           DeviceInfo.getSystemName() +" | " +
           DeviceInfo.getSystemVersion() +" | " +
           DeviceInfo.getDeviceName(),
    token: token,
    uuid: DeviceInfo.getUniqueID(),
    version : VERSION
  });

  return userInfo
}
const formatWecahtAuth = (resCode,deviceToken) => {
  const userInfo = Object.assign({},{
    deviceToken:deviceToken,
    os:  DeviceInfo.getModel() +" | " +
           DeviceInfo.getSystemName() +" | " +
           DeviceInfo.getSystemVersion() +" | " +
           DeviceInfo.getDeviceName(),
    rescode: resCode,
    uuid: DeviceInfo.getUniqueID(),
    version : VERSION
  });
  return userInfo
}
const authResult = (res) => {
  return new Promise((resolve, reject) => {
      if(res.result == FAIL){
        AuthStore.removeData([TOKEN, UID])
          .then(()=>{
              reject(res)
          })
          .catch((error)=>{
             reject(error)
          })
      }else{
        resolve()
      }

  })


}
const getToken = () => {
  return new Promise((resolve, reject) => {
    AuthStore.getData([TOKEN, UID])
      .then((data) => {
         resolve(data)
      })
      .catch((error) =>{
        reject (error);
      })
    })
  }

module.exports = AuthModule;
