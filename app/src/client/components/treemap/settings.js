import React from 'react';
import Portal from 'react-portal';
import { connect } from 'react-redux';
import Modal from '../modal';
import { ACTIONS, COLOR_SCHEMES, SCALES, SQUARE_SIZE, SQUARE_COLOR,COLOR_SCHEME_TRAFFIC_LIGHT } from '../../constants';
import ContinuousColorLegend from './continuous-color-legend';
import '../../styles/legends.scss';

class Settings extends React.Component {

  static propTypes = {
    midTitle: React.PropTypes.string.isRequired,
    endTitle: React.PropTypes.string.isRequired,
    selectScheme: React.PropTypes.func.isRequired,
    changeScale: React.PropTypes.func.isRequired,
    changeSquareSize: React.PropTypes.func.isRequired,
    changeSquareColor: React.PropTypes.func.isRequired,
    legendColorStart: React.PropTypes.string.isRequired,
    legendColorEnd: React.PropTypes.string.isRequired,
    scale: React.PropTypes.any.isRequired,
    squareSize: React.PropTypes.any.isRequired,
    squareColor: React.PropTypes.any.isRequired,
    showRel: React.PropTypes.bool.isRequired,
  };

  render() {
    const cog = (
      <button className="btn btn-info">
        <i className="fa fa-cog" /> Settings
      </button>
    );

    return (
      <Portal closeOnEsc openByClickOn={cog}>
        <Modal title="Treemap settings">
          <div>
           <h5>Sequential Color Palette (Color-blind Safe)</h5>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {COLOR_SCHEMES.map(scheme =>
                <div
                  className={this.props.legendColorStart === scheme.start ?
                    'legend-button-active' : 'legend-button'
                  }
                  key={scheme.start}
                  onClick={() => this.props.selectScheme(scheme)}
                >
                  <ContinuousColorLegend
                    startTitle={this.props.showRel ? '0%' : '0'}
                    midTitle={this.props.midTitle}
                    endTitle={this.props.endTitle}
                    startColor={scheme.start}
                    endColor={scheme.end}
                    width={233}
                    height={20}
                  />
                </div>
              )}
            </div>
            <h5>Traffic Light Color Palette (Not Color-blind Safe)</h5>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {COLOR_SCHEME_TRAFFIC_LIGHT.map(scheme =>
                <div
                  className={this.props.legendColorStart === scheme.start ?
                    'legend-button-active' : 'legend-button'
                  }
                  key={scheme.start}
                  onClick={() => this.props.selectScheme(scheme)}
                >
                  <ContinuousColorLegend
                    startTitle={this.props.showRel ? '0%' : '0'}
                    midTitle={this.props.midTitle}
                    endTitle={this.props.endTitle}
                    startColor={scheme.start}
                    endColor={scheme.end}
                    width={233}
                    height={20}
                  />
                </div>
              )}
            </div>
            <div style={{ marginLeft: '3px', marginBottom: '15px' }}>
              <h5>The cell color represents (% of blacklisted domains by default)</h5>
              <select value={this.props.squareColor} onChange={this.props.changeSquareColor}>
                {SQUARE_COLOR.map((color, index) =>
                  <option value={index} key={color.key}>
                    {color.name}
                  </option>
                )}
              </select>

              <h5>The cell size represents (number of domains by default)</h5>
              <select value={this.props.squareSize} onChange={this.props.changeSquareSize}>
                {SQUARE_SIZE.map((size, index) =>
                  <option value={index} key={size.key}>
                    {size.name}
                  </option>
                )}
              </select>

              <h5>The cell size scale</h5>
              <select value={this.props.scale} onChange={this.props.changeScale}>
                {SCALES.map((scale, index) =>
                  <option value={index} key={scale.key}>
                    {scale.name}
                  </option>
                )}
              </select>
            </div>
          </div>
        </Modal>
      </Portal>
    );
  }

}

const mapStateToProps = state => ({
  legendColorStart: state.getIn(['treemap', 'legendColorStart']),
  legendColorEnd: state.getIn(['treemap', 'legendColorEnd']),
  scale: state.getIn(['treemap', 'scale']),
  squareSize: state.getIn(['treemap', 'squareSize']),
  squareColor: state.getIn(['treemap', 'squareColor']),
});

const mapDispatchToProps = dispatch => ({
  selectScheme: scheme => dispatch({ type: ACTIONS.SELECTED_SCHEME, data: { scheme } }),
  changeScale: event =>
    dispatch({ type: ACTIONS.CHANGED_SCALE, data: { scale: event.target.value } }),
  changeSquareSize: event =>
    dispatch({ type: ACTIONS.CHANGED_SQUARE_SIZE, data: { squareSize: event.target.value } }),
  changeSquareColor: event =>
    dispatch({ type: ACTIONS.CHANGED_SQUARE_COLOR, data: { squareColor: event.target.value } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

