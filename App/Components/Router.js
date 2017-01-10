'use strict';
import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import Login from './Login/Login';
import Home from './Home/Home';

class Router extends Component {
    constructor() {
      super()
    }
    // <Home />
    renderScene(route, navigator) {
      switch (route.id) {
        default:
          return (
            <Home />
          )
      }
    }
    render(){
      return(
        <Navigator
             initialRoute={{name: 'My First Scene', index: 0}}
             renderScene={this.renderScene}
           />
      )
    }
}

module.exports = Router;
