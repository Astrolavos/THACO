import request from 'request';
import { isIp } from './utils';



export function resolutions(req, res) {

  var url="https://www.threatcrowd.org/searchApi/v2/ip/report/?ip=" + req.params.ip;

  request.get(url, (err, msg, response) => {
    if (err) {
      res.status(400).send({ errors: [err.message || err] });
      return;
    }
    if (msg.statusCode === 200) {
      var json_response=JSON.parse(response);
      res.send({
        resolutions: json_response.resolutions,
        permalink:json_response.permalink,
        response_code:json_response.response_code,
        votes:json_response.votes

       
      });
    } else {
      res.status(400).send({ errors: [msg] });
    }

  });
}
