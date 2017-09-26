import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Treemap from './treemap';
import { ACTIONS, SQUARE_SIZE, SQUARE_COLOR } from '../../constants';
import { push } from 'react-router-redux';
import Refresh from '../refresh';
import Settings from './settings';
import Datepicker from './datepicker';
import Errors from '../errors';
import Domains from './domains';
import { commas } from '../../utils';
import ContinuousColorLegend from './continuous-color-legend';
import '../../styles/treemap.scss';
import '../../styles/legends.scss';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { formatDate } from '../../utils';


function getTreemapType(location) {
  if (location.pathname === '/as') return 3;
  if (location.pathname === '/geo') return 2;
  return 1;
}

function getBreadcrumb(group) {
  if (group === 0) return 0;
  if (!group) return 'Unknown';
  if (group === 'IP') {
    return (
      <span style={{ fontSize: '1.2em' }}>
        <b>IPv4 Address Space Utilization</b>
      </span>
    );
  }
  if (group === 'GEO') {
    return (
      <span style={{ fontSize: '1.2em' }}>
        <b>Geographical View</b>
      </span>
    );
  }
  if (group === 'AS') {
    return (
      <span style={{ fontSize: '1.2em' }}>
        <b>200 Most Hit Autonomous Systems</b>
      </span>
    );
  }
  return group;
}

function getLabelsTimeSlider(links,location) {

  
     var maplist = links.toArray();
     var labels = [];
  
     maplist.forEach(function(item) {
          if (getTreemapType(location) == 1) {
              if (item.toArray()[3] == 1){
                labels.push({'id':item.toArray()[1], 'date': item.toArray()[2]});
            }
          }

      });

     labels.sort(function (a, b) {
          if (a.date > b.date) {
            return 1;
          }
          if (a.date < b.date) {
            return -1;
          }
          return 0;
      });

   return labels;

}

 function assignLabelsTimeSlider(labels) {

     var object ={};

     for (var i in labels) {
       object[i] = formatDate(labels[i].date);
     } 
    
     return object;

 }

  function assignLabelsTimeSliderWithoutFormat(labels) {

     var object ={};

     for (var i in labels) {
       object[i] = labels[i].date;
     } 
    
     return object;

 }

  function getCurrentLevel(namedPath) {

    var namedPathList = namedPath.toArray();
    var pathItems = [];

    namedPathList.forEach(function(item) {
       pathItems.push({'group':item.get('group'),'id': item.get('_id')});
    });

    return pathItems;

 }



class Index extends React.PureComponent {

  static propTypes = {
    treemap: React.PropTypes.any,
    links: React.PropTypes.any,
    namedPath: React.PropTypes.instanceOf(List).isRequired,
    errors: React.PropTypes.instanceOf(List).isRequired,
    isPending: React.PropTypes.bool.isRequired,
    location: React.PropTypes.object.isRequired,
    fetchTreemap: React.PropTypes.func.isRequired,
    fetchLinks: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    legendColorStart: React.PropTypes.string.isRequired,
    legendColorEnd: React.PropTypes.string.isRequired,
    squareSize: React.PropTypes.any.isRequired,
    squareColor: React.PropTypes.any.isRequired,
    day: React.PropTypes.any,
    searchIP: React.PropTypes.func.isRequired,
  };

  constructor() {
       super();
       this.handler = this.handler.bind(this);
       this.state = {
         rangeValue:0
       }
  }


  componentDidMount() {
    this.props.fetchLinks(
      getTreemapType(this.props.location),
      this.props.location.query.id
    );

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.id !== nextProps.location.query.id ||
        this.props.location.pathname !== nextProps.location.pathname )

    {

      if (!nextProps.location.query.id) {
        const links = this.props.links
          .filter(link => link.get('type') === getTreemapType(nextProps.location))
          .sort((a, b) => a.day - b.day);
        this.props.fetchTreemap(links.last().get('topId'));
      } else {
        this.props.fetchTreemap(nextProps.location.query.id);
      }
    }
  }

  handler = (value) => {

      const arrayLabels = getLabelsTimeSlider(this.props.links,this.props.location);
      const assignedLabels = assignLabelsTimeSliderWithoutFormat(arrayLabels);
      var currentLevel = getCurrentLevel(this.props.namedPath);
      var ip = "";


      this.setState({ rangeValue: value});

      if (currentLevel.length == 1) {this.props.fetchTreemap(arrayLabels[value].id);}

        else {

           for (var i = 1; i <= currentLevel.length-1; i++) {
                 ip = ip.concat(currentLevel[i].group) + '.' 
            }

            var pos = ip.lastIndexOf('.');
            ip = ip.substring(0,pos)
            this.props.searchIP(assignedLabels[value],ip);

        }

  }

  render() {
    const {
      treemap,
      namedPath,
      errors,
      isPending,
      fetchTreemap,
      clearErrors,
      location,
      legendColorStart,
      legendColorEnd,
      squareSize,
      squareColor,
      day,
      links,
      searchIP,

      
    } = this.props;

    const wrapperStyle = { margin: 10 };

    const labels= getLabelsTimeSlider(links,location);
    const assignedLabels = assignLabelsTimeSlider(labels);
    var {rangeValue} = this.state;


    let data = null;
    let maxBlacklistedRel = 100;
    let maxBlacklistedAbs = 1000;
    let maxDomains = 1000;


    const showRel = SQUARE_COLOR[squareColor].key === 'rel';
    let midTitle;
    let endTitle;
    let legendTitle;
    let sizeTitle;

    if (treemap) {
      maxBlacklistedRel = treemap.children.reduce((prev, cur) => {
        if (cur.get('blacklisted') / cur.get('domains') > prev) {
          return cur.get('blacklisted') / cur.get('domains');
        }
        return prev;
      }, 0);

      maxBlacklistedAbs = treemap.children.reduce((prev, cur) => {
        if (cur.get('blacklisted') > prev) return cur.get('blacklisted');
        return prev;
      }, 0);

      maxDomains = treemap.children.reduce((prev, cur) => {
        if (cur.get('domains') > prev) return cur.get('domains');
        return prev;
      }, 0);

      data = {
        title: treemap.title,
        children: treemap.children.map(item => {
          if (SQUARE_SIZE[squareSize].key === 'all') {
            item = item.set('size', item.get('domains'));
            sizeTitle = 'All domains #';
          } else if (SQUARE_SIZE[squareSize].key === 'abs') {
            item = item.set('size', item.get('blacklisted'));
            sizeTitle = 'Blacklisted #';
          } else if (SQUARE_SIZE[squareSize].key === 'rel') {
            item = item.set('size', item.get('blacklisted') / item.get('domains'));
            sizeTitle = 'Blacklisted %';
          }

          if (SQUARE_COLOR[squareColor].key === 'all') {
            midTitle = `${commas(maxDomains / 2)}`;
            endTitle = `${commas(maxDomains)}`;
            legendTitle = 'All domains #';
            item = item.set('color', item.get('domains'));
          } else if (SQUARE_COLOR[squareColor].key === 'abs') {
            midTitle = `${commas(maxBlacklistedAbs / 2)}`;
            endTitle = `${commas(maxBlacklistedAbs)}`;
            legendTitle = 'Blacklisted #';
            item = item.set('color', item.get('blacklisted'));
          } else if (SQUARE_COLOR[squareColor].key === 'rel') {
            midTitle = `${commas((maxBlacklistedRel * 50).toFixed(2))}%`;
            endTitle = `${commas((maxBlacklistedRel * 100).toFixed(2))}%`;
            legendTitle = 'Blacklisted %';
            item = item.set('color', item.get('blacklisted') / item.get('domains'));
          }
          return item;
        }).toJS(),
      };
    }

    const showDomains = (namedPath.count() === 5 && location.pathname === '/');
    return (
      <div>
        {errors.count() > 0 && <Errors errors={errors} close={clearErrors} />}
        <h2 style={{ marginTop: 0 }}>
          <Datepicker date={day} />{' '}
          <Settings
            midTitle={midTitle || '0%'}
            endTitle={endTitle || '100%'}
            showRel={showRel}
          />{' '}
          <Refresh
            isPending={isPending}
            refresh={() => location.query.id && fetchTreemap(location.query.id)}
          />
          {' '}
        
            <small style={{ fontSize: '0.45em' }}>
              <b>Usage:</b> Hover over each cell for more information.{' '}
              Click on a cell zooms in. Use the slider to visualize information over time.
            </small>

        </h2>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div>
            {namedPath.map(level =>
              <span key={level.get('_id')}>
                <Link to={`${location.pathname}?id=${level.get('_id')}`}>
                  {getBreadcrumb(level.get('group'))}
                </Link>
                {' > '}
              </span>
            )}
          </div>
          {!showDomains &&
            <div style={{ display: 'flex' }}>
              <div
                style={{ marginRight: '25px', fontSize: '13px', marginTop: '7px', color: '#555' }}
              >
                <span style={{ marginRight: '30px' }}>
                  <b>Cell size:</b> {sizeTitle}
                </span>
                <b>{legendTitle}</b>
              </div>
              <ContinuousColorLegend
                startTitle={showRel ? '0%' : '0'}
                midTitle={midTitle || '0%'}
                endTitle={endTitle || '100%'}
                startColor={legendColorStart}
                endColor={legendColorEnd}
                width={300}
                height={30}
                style={{ marginLeft: 'auto' }}
              />
            </div>
          }
        </div>
        {(!showDomains && treemap && (data.children && !!data.children.length)) && 

        <div>  
          <Treemap
            width={1150}
            height={600}
            padding={1}
            colorRange={[legendColorStart, legendColorEnd]}
            location={location}
            data={data}
          />
          
          { getTreemapType(this.props.location) == 1 &&
              <div className='slider custom-labels' style={wrapperStyle}>
          
                  <Slider
                    min = {0}
                    max={labels.length - 1}
                    labels={assignedLabels}
                    onChange= {this.handler}
                    value={rangeValue}

                   
              />
              </div> 
         }

        </div>  
        }
        {(!showDomains && (data && !data.children.length)) &&
          <h4>This section has not been implemented yet. Sorry!</h4>
        }
        {showDomains &&
          <Domains
            ip={namedPath.slice(1).map(path => path.get('group')).join('.')}
            day={day}
            location={this.props.location}
          />
        }
    );
  }

}

const mapStateToProps = state => ({
  links: state.getIn(['links', 'links']),
  treemap: state.getIn(['treemap', 'treemap']),
  day: state.getIn(['treemap', 'day']),
  namedPath: state.getIn(['treemap', 'namedPath']),
  errors: state.getIn(['treemap', 'errors']),
  isPending: state.getIn(['treemap', 'isPending']),
  legendColorStart: state.getIn(['treemap', 'legendColorStart']),
  legendColorEnd: state.getIn(['treemap', 'legendColorEnd']),
  squareSize: state.getIn(['treemap', 'squareSize']),
  squareColor: state.getIn(['treemap', 'squareColor']),
 
});

const mapDispatchToProps = dispatch => ({
  fetchTreemap: id => dispatch({ type: ACTIONS.FETCH_TREEMAP, data: { id } }),
  fetchLinks: (type, id) => dispatch({ type: ACTIONS.FETCH_LINKS, data: { type, id } }),
  clearErrors: () => dispatch({ type: ACTIONS.CLEAR_TREEMAP_ERRORS }),
  searchIP: ((day, ip) => {
    dispatch(fetch(`/go-to-ip?day=${day}&ip=${ip}`)
          .then(function(response) {
             dispatch(push(response.url));
        }));
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
