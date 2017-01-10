
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskCard from './TaskCard';

var reverse = require('lodash.reverse');
const {height,width} = Dimensions.get('window');
//database
const  Realm = require('realm');
let realm = new Realm();

export default class TaskList extends Component {
  constructor() {
    super()
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={
      data:[],
      dataSource: this.ds.cloneWithRows([]),
    }
    this._renderTaskItem = this._renderTaskItem.bind(this);
    this._updateDataSource = this._updateDataSource.bind(this);
  }
  componentDidMount(){
    realm.addListener('change', () => {
        this._updateDataSource();
    });
  }
  componentWillUnmount(){
    realm.removeAllListeners();
  }
  _updateDataSource(){
    let bdate = realm.objectForPrimaryKey('AppUserInfo','bdate').value;
    const bdateFilter = 'bdate = "'+bdate+'"';
    this.orders = realm.objects('Orders').filtered(bdateFilter).sorted('oid',true);
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(this.orders),
    })
  }
  _renderTaskItem (item,index)  {

    return(
      <TaskCard oid={item.oid}
                status={item.order.status}
                order={item.order}
                restaurant={item.restaurant}
                address={item.address}
                orderChange={this.props.orderChange}
                openMap = {this.props.openMap}
                closeMap = {this.props.closeMap}/>
    )
  }
  _renderTaskList(){
    if(!this.orders || this.orders.length == 0) {
      return <Image  source={require('../../Image/no_order.png')}
                     style={{top:height*0.2,height:height*0.6,width:height*0.6*0.5, alignSelf:'center'}}/>
    }
    if(this.orders.length >0){
      return(
             <ListView dataSource={this.state.dataSource}
                initialListSize={300}
                pageSize={4}
                renderRow={(item) => this._renderTaskItem(item)}
                scrollEnabled={true}
                scrollRenderAheadDistance={500}
                enableEmptySections={true}
              />
            )
    }
  }
  // <View style={{flex:1,height:1,backgroundColor:'#d1d2d4'}}/>

  render() {
    return (
      <Animated.View   style={[this.props.styles,{marginTop:67}]}>
        {this._renderTaskList()}
      </Animated.View>
    );
  }
}
