import React, { PropTypes, Component } from 'react';

const K_WIDTH = 30;
const K_HEIGHT = 30;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 10,
  fontWeight: 'bold',
  padding: 4,
};

export default class Marker extends Component {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    return (
      <div style={greatPlaceStyle}>
        {this.props.text}
      </div>
    );
  }
}
