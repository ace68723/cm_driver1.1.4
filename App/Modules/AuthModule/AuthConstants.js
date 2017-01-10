'use strict';
const TestServer = 'http://cmtest.littlesailing.com/index.php?r=';
const proructServer = 'https://www.chanmao.ca/index.php?r=';
const Server = proructServer;
const AppConstants ={
    //chanmao login api,{username: , password: }

    API_LOGIN:Server + 'MobDriver10/Login',
    API_AUTH: Server + 'MobLogin10/loginwc',
    API_HISTORYLIST: Server + 'MobOrder10/historylist',
    API_RESTAURANTLIST: Server + 'MobOrder10/Rrlist',
    API_MENU: Server + 'MobOrder10/Rrmenu',
    API_ADDRESS: Server + 'MobAddress10/addresslist',
    API_CREATE_ADDRESS: Server + 'MobAddress10/Addresscreate',
    API_BEFOR_CHECKOUT: Server + 'MobOrder10/BeforeCO',
    API_CALCULATE_DELIVERY_FEE: Server + 'MobOrder10/CalcFee',
    API_CHECKOUT:Server + 'MobOrder10/checkout',
    API_GETVERIFYCODE: Server + 'MobOrder10/sendcode',
    API_DELET_ADDRESS: Server + 'MobAddress10/Addressupdate',
    API_VERIFYCODE: Server + 'MobOrder10/verifysms',
    GET_ATICLE_LIST: Server + 'MobContent10/PostList',
    GET_ARTICLE_AUTHOR: Server + 'MobContent10/ArticleOV',
    GET_BROADCAST_AUTHOR: Server + 'MobContent10/RadioOV',
    GET_ACTIVITY_AUTHOR: Server + 'MobContent10/ActivityOV',
    SUBMIT_APPLICATION: Server + 'MobContent10/ApplySubmit',
    SUBMIT_COMMENT: Server + 'MobContent10/CommentSubmit',
    GET_COMMENT_LIST: Server + 'MobContent10/CommentList',
    API_CHECK_UPDATE: Server + 'MobContent10/CheckUpdate',
    API_HOME: Server + 'MobAd10/AdHome',
    ERROR_PASSWORD:'ERROR_PASSWORD',
    ERROR_PASSWORD_MESSAGE:'密码不正确',
    ERROR_NETWORK:'ERROR_NETWORK',
    ERROR_NETWORK_MESSAGE:'请检查您的网络',
    ERROR_STORE:'CAN NOT SAVE DATA',
    ERROR_STORE_MESSAGE:'error code: 301 请重新登录',
    SUCCESS_STORE:'SAVE SUCCESSFUL',
    ERROR_AUTH:'验证过期',
    ERROR_AUTH_MESSAGE:'验证过期,请重新登录',
    SUCCESS_LOGIN:'登录成功',
    //wecaht
    WECHAT_SCOPE: 'snsapi_userinfo',
    WECHAT_STATE: 'wechat_sdk_test',
    WECHAT_APPID: 'wx20fd1aeb9b6fcf82',
    //auth
    SUCCESS: 0,
    FAIL: 1,
    TOKEN: 'userToken',
    UID: 'sv_uid',
    // auth
    DO_LOGIN:'DO_LOGIN',
    //alert
    ALERT_TITLE:'馋猫订餐',
    STARTED:'正在执行中',
    getOptiopns : {
        method: 'GET',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },
    postOptiopns :{
        method: 'POST',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

}
module.exports = AppConstants;
