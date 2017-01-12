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
import TaskCard from './TaskCard';

class TaskDetail extends Component {
    constructor() {
      super()
      this.state = {
        scrollY: new Animated.Value(0),
        shouldBindScroll:false
      }

    }
    componentWillMount(){
      this._gestureHandlers = {
        onResponderRelease: ()=>{
          console.log('onResponderRelease',this.state.scrollY._value)
          if(this.state.scrollY._value < -80){
            this.setState({
              shouldBindScroll:false
            })


              this._width = new Animated.Value(width*0.965-80);
              this._left = new Animated.Value(width*0.0175+40);
              // this._top = new Animated.Value(30);
              this.closeComment()
              const close = this.props.close;
              setTimeout(function () {
                close()
              }, 200);

          }
        },

      }
    }
    componentDidMount(){
      this.openComment();
      const test = ()=>{
        this.setState({
          shouldBindScroll:true,
        })
      }
      setTimeout(function () {
        test()
      }, 500);
    }
    _height = new Animated.Value(height*0.5);
    _width = new Animated.Value(width*0.5);
    _left = new Animated.Value(width*0.25);
    _opacity = new Animated.Value(0.4);
    _top = new Animated.Value(height*0.4);
    openComment(){
      Animated.parallel([
          Animated.timing(this._height, {
              toValue: height*0.87,
              duration: 200,
          }),
          Animated.timing(this._width, {
              toValue: width*0.965,
              duration: 200,
          }),
          Animated.timing(this._left, {
              toValue: width*0.0175,
              duration: 200,
          }),
          Animated.timing(this._opacity, {
              toValue: 1,
              duration: 200,
          }),
          Animated.timing(this._top, {
              toValue: 0,
              duration: 200,
          })
      ]).start()
    }
    closeComment(){
      Animated.parallel([
          Animated.timing(this._height, {
              toValue: height*0.5,
              duration: 400,
          }),
          Animated.timing(this._width, {
              toValue: width*0.5,
              duration: 400,
          }),
          Animated.timing(this._left, {
              toValue: width*0.25,
              duration: 400,
          }),
          Animated.timing(this._opacity, {
              toValue: 0,
              duration: 400,
          }),
          Animated.timing(this._top, {
              toValue: height*0.4,
              duration: 400,
          })
      ]).start()
    }
    _getWidth(){
      if(!this.state.shouldBindScroll){
        return this._width
      }else{
        const viewWidth = this.state.scrollY.interpolate({
          inputRange: [-80, 0],
          outputRange: [ width*0.965-80,width*0.965],
          extrapolate: 'clamp',
        });
        return viewWidth
      }

    }
    _getLeft(){
      if(!this.state.shouldBindScroll){
        return this._left
      }else{
        const viewLeft = this.state.scrollY.interpolate({
          inputRange: [-80, 0],
          outputRange: [ width*0.0175+40,width*0.0175],
          extrapolate: 'clamp',
        });
        return viewLeft
      }

    }
    _scrollEventBind(ref){
      return(
        Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          )
      )
    }
    render() {
      return (
        <ScrollView
            ref={'_scrollVew'}
            style={{
                position:'absolute',
                top:0,
                left:0,
                right:0,
                bottom:0

            }}
            scrollEventThrottle={16}
            onScroll={this._scrollEventBind()}
            {...this._gestureHandlers}>
          <Animated.View style={{
                        marginTop:height*0.0135,
                        position:'absolute',
                        height:this._height,
                        width:this._getWidth(),
                        left:this._getLeft(),
                        opacity:this._opacity,
                        top:this._top,
                        backgroundColor:'#ffffff',
                        paddingRight:20,
                        paddingLeft:20,
                        shadowColor:'#000000',
                        shadowOpacity:0.1,
                        shadowOffset:{width: 2, height: 2}
                      }}
                        >
              <Text
                    allowFontScaling={false}
                    style={{color:'#485465',
                            fontSize:13,
                            fontWeight:'500',
                            marginTop:height*0.0136,
                            textAlign:'center',
                          }}>
                  ↓ Scroll Up To Close ↓
              </Text>
              <Text
                    allowFontScaling={false}
                    style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.0136}}>
                Comment: {this.props.order.comment}
              </Text>

          </Animated.View>
        </ScrollView>


      )
    }
  }
module.exports = TaskDetail;
// onPress={this.props.orderChange.bind(null,this.props.oid,'P')}

// height:height*0.9,
// width:width*0.965,
// left:width*0.0175,


// height:height*0.5,
// width:width*0.5,
// left:width*0.25,
// bottom:0,
