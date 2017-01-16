import React, { Component, PropTypes } from 'react';
import { Popup } from 'react-mapbox-gl';
import { Map } from 'immutable';
import styles from './styles';

export default class MapPopup extends Component {
  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    data: PropTypes.object.isRequired,
    anchor: PropTypes.string,
    offset: PropTypes.any,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onCloseButtonClick: PropTypes.func,
  };

  static defaultProps = {
    anchor: 'top',
    onCloseButtonClick: () => {}
  };

  button1Hanlder = () => {
    alert('I want to do it event');
  }

  button2Hanlder = () => {
    alert('I have done it event');
  }

  render() {
    const { coordinates, anchor, offset, onClick, onCloseButtonClick, data, children, ...rest } = this.props;
    if (!data) {
      return null;
    }

    return (
      <Popup
        {...rest}
        coordinates={coordinates}
        onClick={onClick}
        offset={offset}
        anchor={anchor}
        coordinates={coordinates}
        style={styles.popup}
      >
        <div>
          <button style={styles.popupCloseButton} onClick={onCloseButtonClick}>&times;</button>
          <div>
            <img src={data.get("image_large")} style={{ maxWidth: '100%'}} />
            <div style={styles.buttonWrapper}>
              <button style={styles.button} onClick={this.button1Hanlder}>I want to do it</button>
              <button style={styles.button2} onClick={this.button2Hanlder}>I have done it</button>
            </div>
          </div>
        </div>
      </Popup>
    );
  }
};
