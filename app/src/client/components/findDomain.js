import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ACTIONS } from '../constants';
import { formatDate } from '../utils';
import Errors from './errors';
import { push } from 'react-router-redux';
import TimelineComponent from 'react-timeline-component';
import renderIf from 'render-if';


const getDates = links =>
  links
    .filter(link => link.get('type') === 1)
    .sort((a, b) => b.get('day') - a.get('day'));


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

function whoisToTimeline(whois) {

  const dates = [
      {
          date: whois.get('creation_date'),
          name: 'Whois record: Creation date'
      },
      {

        date:whois.get('updated_date'),
        name: 'Whois record: Updated date'

      },
      {

        date:whois.get('last_updated'),
        name: 'Whois record: Last updated'

      },
       {

        date:whois.get('expiration_date'),
        name: 'Whois record: Expiration date'

      }
  ];

  return dates;
}


class FindDomain extends React.PureComponent {


  static propTypes = {
    links: React.PropTypes.any,
    errors: React.PropTypes.instanceOf(List).isRequired,
    isPending: React.PropTypes.bool.isRequired,
    fetchJustLinks: React.PropTypes.func.isRequired,
    fetchIPs: React.PropTypes.func.isRequired,
    fetchDomainReport: React.PropTypes.func.isRequired,
    domainReport: React.PropTypes.any,
    searchIP: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired,
    clearIPs: React.PropTypes.func.isRequired,
    ips: React.PropTypes.any,

  };

  componentDidMount() {
    const { limit, offset } = getLimitAndOffset(this.props.location);

    this.props.fetchJustLinks();
   
    this.props.fetchIPs(
        this.props.location.query.day,
        this.props.location.query.domain,
        getSearch(this.props.location),
        limit,
        offset,
      );

    this.props.fetchDomainReport(this.props.location.query.domain);

  }

  componentDidUpdate(prevProps){

    const { limit, offset } = getLimitAndOffset(this.props.location);
   if (getSearch(this.props.location) !== getSearch(prevProps.location))
   {
        this.props.fetchIPs(
            this.props.location.query.day,
            this.props.location.query.domain,
            getSearch(this.props.location),
            limit,
            offset,
          );
      this.props.fetchDomainReport(this.props.location.query.domain);

   }

  }

  componentWillUnmount(){
    
    this.props.clearIPs();

  }


  render() {

      const {
      links,
      isPending,
      location,
      ips,
      domainReport,
      searchIP,
    } = this.props;


    const { limit, offset } = getLimitAndOffset(location);
    const date = location.query.day;
    console.log(domainReport.count());

    return (

      <div>
        {this.props.errors.count() > 0 &&
          <Errors errors={this.props.errors} close={this.props.clearErrors} />}
        <h1>Find Domain</h1>
        <form method='get'>
          <div className="form-group">
            <label htmlFor="day">Day</label>
            <select className="form-control" id="day" name="day" >
              {getDates(this.props.links).valueSeq().map(day =>
                <option key={day} value={day.get('day')}>{formatDate(day.get('day'))}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ip">Domain Name</label>
            <input type="text" className="form-control" id="domain" name="domain" placeholder="e.g.:yolasite.com"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
        {((this.props.ips.count() === 0) && (this.props.location.search !== '')) &&
          <p style={{ marginTop: '20px', color: 'darkred' }}>
            <strong>This domain name and day is not in our database!</strong>
          </p>
        }

        {ips.count() > 0 &&
          <div>
                <div style={{width: '100%', flex: 2, marginBottom: '10px'}}>
                    <h2>
                         {formatDate(this.props.location.query.day)}{' / '}{this.props.location.query.domain}{' '}
                    </h2>
                    
                               {domainReport.count() > 0 &&
                                  <div style={{ display: 'flex', marginTop: '10px'}}>
                                    {domainReport.map(report => 

                                           <div className="panel panel-default">
                                               <div className="panel-heading">WHOIS Information </div>
                                                <div className="panel-body">
                                                      <div style={{ flex: 2, float:'left',width: '50%'}}>
                                                          <ul> 
                                                            <li>
                                                              <strong>Registrar:</strong>
                                                               <p>{report.get('whois').get('registrar') ? report.get('whois').get('registrar') : '-'} </p>
                                                            </li> 
                                                            <li>
                                                              <strong>Registrant Info:</strong><br />
                                                               <p>{report.get('whois').get('registrant_info') ? report.get('whois').get('registrant_info') : '-'}</p>
                                                            </li> 
                                                            <li>
                                                              <strong>Whois MD5:</strong><br />
                                                             <p>{report.get('whois').get('whois_md5') ? report.get('whois').get('whois_md5') : '-'}</p>
                                                            </li>
                                                          </ul>   
                                                      </div>

                                                      <div style={{ flex: 2, float:'left',width: '50%',  marginBottom: '50px'}}>
                                                          <ul> 
                                                            <li>
                                                              <strong>Name Servers:</strong>
                                                               <p>{report.get('whois').get('nameservers') ? report.get('whois').get('nameservers') : '-'} </p>
                                                            </li> 
                                                             <li>
                                                              <strong>Whois Server:</strong><br />
                                                             <p>{report.get('whois').get('whois_server') ? report.get('whois').get('whois_server') : '-'}</p>
                                                            </li>
                                                            <li>
                                                              <strong>Admin email:</strong><br />
                                                               <p>{report.get('whois').get('emails').get('admin') ? report.get('whois').get('emails').get('admin') : '-'}</p>
                                                            </li> 
                                                          </ul>   
                                                      </div>
                                                </div>
                                                 <div style={{ display: 'flex',width: '100%'}}>
                                                  <TimelineComponent data={whoisToTimeline(report.get('whois')) }/>
                                                </div>
                                          </div>
                                  
                                         )}

                                </div>

                              }
                             

                          

                         
                </div>
                <div style={{ display: 'flex' }}> 
                      <table className="table table-condensed">
                      <thead>
                        <tr>
                          <th>rdata</th>
                          <th>Google</th>
                          <th>whois</th>
                          <th>related sources</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ips.map(ip =>

                          <tr key={ip}>
                          
                            <th>

                              <button type="submit" className="btn btn-link" onClick={e =>searchIP(date,ip)}>{ip}</button>  
                            </th>
                    
                            <th>
                              <a
                                href={`https://www.google.com/#q=${ip}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Google
                              </a>
                            </th>
                            <th>
                              <a
                                href={`http://whois.domaintools.com/${ip}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Domain Tools
                              </a>
                            </th>
                            <th>
                              <a
                                href={`https://www.threatcrowd.org/ip.php?ip=${ip}`}
                                title={`Inspect ${ip} by ThreatCrowd`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                ThreatCrowd
                              </a>/
                               <a
                                href={`https://www.threatminer.org/host.php?q=${ip}`}
                                title={`Inspect ${ip} by ThreatMiner`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                ThreatMiner
                              </a>
                            </th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
          </div>
        }
      </div>

    );
  }

}

const mapStateToProps = state => ({
  links: state.getIn(['links', 'links']),
  errors: state.getIn(['links', 'errors']),
  isPending: state.getIn(['links', 'isPending']),
  ips:state.getIn(['ips', 'ips']),
  domainReport:state.getIn(['ips', 'domainReport']),

});

const mapDispatchToProps = dispatch => ({
  fetchJustLinks: () => dispatch({ type: ACTIONS.FETCH_JUST_LINKS }),
  fetchIPs: (day, domain,search,limit, offset) =>
    dispatch({ type: ACTIONS.FETCH_IPS, data: { day,domain,search,limit, offset } }),
  fetchDomainReport: (domain) => dispatch({ type: ACTIONS.FETCH_DOMAIN_REPORT, data: {domain}}),
  searchIP: ((day, ip) => {
    dispatch(fetch(`/go-to-ip?day=${day}&ip=${ip}`)
          .then(function(response) {
             dispatch(push(response.url));
        }));
  }),
  clearErrors: () => dispatch({ type: ACTIONS.CLEAR_LINKS_ERRORS }),
  clearIPs: () => dispatch({ type: ACTIONS.CLEAR_FETCHED_IPS }),

});

export default connect(mapStateToProps, mapDispatchToProps)(FindDomain);
