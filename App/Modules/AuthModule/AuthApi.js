'use strict';

// const AuthConstants = require( './AuthConstants');

import AuthConstants from './AuthConstants';
const ERROR_NETWORK = AuthConstants.ERROR_NETWORK;
const postOptiopns = AuthConstants.postOptiopns;
// let getOptiopns = {}
let getOptiopns = AuthConstants.getOptiopns

const AuthApi = {
    AppLogin(userInfo){
        const url = AuthConstants.API_LOGIN
        let options = {
            method: 'POST',
            mode:'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        options.headers = Object.assign(options.headers,{
            Cmos:userInfo.os,
            Cmuuid:userInfo.uuid,
            Cmversion:userInfo.version
        })
        options.body = JSON.stringify({
          username: userInfo.username,
          password: userInfo.password
        })
        console.log(options)
        return fetch(url,options)
                .then((res) => res.json())
                .catch((error) => {throw error})
    },
    AppAuth(userInfo){
      const url = AuthConstants.API_LOGIN
      let options = {
        method: 'GET',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      }
      if(userInfo.token){

          options.headers = Object.assign(options.headers,{
              authortoken:userInfo.token
          })

      }else if (userInfo.rescode){
          options.headers = Object.assign(options.headers,{
              rescode:userInfo.rescode,
              devicetoken:userInfo.deviceToken
          })
      }
      options.headers = Object.assign(options.headers,{
        Cmos:userInfo.os,
        Cmuuid:userInfo.uuid,
        Cmversion:userInfo.version
      })
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error})
    }
}

module.exports = AuthApi;
