import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker, Popup, ZoomControl } from 'react-mapbox-gl';
import { parseString } from 'xml2js';
import { List, Map, fromJS } from 'immutable';
import styles from './london-cycle.style';
import logo from './logo.svg';
import './App.css';
import config from './config.json';
import { data } from './data.json';

const { accessToken, style } = config;

class App extends Component {
  state = {
    center: [-13.8248762, 37.3811294],
    zoom: [1],
    skip: 0,
    stations: new List(),
  };

  componentWillMount() {
    const stations = data.map((e) => new Map(e));
    this.setState({
      stations: new List(stations)
    });
  };

  _markerClick = (station, { feature }) => {
    this.setState({
      center: station.get("position"),
      zoom: [1],
      station
    });
  };

  _onDrag = () => {
    if (this.state.station) {
      this.setState({
        station: null
      });
    }
  };

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _onControlClick = (map, zoomDiff) => {
    const zoom = map.getZoom() + zoomDiff;
    this.setState({ zoom: [zoom] });
  };

  _handleClosePopup = () => {
    if (this.state.station) {
      this.setState({
        station: null
      });
    }
  }

  render() {
    const { stations, station, skip, end, fitBounds } = this.state;
    stations.map((station, index) => {
      console.log(station.get("id"), station.get("position"), index);
    });

    const markerCoord = [
      -0.2416815,
      51.5285582
    ];

    const markerContainer = document.createElement('div');
    markerContainer.style.width = "400px";
    markerContainer.style.position = "absolute";

    const markerList = [1, 2];

    return (
      <div className="App">
        <ReactMapboxGl
          style={style}
          // center={this.state.center}
          zoom={this.state.zoom}
          accessToken={accessToken}
          onDrag={this._onDrag}
          containerStyle={styles.container}>

          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>
          { stations && stations.map((station, index) => {
            return <Marker
            key={station.get("id")}
            anchor="top"
            coordinates={station.get("position")}
            onHover={this._onToggleHover.bind(this, "pointer")}
            onEndHover={this._onToggleHover.bind(this, "")}
            onClick={this._markerClick.bind(this, station)}
            >
              <h1><img src={station.get("image_thumb")} /></h1>
          </Marker>})
          }
          {
            station && (
              <Popup
                key={station.get("id")}
                coordinates={station.get("position")}
                style={styles.popup}>
                <div>
                  <button style={styles.popupCloseButton} onClick={this._handleClosePopup}>&times;</button>
                  <img src={station.get("image_large")} style={{ maxWidth: '100%'}} />
                  <div>
                    <button>I want to do it</button>
                    <button>I have done it</button>
                  </div>
                </div>
              </Popup>
            )
          }
        </ReactMapboxGl>
      </div>
    );
  }
}

export default App;
