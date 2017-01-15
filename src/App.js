import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from 'react-mapbox-gl';
import { parseString } from 'xml2js';
import { List, Map, fromJS } from 'immutable';
import styles from './london-cycle.style';
import logo from './logo.svg';
import './App.css';
import config from './config.json';
import { data } from './data.json';

const { accessToken, style } = config;

const maxBounds = [
  [-0.481747846041145,51.3233379650232], // South West
  [0.23441119994140536,51.654967740310525], // North East
];

class App extends Component {
  
  state = {
    center: [-0.109970527, 51.52916347],
    zoom: [11],
    skip: 0,
    stations: new List(),
    popupShowLabel: true
  };

  componentWillMount() {
    const stations = data.map((e) => new Map(e));
    this.setState({
      stations: new List(stations)
    });
  };

  _markerClick = (station, { feature }) => {
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
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

  _popupChange(popupShowLabel) {
    this.setState({ popupShowLabel });
  }

  toggle = true;

  _onFitBoundsClick = () => {

    if (this.toggle) {
      this.setState({
        fitBounds: [[-0.122555629777, 51.4734862092], [-0.114842, 51.50621]]
      });
    } else {
      this.setState({
        fitBounds: [[32.958984, -5.353521], [43.50585, 5.615985]] // this won't focus on the area as there is a maxBounds
      });
    }

    this.toggle = !this.toggle;
  };


  render() {
    const { stations, station, skip, end, popupShowLabel, fitBounds } = this.state;
    stations.map((station, index) => {
      console.log(station.get("id"), station.get("position"), index);
    });
    return (
      <div className="App">
        <ReactMapboxGl
          style={style}
          fitBounds={fitBounds}
          center={this.state.center}
          zoom={this.state.zoom}
          minZoom={8}
          maxZoom={15}
          maxBounds={maxBounds}
          accessToken={accessToken}
          onDrag={this._onDrag}
          containerStyle={styles.container}>

          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>

          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            {
              stations
              .map((station, index) => (
                <Feature
                  key={station.get("id")}
                  onHover={this._onToggleHover.bind(this, "pointer")}
                  onEndHover={this._onToggleHover.bind(this, "")}
                  onClick={this._markerClick.bind(this, station)}
                  coordinates={station.get("position")}/>
              )).toArray()
            }
          </Layer>

          {
            station && (
              <Popup
                key={station.get("id")}
                coordinates={station.get("position")}>
                <div>
                  <span style={{
                    ...styles.popup,
                    display: popupShowLabel ? "block" : "none"
                  }}>
                    {station.get("name")}
                  </span>
                  <div onClick={this._popupChange.bind(this, !popupShowLabel)}>
                    {
                      popupShowLabel ? "Hide" : "Show"
                    }
                  </div>
                </div>
              </Popup>
            )
          }
        </ReactMapboxGl>
        {
          station && (
            <div style={styles.stationDescription}>
              <p>{ station.get("name") }</p>
              <p>{ station.get("bikes") } bikes / { station.get("slots") } slots</p>
            </div>
          )
        }
        <div style={{
        ...styles.btnWrapper,
        ...(station && styles.btnStationOpen)
      }}>
          <button style={styles.btn} onClick={this._onFitBoundsClick}>Fit to bounds</button>
        </div>

      </div>
    );
  }
}

export default App;
