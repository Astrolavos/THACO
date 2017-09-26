import React from 'react';
import { Immutable,List, toArray, toIndexedSeq} from 'immutable';
import { Link } from 'react-router';
import GoogleMap from 'google-map-react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { ACTIONS } from '../../constants';
import Refresh from '../refresh';
import Errors from '../errors';
import Marker from './marker';
import DomainsTable from './domainsTable';
import MalwareTable from './malwareTable';
import renderIf from 'render-if';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


function getSearch(location) {
  return (location && location.query && location.query.search) ?
    location.query.search : '';
}

class Domains extends React.PureComponent {


   
  static propTypes = {
    domains: React.PropTypes.any,
    blacklisted: React.PropTypes.any,
    location: React.PropTypes.object,
    ipReport: React.PropTypes.object,
    resolutions: React.PropTypes.object,
    fetchResolutions:React.PropTypes.func.isRequired,
    geo: React.PropTypes.any,
    day: React.PropTypes.number.isRequired,
    ip: React.PropTypes.string.isRequired,
    errors: React.PropTypes.instanceOf(List).isRequired,
    isPending: React.PropTypes.bool.isRequired,
    fetchInfo: React.PropTypes.func.isRequired,
    fetchIpReport: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    countDomains: React.PropTypes.number.isRequired,
    countBlacklistedDomains: React.PropTypes.number.isRequired,
    countNewDomains: React.PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.props.fetchInfo(
      this.props.day,
      this.props.ip,
      getSearch(this.props.location),
    );
    this.props.fetchIpReport(
      this.props.ip,
    );
   
    this.props.fetchResolutions(
      this.props.ip,
    );
 
  }

  render() {
    const {
      errors,
      isPending,
      day,
      ip,
      clearErrors,
      geo,
      location,
      countDomains,
      countNewDomains,
      fetchInfo,
      countBlacklistedDomains,
      ipReport,
      resolutions,
    } = this.props;


    const lat = (geo && geo.get('ll')) ? geo.get('ll').first() : 0;
    const lng = (geo && geo.get('ll')) ? geo.get('ll').last() : 0;
    const view = (location && location.query && location.query.view) ?
      location.query.view : 'all';
    const id = (location && location.query && location.query.id) ?
      location.query.id : '';
    const pathname = (location && location.pathname) ?
      location.pathname : '';
    const search = getSearch(location);

    const malwareCount = ipReport.get('detected_communicating_samples') ? ipReport.get('detected_communicating_samples').count() : 0;
    const dataDomains = [
      {name: 'Summary', blacklisted: countBlacklistedDomains, new: countNewDomains, malware: malwareCount},
     
    ];

       return (
      <div>
        {errors.count() > 0 && <Errors errors={errors} close={clearErrors} />}
        <h2>
          {ip}{' '}
          <Refresh
            isPending={isPending}
            refresh={() => fetchInfo(day, ip, search)}
          />
        </h2>
        <div style={{ display: 'flex', marginBottom: '20px'}}>
          <div style={{ height: '320px', width: '100%', flex: 2 }}>
            {lat ? <GoogleMap
              center={{ lat, lng }}
              zoom={4}
            >
              <Marker lat={lat} lng={lng} text={'✖'} />
            </GoogleMap> : 'No geo information.'}
          </div>
          <div style={{ flex: 1, paddingLeft: '20px' }}>
            <p>
              <strong>AS Owner:</strong><br />
              {ipReport.get('as_owner') ? ipReport.get('as_owner') : '-'}
            </p>
            <p>
              <strong>ASN:</strong><br />
              {ipReport.get('asn') ? ipReport.get('asn') : '-'}
            </p>
            <p>
              <strong>City:</strong><br />
              {(geo && geo.get('city')) ? geo.get('city') : '-'}
            </p>
            <p>
              <strong>State/Region:</strong><br />
              {(geo && geo.get('region')) ? geo.get('region') : '-'}
            </p>
            <p>
              <strong>Country:</strong><br />
              {(geo && geo.get('country')) ? geo.get('country') : '-'}
            </p>
            <p>
              <strong>Latitude, Longtitude:</strong><br />
              <a href={`http://www.google.com/maps/place/${lat},${lng}`}>
                {lat}, {lng}
              </a>
            </p>
             <p>
              {renderIf(resolutions.get('response_code')!=0)
              (
                  <strong>Votes in 
                  <a
                    href={`https://www.threatcrowd.org/ip.php?ip=${ip}`}
                    title={`Inspect ${ip} by ThreatCrowd`}
                    target="_blank"
                    rel="noopener noreferrer"
                  > ThreatCrowd: </a>
                  {resolutions.get('votes')}</strong>
               )}
              
              
            </p>
          </div>
        </div>

        <div> 
              <BarChart width={500} height={150} data={dataDomains} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <XAxis dataKey="name"/>
                  <YAxis/>
                 <CartesianGrid strokeDasharray="3 3"/>
                 <Tooltip/>
                 <Legend />
                 
                   <Bar dataKey="blacklisted" fill="#e74c3c" />
                   <Bar dataKey="new" fill="#7f8c8d" />
                   <Bar dataKey="malware" fill="#96281B" />
               </BarChart>

        </div>
     

        <ul className="nav nav-tabs" style={{marginTop: '20px'}}>
          <li role="presentation" className={cx({ active: view === 'all' })}>
            <Link to={`${pathname}?id=${id}&search=${search}`}>
              All domains ({countDomains})
            </Link>
          </li>
          <li role="presentation" className={cx({ active: view === 'blacklisted' })}>
            <Link to={`${pathname}?id=${id}&view=blacklisted&search=${search}`}>
              Blacklisted domains ({countBlacklistedDomains})
            </Link>
          </li>
          <li role="presentation" className={cx({ active: view === 'new' })}>
            <Link to={`${pathname}?id=${id}&view=new&search=${search}`}>
              New domains since previous day ({countNewDomains})
            </Link>
          </li>
          <li role="presentation" className={cx({ active: view === 'malware' })}>
            <Link to={`${pathname}?id=${id}&view=malware`}>
              Malware detected ({ipReport.get('detected_communicating_samples') ?
                ipReport.get('detected_communicating_samples').count() : 0})
            </Link>
          </li>
        </ul>
        {view === 'malware' ?
          <MalwareTable
            samples={ipReport.get('detected_communicating_samples')}
            isPending={isPending}
          /> :
            <DomainsTable
              view={view}
              day={day}
              ip={ip}
              location={location}
              countAllDomains={countDomains}
              countBlacklistedDomains={countBlacklistedDomains}
            />
        }
      </div>
    );
  }

}

const mapStateToProps = state => ({
  geo: state.getIn(['domains', 'geo']),
  countDomains: state.getIn(['domains', 'countDomains']),
  countBlacklistedDomains: state.getIn(['domains', 'countBlacklistedDomains']),
  countNewDomains: state.getIn(['domains', 'countNewDomains']),
  day: state.getIn(['treemap', 'day']),
  ipReport: state.getIn(['domains', 'ipReport']),
  resolutions: state.getIn(['domains','resolutions']),
  namedPath: state.getIn(['treemap', 'namedPath']),
  errors: state.getIn(['domains', 'errors']),
  isPending: state.getIn(['domains', 'isPending']),
});

const mapDispatchToProps = dispatch => ({
  fetchInfo: (day, ip, search) =>
    dispatch({ type: ACTIONS.FETCH_INFO, data: { day, ip, search } }),
  fetchIpReport: (ip) =>
    dispatch({ type: ACTIONS.FETCH_IP_REPORT, data: { ip } }),
  fetchResolutions: (ip) =>
    dispatch({ type: ACTIONS.FETCH_RESOLUTIONS, data: { ip } }),  
  clearErrors: () => dispatch({ type: ACTIONS.CLEAR_DOMAINS_ERRORS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Domains);
