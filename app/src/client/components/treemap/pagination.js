/* eslint max-len:0 */

import React from 'react';
import { Link } from 'react-router';

class Pagination extends React.PureComponent {

  static propTypes = {
    limit: React.PropTypes.any.isRequired,
    offset: React.PropTypes.any.isRequired,
    search: React.PropTypes.string,
    count: React.PropTypes.any.isRequired,
    pathname: React.PropTypes.string,
    view: React.PropTypes.any.isRequired,
    id: React.PropTypes.string,
  };

  render() {
    const {
      limit,
      offset,
      count,
      search,
      pathname,
      id,
      view,
    } = this.props;

    if (limit >= count) return null;
    const prevOffset = parseInt(offset, 10) - parseInt(limit, 10);
    const nextOffset = parseInt(offset, 10) + parseInt(limit, 10);
    return (
      <div style={{ textAlign: 'center' }}>
        <nav aria-label="...">
          <ul className="pager" style={{ marginBottom: 0 }}>
            {(prevOffset > -1) &&
              <li>
                <Link to={`${pathname}?id=${id}&view=${view}&search=${search}&limit=${limit}&offset=${prevOffset}`}>
                  Previous {prevOffset} - {prevOffset + parseInt(limit, 10)}
                </Link>
              </li>
            }
            {' '}
            <li className="disabled">
              <Link to={`${pathname}?id=${id}&view=${view}&search=${search}&limit=${limit}&offset=${offset}`}>
                Displaying {offset} - {parseInt(offset, 10) + parseInt(limit, 10)}
              </Link>
            </li>
            {' '}
            {(nextOffset < count) &&
              <li>
                <Link to={`${pathname}?id=${id}&view=${view}&search=${search}&limit=${limit}&offset=${nextOffset}`}>
                  Next {nextOffset} - {nextOffset + parseInt(limit, 10)}
                </Link>
              </li>
            }
          </ul>
        </nav>
      </div>
    );
  }
}

export default Pagination;
