
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  ListView,
  Linking,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

//native Modules
import MapView from 'react-native-maps';

const {height,width} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE =  43.844389;
const LONGITUDE = -79.384422;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

let region = {};
export default class Map extends Component {
  constructor() {
    super()
    this.state={
      mapViewStyle:{
        height:height*2,
        width:width*2,
        left:-width*0.5,
        top:-height*0.5,
      },
      markers:[],
      // region: new MapView.AnimatedRegion({
      //   latitude: LATITUDE,
      //   longitude: LONGITUDE,
      //   latitudeDelta: LATITUDE_DELTA,
      //   longitudeDelta: LONGITUDE_DELTA,
      // }),
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    }
    this.addMarker = this.addMarker.bind(this);
    this.fitAllMarkers = this.fitAllMarkers.bind(this);
    this.closeMap = this.closeMap.bind(this);
    this.jumpToMap = this.jumpToMap.bind(this);
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  changeMapRegion(latitude,longitude){
      region ={
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * ASPECT_RATIO,
      }
      this.map.animateToRegion(region,400);
  }
  animateMapView(){
    const initRegion ={
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01 * ASPECT_RATIO,
    }
    this.map.animateToRegion(initRegion,400);
    // this.state.region.timing(region).start();
  }
  fitAllMarkers(markers) {
    this.map.fitToCoordinates(
      [markers[0].latlng,markers[1].latlng],
      {edgePadding: { top: 400, right: 250, bottom: 600, left: 250 },animated: false})
  }
  addMarker(markers){
    this.setState({
      markers:markers,
      region: {
        latitude: markers[0].latlng.latitude,
        longitude: markers[0].latlng.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      destination:markers[0].addr
    })
    fitAllMarkers = this.fitAllMarkers;
    setTimeout(function () {
      fitAllMarkers(markers)
    }, 1);
    // const options = {
    //     method: 'GET',
    //     mode:'cors',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     }
    //   }
    // fetch('https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=AIzaSyBuIe8cxae1ftYK6QNd22xTPV-1MWfWSH4',options)
    //         .then((res) => res.json())
    //         .then((res)=> {console.log(res)})
    //         .catch((error) => {throw error})
    // https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=AIzaSyBuIe8cxae1ftYK6QNd22xTPV-1MWfWSH4
  }
  jumpToMap(){
    var url = `comgooglemaps-x-callback://
                ?daddr=`+this.state.destination;
    Linking.openURL(url);
  }
  closeMap(){
    this.setState({
      markers:[],
    })
  }

  render() {
    return (
      <MapView
          showsUserLocation={true}
          ref={ref => { this.map = ref; }}
          style={this.state.mapViewStyle}
      >
      {this.state.markers.map((marker,key) => (
         <MapView.Marker
           key={key}
           coordinate={marker.latlng}
           title={marker.title}
           description={marker.description}
           image={marker.image}
         />
       ))}
      </MapView>
    );
  }
}
