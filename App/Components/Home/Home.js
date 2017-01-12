'use strict';
import React, { Component } from 'react';
import {
  Animated,
  ActionSheetIOS,
  Dimensions,
  DeviceEventEmitter,
  LayoutAnimation,
  Linking,
  NativeEventEmitter,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import {
    forEach,
} from 'lodash';

//Components
import Login from '../Login/Login';
import TaskList from './TaskList';
import Map from './Map';

//native Modules
import {NativeEvent, RNLocation as Location, MDWampBridge as MDWamp,FlashLightBridge as FlashLight} from 'NativeModules'
import DeviceInfo from 'react-native-device-info';
//js modules
import moment from 'moment';
import Auth from '../../Modules/AuthModule/Auth';

//database
const  Realm = require('realm');
let realm = new Realm();
const BUTTONS = [
  '现金',
  '刷卡',
  '取消',
];
const DESTRUCTIVE_INDEX = 2;
const CANCEL_INDEX = 2;
const {height,width} = Dimensions.get('window');


var notificationAlert;

class Home extends Component {
    constructor() {
      super()
      this.state={
        backgroundStyle:{
          bottom:-height*0.275
        },
        taskList:[],
        showLogin:true,
        openMap:false,
        dest_name:'',
        dest_addr:'',
        showNotification:false,
        showOfflineBtn:false,
      }
      this._animateMapView = this._animateMapView.bind(this);
      this._animateMapBackground = this._animateMapBackground.bind(this);
      this._animateOpenTaskList = this._animateOpenTaskList.bind(this);
      this._animateCloseTaskList = this._animateCloseTaskList.bind(this);
      this._goOnline = this._goOnline.bind(this);
      this._goOffline = this._goOffline.bind(this);
      this._orderChange = this._orderChange.bind(this);
      this._hideLogin = this._hideLogin.bind(this);
      this._openMap = this._openMap.bind(this);
      this._closeMap = this._closeMap.bind(this);
      this._jumpToMap = this._jumpToMap.bind(this);
      this._cancelNotification = this._cancelNotification.bind(this);
      this._showOfflineBtn = this._showOfflineBtn.bind(this);
    }
    componentWillMount() {
      Location.requestAlwaysAuthorization()
      Location.startUpdatingLocation()
      Location.setDistanceFilter(5.0)
      if(DeviceInfo.getSystemVersion()>9.0){
        Location.setAllowsBackgroundLocationUpdates(true);
      }

    }
    async componentDidMount(){

      this._nativeEventListener();
      this.addLocationListener();
    }
    addLocationListener(){
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
          this.setState({'location':location});
          if(!this.state.online){
            this.mapRef.changeMapRegion(location.coords.latitude,location.coords.longitude)
          }
          this._pushLocation()

      })
    }
    _nativeEventListener(){
      NativeEvent.AddEventListener();
      const NativeEvt = new NativeEventEmitter(NativeEvent);
      this.NativeEvtListener = NativeEvt.addListener('NativeEvent', (data) => {
         switch (data.type) {
           case 'MDWamp':
             this._MDWampEvent(data)
             break;
           default:

         }
      })
    }
    _MDWampEvent(data){
      console.log(data)
      switch (data.scenario) {


        case 'subscribed':
            this.driver_id = data.driver_id;
            //go online
            if(this.state.location){
              MDWamp.call("driver_status",[this.token,'ON',this.state.location.coords.latitude+','+this.state.location.coords.longitude]);
            }
            //get all task
            MDWamp.call("task_refresh",[this.token]);


        break;

        case 'driver_status':
          if(data.bdate){
            realm.write(() => {
              realm.create('AppUserInfo', {param: 'bdate', value:data.bdate}, true);
            })
          }
        break;

        case 'closedSession':
        if(data.reason !='MDWamp.session.explicit_closed'){
          const token = this.token;
          setTimeout(function () {
            MDWamp.startMDWamp(token);
          }, 10000);
        }
        break;

        case 'ord_in':
          console.log('ord_in')
          this._newOrderNotification('#'+data.order.oid +' New Order');
          MDWamp.call("task_refresh",[this.token]);
        break;

        case 'ord_out':
          const oid = data.order.oid
          this._newOrderNotification('#'+ oid +' Canceled');
          realm.write(() => {
            const canceledOrder = {oid: oid,
                                    order: {
                                      oid: oid,
                                      status:'500'
                                    }
                                   }
            realm.create('Orders', canceledOrder, true);
          })
        break;
        case 'order_change':
          MDWamp.call("task_refresh",[this.token]);
        break;

        case 'task_refresh':
        console.log(data.orders)
        realm.write(() => {
          forEach(data.orders,(data,key)=>{
            const order = Object.assign({},data.order);
            const restaurant = Object.assign({},data.rr);
            if(data.address.unit){
              data.address.unit = data.address.unit+'-'
            }
            const address = Object.assign({},data.address);
            const oid = data.oid;
            const bdate = data.bdate;
            const orderData = Object.assign({},{oid,bdate,order,restaurant,address});

            realm.create('Orders',orderData, true );



          })
        });


        break;


        default:

      }
    }
    _pushLocation(){
          // var d = new Date();
          // var h = d.getHours();
          // var m = d.getMinutes();
          // var s = d.getSeconds();
          // let time = h+':'+m+':'+s;
          // console.log(time)
          // MDWampBridge.call("geo_trace",
          //   [this.driver_id,
          //     moment(this.state.location.timestamp).format("MM-DD-YYYY HH:mm:ss") + '\n' +
          //           this.state.location.coords.latitude+','+
          //           this.state.location.coords.longitude+'\n\n'])
          MDWamp.call("geo_trace",
            [this.driver_id,
                    this.state.location.coords.latitude+','+
                    this.state.location.coords.longitude])
    }
    _newOrderNotification(message){
      console.log('_newOrderNotification')
      if(!this.state.showNotification){
        this.setState({
          showNotification:true,
          notificationMessage:message,
        })
        notificationAlert = setInterval(()=>{
          FlashLight.open();
        },500)
      }
    }
    _cancelNotification(){
      const interval = this.notificationAlert
      clearInterval(notificationAlert);
      FlashLight.close();
      this.setState({showNotification:false})
    }

    async _goOnline(){
      this._animateOpenTaskList()
      this.token = await Auth.getToken();
      console.log(this.token)
      const token =this.token;
      MDWamp.startMDWamp(this.token);
      this.setState({
        online:true,
        showOfflineBtn:true,
      })
    }

    async _goOffline(){
      MDWamp.call("driver_status",[this.token,'OFF',this.state.location.coords.latitude+','+this.state.location.coords.longitude]);
      MDWamp.disconnect();
      this.setState({
        openMap:false,
      })
      const _animateCloseTaskList = ()=>{
        this._animateCloseTaskList();
      }
      setTimeout(function () {
        _animateCloseTaskList()
      }, 10);
      const setOnlineFalse = () => {
        this.setState({
          online:false,
          showOfflineBtn:false,
          taskList:[]
        })
      }
      setTimeout(function () {
        setOnlineFalse()
      }, 500);

    }
    _showOfflineBtn(){
      this.setState({
        showOfflineBtn:!this.state.showOfflineBtn,
      })
    }

    _orderChange(oid,change,status){
      if(change == 'D'){
        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: '#f68a1d',
        },
        (buttonIndex) => {
          if(buttonIndex == 0){
            realm.write(() => {
               realm.create('Orders', {oid:oid,
                                       order: {
                                         oid:oid,
                                         status:status,
                                      }
                                    }, true );
            });
            MDWamp.call("order_change",[this.token,oid,change]);
          }else if(buttonIndex == 1){
            realm.write(() => {
               realm.create('Orders', {oid:oid,
                                       order: {
                                         oid:oid,
                                         status:status,
                                      }
                                    }, true );
            });
            MDWamp.call("order_change",[this.token,oid,change]);
            MDWamp.call("order_change",[this.token,oid,'S']);

          }
        });

      }else{
        realm.write(() => {
           realm.create('Orders', {oid:oid,
                                   order: {
                                     oid:oid,
                                     status:status,
                                  }
                                }, true );
        });

        MDWamp.call("order_change",[this.token,oid,change]);
      }

    }

    _openMap(locationA,locationB,navigationBtn){
      const dest_name = locationA.name
      const dest_addr = locationA.addr

      const markers =[
        {
          latlng:{
            latitude: Number(locationA.lat),
            longitude: Number(locationA.lng),
            },
          title:'locationA.name',
          description:'',
          image:require('../../Image/icon_customer.png'),
          addr:locationA.addr
        },{
          latlng:{
            latitude: Number(locationB.lat),
            longitude: Number(locationB.lng),
          },
          title:'locationB.name',
          description:'',
          image:require('../../Image/icon_restaurant.png'),
          addr:locationB.addr
        }
      ]

      this.setState({
        openMap:true,
        dest_name:dest_name,
        dest_addr:dest_addr,
        navigationBtn:navigationBtn,
        showOfflineBtn:false,
      })
      const _animateCloseTaskList = () =>{
        this._animateCloseTaskList();
      }
      setTimeout(function () {
        _animateCloseTaskList()
      }, 10);
      const addMarker = ()=>{
        this.mapRef.addMarker(markers);
      }
      setTimeout(function () {
        addMarker()
      }, 500);
    }
    _closeMap(){
      this._animateOpenTaskList();
      const closeMap = this.mapRef.closeMap;
      setTimeout(function () {
        closeMap()
      }, 800);
      this.setState({
        showOfflineBtn:true,
      })

    }
    _jumpToMap(){
      this.mapRef.jumpToMap();
    }
    //UX Animation Start
    _backgroundBottom = new Animated.Value(-height*0.275);
    _backgroundHeight = new Animated.Value(height*0.275);
    _infoViewBottom = new Animated.Value(-height*0.275);
    _infoContentOpacity = new Animated.Value(0);
    _infoViewWidth = new Animated.Value(width*0.834);
    _infoViewHeight = new Animated.Value(height*0.283);
    _infoViewLeft = new Animated.Value(width*0.083);
    _statusOpacity = new Animated.Value(0);
    _animateMapView(){
      // const _animateMapBackground = this._animateMapBackground;
      // setTimeout(function () {
      //   // _animateMapBackground()
      // }, 225);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

      // const region ={
      //   latitude: LATITUDE,
      //   longitude: LONGITUDE,
      //   latitudeDelta: 0.01,
      //   longitudeDelta: 0.01 * ASPECT_RATIO,
      // }
      // this.map.animateToRegion(region,400);
      this.mapRef.animateMapView();
      Animated.parallel([
          Animated.timing(this._backgroundBottom, {
              toValue: 0,
              duration: 400,
          }),
          Animated.sequence([
              Animated.timing(this._infoViewBottom, {
                  delay: 225,
                  toValue: height*0.0996,
                  duration: 275, //550ms
              }),
              Animated.parallel([
                Animated.timing(this._infoViewBottom, {
                    toValue: height*0.0647,
                    duration: 100,
                }),
                Animated.timing(this._infoContentOpacity, {
                    toValue: 1,
                    duration: 150,
                }),
              ])
          ])
      ]).start()
    }
    _animateMapBackground(){
      // LayoutAnimation.Presets.linear.duration=300,
      const test = Object.assign(LayoutAnimation.Presets.linear.duration,{duration:300})
      LayoutAnimation.configureNext(test)
      this.setState({
        backgroundStyle:{
          bottom:0
        }
      })
    }
    _animateOpenTaskList(){
      Animated.parallel([
        Animated.timing(this._infoViewBottom, {
            toValue: height-67,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewWidth, {
            toValue: width,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewHeight, {
            toValue: 67,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewLeft, {
            toValue: 0,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoContentOpacity, {
            toValue: 0,
            duration: 500, //550ms
        }),
        Animated.timing(this._backgroundHeight, {
            toValue: height,
            duration: 500, //550ms
        }),
        Animated.timing(this._statusOpacity, {
            toValue: 1,
            duration: 500, //550ms
        })
      ]).start()


    }
    _animateCloseTaskList(){
      Animated.parallel([
        Animated.timing(this._infoViewBottom, {
            toValue:  height*0.0647,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewWidth, {
            toValue: width*0.834,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewHeight, {
            toValue: height*0.283,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoViewLeft, {
            toValue: width*0.083,
            duration: 500, //550ms
        }),
        Animated.timing(this._infoContentOpacity, {
            toValue: 1,
            duration: 500, //550ms
        }),
        Animated.timing(this._backgroundHeight, {
            toValue: height*0.275,
            duration: 500, //550ms
        }),
        Animated.timing(this._statusOpacity, {
            toValue: 0,
            duration: 500, //550ms
        })
      ]).start()
    }
    _hideLogin(){
      this.setState({
        showLogin:false
      })
      this._animateMapView()
    }
    //UX Animation END

    //render component
    _renderLogin(){
      if(this.state.showLogin){
        return <Login hideLogin={this._hideLogin}/>
      }
    }
    _renderTaskList(){
      // if(this.state.taskList.length > 0 && this.state.online){
      if(this.state.online){
        return  <TaskList taskList={this.state.taskList}
                          orderChange = {this._orderChange}
                          openMap = {this._openMap}
                          closeMap = {this._closeMap}
                          showOfflineBtn = {this._showOfflineBtn}
                          styles={{opacity:this._statusOpacity,}}/>
      }
      // else if(this.state.taskList.length == 0 && this.state.online){
      //   return <Image  source={require('../../Image/no_order.png')} style={{top:height*0.2,height:height*0.6,width:height*0.6*0.5, alignSelf:'center'}}/>
      // }
    }
    _renderOfflineBtn(){
      if(this.state.online && this.state.showOfflineBtn){
        return(
          <TouchableOpacity activeOpacity={0.6}
                            onPress={this._goOffline}
                            style={{
                                 position:'absolute',
                                 left:width*0.0175,
                                 bottom:height*0.0213,
                                 }}>
            <Animated.Image style={{
                                    height:height*0.0305,
                                    width:width*0.2066,
                                    opacity:this._statusOpacity}}
                                   source={require('../../Image/offline.png')}>
            </Animated.Image>
          </TouchableOpacity>
        )
      }
    }
    _renderCallServiceBtn(){
      if(this.state.online && this.state.showOfflineBtn){
        return(
          <TouchableOpacity activeOpacity={0.6}
                            onPress={this._goOffline}
                            style={{
                                 position:'absolute',
                                 right:width*0.0175,
                                 bottom:height*0.0213,
                                 }}>
             <Animated.Image style={{
                                    height:height*0.0305,
                                    width:width*0.2066,
                                    opacity:this._statusOpacity}}
                                    source={require('../../Image/call_service.png')}>
             </Animated.Image>
          </TouchableOpacity>
        )
      }
    }
    _renderNavigationBtn(){
      if(this.state.navigationBtn == 'P'){
        return(
          <TouchableOpacity activeOpacity={0.6} onPress={this._jumpToMap}>
            <Image
                style={{height:height*0.0543,
                        width:width*0.3446,
                      }}
                source={require('../../Image/button_restaurant.png')}
              />
          </TouchableOpacity>
        )

      }else{
        return(
          <TouchableOpacity activeOpacity={0.6} onPress={this._jumpToMap}>
            <Image
                style={{height:height*0.0543,
                        width:width*0.3446,
                      }}
                source={require('../../Image/button_customer.png')}
              />
          </TouchableOpacity>
        )
      }
    }
    _renderInfoView(){
      if(!this.state.openMap){
        return(
          <View style={{flex:1,alignItems:'center',padding:10,}}>
            <Animated.Text style={{fontSize:25,
                                   top:25,
                                   color:'#475464',
                                   opacity:this._infoContentOpacity}}
                            allowFontScaling={false}>
                Chanmao Driver
            </Animated.Text>
            <TouchableOpacity activeOpacity={0.6} onPress={this._goOnline}>
              <Animated.Image
                  style={{height:height*0.0543,
                          width:width*0.3446,
                          top:height*0.283*0.5,
                          opacity:this._infoContentOpacity,
                        }}
                  source={require('../../Image/btn_start.png')}
                />
            </TouchableOpacity>
          </View>
        )
      }else{
        return(
          <Animated.View style={{flex:1,alignItems:'center',padding:10,opacity:this._infoContentOpacity}}>
            <Text style={{fontSize:20,
                           marginTop:25,
                           color:'#475464',
                           }}
                            numberOfLines={2}
                            allowFontScaling={false}>
                {this.state.dest_name}
            </Text>
            <View style={{backgroundColor:'#a4afc0',height:1,marginTop:7,width:width*0.7}}>
            </View>
            <Text style={{fontSize:18,
                          color:'#475464',
                          marginTop:7,
                        }}
                            numberOfLines={2}
                            allowFontScaling={false}>
                {this.state.dest_addr}
            </Text>
            <View style={{flexDirection:'row',marginTop:height*0.283*0.2}}>
                <TouchableOpacity activeOpacity={0.6} onPress={this._closeMap}>
                  <Image
                      style={{height:height*0.0543,
                              width:width*0.3446,
                            }}
                      source={require('../../Image/button_return.png')}
                    />
                </TouchableOpacity>
                {this._renderNavigationBtn()}
            </View>

          </Animated.View>
        )
      }
    }
    _renderNotification(){
      if(this.state.showNotification){
      // if(true){
        return(
          <TouchableOpacity onPress={this._cancelNotification}style={{position:'absolute',top:67,left:0,right:0,}}>
            <View style={{backgroundColor:'#2a3139',height:30}}>
                <Text style={{fontSize:20,
                               top:3,
                               color:'#ffffff',
                               alignSelf:'center',
                             }}
                               allowFontScaling={false}>
                      {this.state.notificationMessage}
                </Text>
            </View>
          </TouchableOpacity>
        )
      }
    }
    // <TouchableOpacity activeOpacity={0.6} onPress={this._animateCloseTaskList} style={{width:300,height:300}}>
    //
    // </TouchableOpacity>

    render() {
      return (
        <View style={styles.container}>
          <Map ref={(mapRef) => {this.mapRef = mapRef}}/>
          <Animated.View style={{width:width,
                                 height:this._backgroundHeight,
                                 bottom:this._backgroundBottom,
                                 backgroundColor:'#efefef',
                                 position:'absolute',}}>

          {this._renderTaskList()}

         </Animated.View>
         <Animated.View style={{width:this._infoViewWidth,
                                height:this._infoViewHeight,
                                left:this._infoViewLeft,
                                bottom:this._infoViewBottom,
                                backgroundColor:'#ffffff',
                                position:'absolute',}}>

              <Animated.Text style={{fontSize:25,
                                     position:'absolute',
                                     top:25,
                                     left:0,
                                     right:0,
                                     textAlign:'center',
                                     opacity:this._statusOpacity}}
                             allowFontScaling={false}>
                  ORDERS
              </Animated.Text>
              {this._renderInfoView()}
              {this._renderOfflineBtn()}

          </Animated.View>
          {this._renderNotification()}
          {this._renderLogin()}
        </View>
      );
    }
}
// position:'absolute',
// left:0,
// right:0,
// <View style={{height:height*0.283,width:width:0.834,}}>
// </View>
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView:{
    width:200,
    height:200,
  }
})

module.exports = Home;
