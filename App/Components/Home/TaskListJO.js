'use strict';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  ListView,
  NativeEventEmitter,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
//Components
import TaskCard from './TaskCard';

//database
const  Realm = require('realm');
let realm = new Realm();

class TaskList extends Component {
    constructor(props) {
      super(props)

      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state={
        data:[],
        dataSource: this.ds.cloneWithRows([]),
      }
      this._renderTaskList = this._renderTaskList.bind(this);
      this._updateDataSource = this._updateDataSource.bind(this);
    }

    componentDidMount(){
      // .sorted('oid')
      // let orders = realm.objects('Orders');
      // console.log(orders)
      // this.setState({
      // 	dataSource: this.state.dataSource.cloneWithRows(orders)
      // })
      this.state={
        dataSource: this.ds.cloneWithRows(this.state.data),
      }
      realm.addListener('change', () => {
        console.log('onchange');
        this._updateDataSource();
      });
    }

    componentWillUnmount(){

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //   console.log('should',nextProps, nextState);
    //   console.log(this.props, this.state);
    //
    //   return false;
    // }
    // componentWillUpdate(nextProps){
    //   console.log('will update')
    //   if (this.state.dataSource._cachedRowCount !== this.state.data.length) {
    //       this._updateDataSource();
    //       // this.setState({
    //       // data: this.props.taskList,
    //       // dataSource: this.state.dataSource.cloneWithRows(this.props.taskList)
    //       // })
    //    }
    // }

    _updateDataSource(){
      let orders = realm.objects('Orders');
      const orders2 = [
        {oid: '335',
                                order: {
                                  oid:'52456',
                                  comment:'52456',
                                  created:'string',
                                  dlexp:'string',
                                  rid:'string',
                                  status:'10',
                                  total:'string'
                               },
                               restaurant:{
                                 rid:'52',
                                 addr:"3280 Midland Avenue, Toronto",
                                 lat:"43.805878",
                                 lng:"-79.288177",
                                 name:"测试商家(请勿下单)",
                                 postal:"M8Y 0B6",
                                 tel:"6476256266",
                                 unit:"111"
                               },
                               user:{
                                 uid:'32',
                                 addr:"1571 Sandhurst Cir, Scarborough, ON M1V 1V2加拿大",
                                 buzz:"",
                                 lat:"43.808895",
                                 lng:"-79.269852",
                                 name:"Aiden",
                                 postal:"M1V 1V2",
                                 tel:"5555555555",
                                 unit:""
                               }
                             }
      ]
      this.state={
        data:orders2,
        dataSource: this.state.dataSource.cloneWithRows([{},{}]),
      }
      console.log(this.state.dataSource)
    }
    // <TaskCard oid={item.oid}
    //           status={item.order.status}
    //           order={item.order}
    //           restaurant={item.restaurant}
    //           user={item.user}
    //           orderChange={this.props.orderChange}
    //           openMap = {this.props.openMap}
    //           closeMap = {this.props.closeMap}/>
    _renderTaskList (item,index)  {
      return(

                  <Text style={{textAlign: 'center',
                  color: '#333333',
                  marginBottom: 5,}}>
                    To get started, edit index.android.js
                  </Text>
      )
    }
    render() {
      console.log('render',this.state.dataSource)
      return (
        <Animated.View   style={[this.props.styles,{marginTop:67}]}>

          <View style={{flex:1,height:1,backgroundColor:'#d1d2d4'}}/>
          <ListView
                  dataSource={this.state.dataSource}
                  initialListSize={300}
                  pageSize={4}
                  renderRow={(item) => this._renderTaskList(item)}
                  scrollEnabled={true}
                  scrollRenderAheadDistance={500}
                  enableEmptySections={true}
                />

        </Animated.View>
      )
    }
  }


module.exports = TaskList;
