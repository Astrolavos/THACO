// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';

import { CONTINUOUS_COLOR_RANGE } from './theme';

const propTypes = {
  startColor: React.PropTypes.string,
  midColor: React.PropTypes.string,
  endColor: React.PropTypes.string,
  startTitle: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  midTitle: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  endTitle: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
};

const defaultProps = {
  startColor: CONTINUOUS_COLOR_RANGE[0],
  endColor: CONTINUOUS_COLOR_RANGE[1],
};

function ContinuousColorLegend({ startColor, midColor, endColor, startTitle,
  midTitle, endTitle, height, width }) {
  const colors = [startColor];
  if (midColor) {
    colors.push(midColor);
  }
  colors.push(endColor);
  return (
    <div className="rv-continuous-color-legend" style={{ width, height }}>
      <div
        className="rv-gradient"
        style={{ background: `linear-gradient(to right, ${colors.join(',')})` }}
      />
      <div className="rv-legend-titles">
        <span className="rv-legend-titles__left">
          {startTitle}
        </span>
        <span className="rv-legend-titles__right">
          {endTitle}
        </span>
        {midTitle ?
          <span className="rv-legend-titles__center">
            {midTitle}
          </span> :
          null}
      </div>
    </div>
  );
}

ContinuousColorLegend.displayName = 'ContinuousColorLegend';
ContinuousColorLegend.propTypes = propTypes;
ContinuousColorLegend.defaultProps = defaultProps;

export default ContinuousColorLegend;
