/* eslint no-undef:0 */

import React from 'react';
import { findDOMNode } from 'react-dom';

function isNodeInRoot(node, root) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export default class Modal extends React.Component {

  constructor() {
    super();
    this.handleMouseClickOutside = this.handleMouseClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseClickOutside);
  }

  handleMouseClickOutside(e) {
    if (isNodeInRoot(e.target, findDOMNode(this.refs.content))) {
      return;
    }
    e.stopPropagation();
    this.props.closePortal();
  }

  render() {
    return (
      <div>
        <div className="modal-backdrop in" />
        <div className="modal in" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document" ref="content">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={this.props.closePortal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

Modal.propTypes = {
  title: React.PropTypes.string.isRequired,
  closePortal: React.PropTypes.func,
  children: React.PropTypes.element.isRequired,
};
