'use strict';

const AuthConstants = require( './AuthConstants');
//import React Native module
import React, {
  AsyncStorage
} from 'react-native';

const ERROR_STORE = AuthConstants.ERROR_STORE;
const SUCCESS_STORE = AuthConstants.SUCCESS_STORE;

const AuthStore = {
   getData(ia_keys){
     return new Promise((resolve, reject) => {
         AsyncStorage.multiGet(ia_keys,(err,val) => {
           if(err){
             reject (ERROR_STORE);
           }
           if(!val){
             reject (ERROR_STORE);
           }
             let eo_data = {};
             val.forEach((value)=>{
                  eo_data[value[0]] = value[1];
             })
             resolve (eo_data);
         })
       })
   },
   saveData(ia_data){
     return new Promise((resolve, reject) => {
         AsyncStorage.multiSet(ia_data,(err) => {
             if(err){
               reject (ERROR_STORE);
             }

             resolve (SUCCESS_STORE);
         })
      })
   },
   removeData(ia_keys){
     return new Promise((resolve, reject) => {
         AsyncStorage.multiRemove(ia_keys,(err) => {
             if(err){
               reject (ERROR_STORE);
             }

             resolve (SUCCESS_STORE);
         })
      })
   }

}
module.exports = AuthStore;
