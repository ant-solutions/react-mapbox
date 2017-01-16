import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker, Popup, ZoomControl } from 'react-mapbox-gl';
import { parseString } from 'xml2js';
import { List, Map, fromJS } from 'immutable';
import logo from './logo.svg';
import './App.css';
import config from './config.json';
import { data } from './data.json';
import MapBox from './components/map-box/';

const { accessToken, style } = config;

class App extends Component {
  render() {
    return (
      <div className="App">
        <MapBox
          accessToken={accessToken}
          data={data}
          mapStyle={style}
        />
      </div>
    );
  }
}

export default App;
