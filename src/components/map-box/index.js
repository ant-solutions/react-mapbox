import React, { Component, PropTypes } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker, Popup, ZoomControl } from 'react-mapbox-gl';
import { List, Map, fromJS } from 'immutable';
import styles from './styles';
import MapPopup from '../map-popup/';

export default class MapBox extends Component {
  static propTypes = {
    accessToken: PropTypes.string.required,
    data: PropTypes.object.required,
    mapStyle: PropTypes.string,
  };

  static defaultProps = {
    accessToken: '',
    data: [],
    mapStyle: 'mapbox://styles/mapbox/streets-v8'
  };

  state = {
    zoom: [1],
    moments: new List(),
  };

  componentWillMount() {
    const { data } = this.props;
    const moments = data.map((e) => new Map(e));
    this.setState({
      moments: new List(moments)
    });
  };

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const moments = data.map((e) => new Map(e));
    this.setState({
      moments: new List(moments)
    });
  }

  _markerClick = (station) => {
    this.setState({
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
    const { accessToken, data, mapStyle, ...rest } = this.props;
    const { moments, station } = this.state;
     return (
      <ReactMapboxGl
          style={mapStyle}
          zoom={this.state.zoom}
          accessToken={accessToken}
          onDrag={this._onDrag}
          containerStyle={styles.container}>
          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>
          {
            moments && moments.map((station, index) => (
              <Marker
                key={station.get("id")}
                anchor="top"
                coordinates={station.get("position")}
                onHover={this._onToggleHover.bind(this, "pointer")}
                onEndHover={this._onToggleHover.bind(this, "")}
                onClick={this._markerClick.bind(this, station)}
                >
                  <img src={station.get("image_thumb")} />
              </Marker>)
            )
          }
          {
            station && (
              <MapPopup
                key={station.get("id")}
                coordinates={station.get("position")}
                data={station}
                onCloseButtonClick={this._handleClosePopup}
              />
            )
          }
        </ReactMapboxGl>
    );
  }
};
