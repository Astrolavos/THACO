import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import parseDomain from 'parse-domain';
import { ACTIONS } from '../../constants';
import Pagination from './pagination';
import {CSVLink, CSVDownload} from 'react-csv';

function getCount(countDomains, countNewDomains, countBlacklistedDomains, view) {
  if (view === 'all') {
    return countDomains;
  }
  if (view === 'new') {
    return countNewDomains;
  }
  return countBlacklistedDomains;
}

function getLimitAndOffset(location) {
  const limit = (location && location.query && location.query.limit) ?
    location.query.limit : 30;
  const offset = (location && location.query && location.query.offset) ?
    location.query.offset : 0;
  return { limit, offset };
}

function getSearch(location) {
  return (location && location.query && location.query.search) ?
    location.query.search : '';
}


class DomainsTable extends React.PureComponent {

  static propTypes = {
    day: React.PropTypes.number.isRequired,
    view: React.PropTypes.string.isRequired,
    ip: React.PropTypes.string.isRequired,
    fetchDomains: React.PropTypes.func.isRequired,
    fetchNew: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired,
    fetchBlacklisted: React.PropTypes.func.isRequired,
    countDomains: React.PropTypes.number.isRequired,
    countNewDomains: React.PropTypes.number.isRequired,
    countBlacklistedDomains: React.PropTypes.number.isRequired,
    isPending: React.PropTypes.bool.isRequired,
    domains: React.PropTypes.any,
    updateSearch: React.PropTypes.func.isRequired,
    searchDomain: React.PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { limit, offset } = getLimitAndOffset(this.props.location);
    if (this.props.view === 'all') {
      this.props.fetchDomains(
        this.props.day,
        this.props.ip,
        getSearch(this.props.location),
        limit,
        offset,
      );
    }
    if (this.props.view === 'blacklisted') {
      this.props.fetchBlacklisted(
        this.props.day,
        this.props.ip,
        getSearch(this.props.location),
        limit,
        offset,
      );
    }
    if (this.props.view === 'new') {
      this.props.fetchNew(
        this.props.day,
        this.props.ip,
        getSearch(this.props.location),
        limit,
        offset,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { limit, offset } = getLimitAndOffset(this.props.location);
    const prevPag = getLimitAndOffset(prevProps.location);

    if (this.props.view !== prevProps.view ||
        this.props.day !== prevProps.day ||
        offset !== prevPag.offset ||
        limit !== prevPag.limit ||
        getSearch(this.props.location) !== getSearch(prevProps.location) ||
        this.props.ip !== prevProps.ip) {
      if (this.props.view === 'all') {
        this.props.fetchDomains(
          this.props.day,
          this.props.ip,
          getSearch(this.props.location),
          limit,
          offset,
        );
      }
      if (this.props.view === 'blacklisted') {
        this.props.fetchBlacklisted(
          this.props.day,
          this.props.ip,
          getSearch(this.props.location),
          limit,
          offset,
        );
      }
      if (this.props.view === 'new') {
        this.props.fetchNew(
          this.props.day,
          this.props.ip,
          getSearch(this.props.location),
          limit,
          offset,
        );
      }
    }
  }

  render() {
    const {
      isPending,
      domains,
      view,
      location,
      countDomains,
      countNewDomains,
      countBlacklistedDomains,
      updateSearch,
      day,
      ip,
      searchDomain,
    } = this.props;

    const { limit, offset } = getLimitAndOffset(location);
    const csvData = JSON.stringify(domains);
    const label = "Download " + view + " domains " + "(CSV format) "; 
    const _filename = view + "_" + "domains" + day;

    return (
   
      <div>
        <input
          type="text"
          style={{ marginTop: '5px' }}
          className="form-control"
          placeholder="Filter domains"
          value={getSearch(location)}
          onChange={e =>
            updateSearch(day, ip, location.pathname, location.query.id, view, e.target.value)
          }
        />
        {!!domains.count() &&
          <Pagination
            count={getCount(countDomains, countNewDomains, countBlacklistedDomains, view)}
            offset={offset}
            limit={limit}
            search={getSearch(location)}
            pathname={location.pathname}
            id={location.query.id}
            view={view}
          />
        }
        <div style={{float:'right',marginBottom: '5px', marginTop: '10px'}}>
            <CSVLink data={csvData} filename={_filename} >{label}<span className="glyphicon glyphicon-download" aria-hidden="true"></span>
            </CSVLink>
        </div>  
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>qname</th>
              <th>search</th>
              <th>whois</th>
              <th>scan</th>
              <th>visualize</th>
              <th>related sources</th>

              <th>2LD</th>
              <th>TLD</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain =>
              <tr key={domain}>
                <th scope="row">
                  <button type="submit" className="btn btn-link" onClick={e =>searchDomain(day,domain)}>{domain}</button> 
                </th>
                <th>
                  <a
                    href={`https://www.google.com/#q=${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google
                  </a>
                </th>
                <th>
                  <a
                    href={`http://whois.domaintools.com/${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Domain Tools
                  </a>
                </th>
                <th>
                  <a
                    href={`https://www.virustotal.com/en/url/submission/?force=1&url=http://${domain}`}
                    title={`Inspect ${domain} by Virus Total`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VirusTotal
                  </a>
                </th>
                <th>
                  <a
                    href={`https://www.threatcrowd.org/domain.php?domain=${domain}`}
                    title={`Inspect ${domain} by ThreatCrowd`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ThreatCrowd
                  </a>
                </th>
                <th>
                  <a
                    href={`https://www.threatminer.org/domain.php?q=${domain}`}
                    title={`Inspect ${domain} by ThreatMiner`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ThreatMiner
                  </a>
                </th>
                <th>
                  {parseDomain(domain) ? parseDomain(domain).domain : '?'}
                </th>
                <th>
                  {parseDomain(domain) ? parseDomain(domain).tld : '?'}
                </th>
              </tr>
            )}
          </tbody>
        </table>
        {(!domains.count() && !isPending) && <p>No domains availabe.</p>}
        {!!domains.count() &&
          <Pagination
            count={getCount(countDomains, countNewDomains, countBlacklistedDomains, view)}
            offset={offset}
            limit={limit}
            search={getSearch(location)}
            pathname={location.pathname}
            id={location.query.id}
            view={view}
          />
        }
      </div>
    );
  }
}


const mapStateToProps = state => ({
  domains: state.getIn(['domains', 'domains']),
  geo: state.getIn(['domains', 'geo']),
  countDomains: state.getIn(['domains', 'countDomains']),
  countNewDomains: state.getIn(['domains', 'countNewDomains']),
  countBlacklistedDomains: state.getIn(['domains', 'countBlacklistedDomains']),
  day: state.getIn(['treemap', 'day']),
  namedPath: state.getIn(['treemap', 'namedPath']),
  errors: state.getIn(['domains', 'errors']),
  isPending: state.getIn(['domains', 'isPending']),
});

const mapDispatchToProps = dispatch => ({
  fetchDomains: (day, ip, search, limit, offset) =>
    dispatch({ type: ACTIONS.FETCH_DOMAINS, data: { day, ip, search, limit, offset } }),
  fetchNew: (day, ip, search, limit, offset) =>
    dispatch({ type: ACTIONS.FETCH_NEW_DOMAINS, data: { day, ip, search, limit, offset } }),
  fetchBlacklisted: (day, ip, search, limit, offset) =>
    dispatch({ type: ACTIONS.FETCH_BLACKLISTED_DOMAINS, data: { day, ip, search, limit, offset } }),
  clearErrors: () => dispatch({ type: ACTIONS.CLEAR_DOMAINS_ERRORS }),
  updateSearch: ((day, ip, pathname, id, view, search) => {
    dispatch(push(`${pathname}?id=${id}&view=${view}&limit=30&search=${search}`));
    dispatch({ type: ACTIONS.FETCH_INFO, data: { day, ip, search } });
  }),
   searchDomain: ((day, domain) => {
    dispatch(push(`/find-domain?day=${day}&domain=${domain}`));
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainsTable);
