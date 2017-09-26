import request from 'request';
import { isIp } from './utils';

const apikey = process.env.VT_API_KEY ||
  'stringwithAPIKEY';

export function ipReport(req, res) {
  if (!isIp(req.params.ip)) {
    res.status(400).send({ errors: [`IP ${req.params.ip} is invalid.`] });
  }

  const options = {
    url: 'https://www.virustotal.com/vtapi/v2/ip-address/report',
    qs: {
      apikey,
      ip: req.params.ip,
    },
    json: true,
    gzip: true,
    headers: {
      'User-Agent': 'gzip, node.js requests client example',
    },
  };

  request.get(options, (err, msg, response) => {
    if (err) {
      res.status(400).send({ errors: [err.message || err] });
      return;
    }
    if (msg.statusCode === 200) {
      res.send({
        asn: response.asn,
        as_owner: response.as_owner,
        detected_communicating_samples: response.detected_communicating_samples,
      });
    } else {
      res.status(400).send({ errors: [msg] });
    }
  });
}
