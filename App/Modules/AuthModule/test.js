// 'use strict';
const AuthConstants = require( './AuthConstants');
const AuthApi = require('./AuthApi');

const userInfo = Object.assign({},{
  token:'testtoken',
  os:'123',
  uuid:'123',
  version:'123'
})
AuthApi.AppAuth(userInfo)
setTimeout(()=>{
},3000)
