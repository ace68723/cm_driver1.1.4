'use strict';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Linking,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
const {height,width} = Dimensions.get('window');

class TaskCard extends Component {
    constructor() {
      super()
    }
    shouldComponentUpdate(nextProps, nextState){
      if(this.props.status != nextProps.status){
        return true
      }else{
        return false
      }

    }
    _renderTask(){
      if(this.props.status == 10 ||this.props.status == 20 ){
        return this._renderPickup()
      }else if(this.props.status == 30){
        return this._renderDelivering()
      }else if(this.props.status ==40){
        return this._renderFinish()
      }else if(this.props.status == 90 || this.props.status == 500){
        return this._renderCancel()
      }
    }
    _renderComment(){
      if(this.props.order.comment!=''){
        return(
          <Text allowFontScaling={false} style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.0136}}>
            Comment: {this.props.order.comment}
          </Text>
        )
      }
    }
    _renderPickup(){
      return(
        <View style={{width:width*0.965,
                      minHeight:width*0.965*0.5,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#f68a1d',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0254,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid}｜Pick-up
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                      {this.props.order.created}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant,this.props.address,'P')}>
                    <View style={{marginTop:width*0.0163,}}>
                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                        &nbsp;&nbsp;&nbsp; {this.props.restaurant.name}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                    </View>
                  <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                    {this.props.restaurant.addr}
                  </Text>
                 </TouchableOpacity>
              </View>

              <View style={{flex:1}}>
              <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.restaurant.tel)}}>
                <Image
                    style={{height:height*0.035,
                            width:height*0.035*3.4627,
                            alignSelf:'center',
                          }}
                    source={require('../../Image/call_restaurant.png')}
                  />
                </TouchableOpacity>
              </View>

            </View>

            <View style={{flexDirection:'row',marginTop:height*0.0160}}>

              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Total: ${this.props.order.total}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Delivery Fee: ${this.props.order.dlexp}
              </Text>

            </View>
            <Text allowFontScaling={false} style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.008}}>
              User: {this.props.address.unit}{this.props.address.addr}
            </Text>
            {this._renderComment()}
            <TouchableOpacity onPress={this.props.orderChange.bind(null,this.props.oid,'P','30')}>
              <Image
                  style={{height:height*0.04,
                          width:height*0.04*3.5974,
                          alignSelf:'center',
                          marginTop:10,
                        }}
                  source={require('../../Image/pick_up.png')}
                />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    _renderDelivering(){
      return(
        <View style={{width:width*0.965,
                      minHeight:width*0.965*0.5,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#475464',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0254,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7,paddingRight:5}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:13,fontWeight:'800'}}>
                      {this.props.oid}｜Delivering
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                      {this.props.order.created}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.address,this.props.restaurant,'D')}>

                  <View style={{marginTop:height*0.008,}}>

                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                          &nbsp;&nbsp;&nbsp; {this.props.address.unit}{this.props.address.addr}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                  </View>

                  </TouchableOpacity>
              </View>

              <View style={{flex:1}}>
              <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.address.tel)}}>
                <Image
                    style={{height:height*0.035,
                            width:height*0.035*3.4627,
                            alignSelf:'center',
                          }}
                    source={require('../../Image/call_customer.png')}
                  />
              </TouchableOpacity>
              </View>

            </View>

            <View style={{flexDirection:'row',marginTop:height*0.006}}>
              <Text allowFontScaling={false} style={{flex:1,fontSize:13,color:'#485465',fontWeight:'500'}}>
                {this.props.address.name}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Total: ${this.props.order.total}
              </Text>
            </View>

            <View style={{flexDirection:'row',marginTop:height*0.006}}>

              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,}}>
                {this.props.restaurant.name}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Delivery Fee: ${this.props.order.dlexp}
              </Text>

            </View>
            {this._renderComment()}

            <TouchableOpacity onPress={this.props.orderChange.bind(null,this.props.oid,'D','40')}>
              <Image
                  style={{height:height*0.04,
                          width:height*0.04*3.5974,
                          alignSelf:'center',
                          marginTop:10,
                        }}
                  source={require('../../Image/delivered.png')}
                />
            </TouchableOpacity>

          </View>
        </View>
      )
    }
    _renderFinish(){
      return(
        <View style={{width:width*0.965,
                      minHeight:width*0.965*0.3,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#475464',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0254,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7,paddingRight:5}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:13,fontWeight:'800'}}>
                      {this.props.oid}｜Finish
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                      {this.props.order.created}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.address,this.props.restaurant,'D')}>
                    <View style={{marginTop:height*0.008,}}>

                        <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                            &nbsp;&nbsp;&nbsp; {this.props.address.unit}{this.props.address.addr}
                        </Text>
                        <Image
                            style={{height:height*0.025,
                                    width:height*0.025*0.7272,
                                    marginTop:height*0.0043,
                                    top:-1,
                                    left:0,
                                    position:'absolute',
                                  }}
                            source={require('../../Image/icon_location.png')}
                          />
                    </View>
                  </TouchableOpacity>

              </View>

              <View style={{flex:1}}>
              <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.address.tel)}}>
                <Image
                    style={{height:height*0.035,
                            width:height*0.035*3.4627,
                            alignSelf:'center',
                          }}
                    source={require('../../Image/call_customer.png')}
                  />
                </TouchableOpacity>

              </View>

            </View>

            <View style={{flexDirection:'row',marginTop:height*0.006}}>
              <Text allowFontScaling={false} style={{flex:1,fontSize:13,color:'#485465',fontWeight:'500'}}>
                {this.props.address.name}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Total: ${this.props.order.total}
              </Text>
            </View>

            <View style={{flexDirection:'row',marginTop:height*0.006}}>

              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,}}>
                {this.props.restaurant.name}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Delivery Fee: ${this.props.order.dlexp}
              </Text>

            </View>
            {this._renderComment()}
          </View>
        </View>
      )
    }
    _renderCancel(){
      return(
        <View style={{width:width*0.965,
                      minHeight:height*0.18,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#ef5467',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0254,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid} |
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800',color:'#ef5467'}}>
                      &nbsp;Canceled
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                      {this.props.order.created}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant.name,this.props.restaurant.addr,this.props.address.addr)}>
                    <View style={{marginTop:width*0.0163,}}>
                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                        &nbsp;&nbsp;&nbsp; {this.props.restaurant.name}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                    </View>



                  <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                    {this.props.restaurant.addr}
                  </Text>
                 </TouchableOpacity>
              </View>

            </View>

            <View style={{flexDirection:'row',marginTop:height*0.0160}}>

              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Total: ${this.props.order.total}
              </Text>
              <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                Delivery Fee: ${this.props.order.dlexp}
              </Text>

            </View>
            <Text allowFontScaling={false} style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.008}}>
              User: {this.props.address.unit}{this.props.address.addr}
            </Text>
            {this._renderComment()}
          </View>
        </View>
      )
    }
    render() {
      console.log('render card')
      return (
        <View>
          {this._renderTask()}
        </View>

      )
    }
  }
module.exports = TaskCard;
// onPress={this.props.orderChange.bind(null,this.props.oid,'P')}
