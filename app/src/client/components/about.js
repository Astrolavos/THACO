import React from 'react';

const About = () =>
  <div>
    <h1>General description of the project</h1>
    <h2>Motivation</h2>
    <p>
      {`
      Current best practice in network threat analysis dictates tiers of threat analysts to respond to alerts, where additional context outside of the detection system is used to validate a security event. 
      Fundamental to this is “collecting data and context” and “correlating data from various sources”.
      To address these requirements, threat analysts rely on myriad data sources such as WHOIS records, DNS-based datasets, 
      firewall and proxy logs, and many public and private tools and websites that provide historical and current network state information. `}
    </p>

    <p>
      {`Aiming at supporting both threat analysts' awareness around threat events and threat hunting, we provide an open source threat console that leverages
        active DNS datasets enriched with public DNS-based public block lists such as `}
      <a href="https://www.hosts-file.net/">hphosts</a>,{' '}
      sagadc,{' '}
      <a href="https://www.malwaredomainlist.com/mdl.php">malwaredomainlist</a>,{' '}
      itmate,{' '}
      driveby,{' '}
      <a href="http://malc0de.com/bl/">malc0de</a>,{' '}
      <a href="https://www.abuse.ch/">abuse.ch</a> and{' '}
      <a href="https://isc.sans.edu/sources.html">sans</a>
      {`.`}
    </p>
   <p>
      {` The video below provides a simple introduction to the use of the open source threat console which demonstrates how it can help with network threat analysis.`}
    </p>

   <div id="video">
      <iframe width="420" height="315"
        src="https://player.vimeo.com/video/194907741">
      </iframe>
    </div>
  
    <h2>Visualization approach</h2>
    <p>
      {`We provide an interactive, multi-perspective, zoomable treemap that represents all
        remote IPv4 addresses seen during a day-capture period with a time window of a week of
        active DNS datasets. Particularly, three main different grouping options are provided
        by our treemap: (a) geographical location; (b) IP address; and (c ) Autonomous Systems.
        Treemaps are a form of space-filling layout where the area of each rectangle/cell is
        proportional to its value. By default, the size of each rectangle is proportional to
        the total number of domain names pointing out to a specific IP address grouping; and
        the color represents the percentage the number of blacklisted domain names under that
        grouping. However, this treemap also provides an adjustable panel located at the top-left
        of the user interface in order to allow the user to set up different visual encodings.`}
    </p>


    <h3>Data Sources</h3>
    It is important to note that this open source threat console does automatic enrichment based on these data feeds.
    <ol>
      <li>
        <a href="https://www.virustotal.com">
          Virus Total
        </a>
      </li>
      <li>
        <a  href="https://www.threatminer.org/about.php">
          ThreatMiner
        </a>
      </li>
      <li>
        <a  href="https://www.threatcrowd.org/">
          ThreatCrowd
        </a>
      </li>
      <li>
        <a  href="https://www.domaintools.com/">
          DomainTools
        </a>
      </li>
    </ol>

  </div>;

export default About;
