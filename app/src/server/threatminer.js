import request from 'request';
import { isIp } from './utils';



export function domainReport(req, res) {

  var url="https://www.threatminer.org/domain.php?q="+ req.params.domain + "&api=True&rt=1";

  request.get(url, (err, msg, response) => {
    if (err) {
      res.status(400).send({ errors: [err.message || err] });
      return;
    }
    if (msg.statusCode === 200) {
      var json_response=JSON.parse(response);
      res.send({
        results: json_response.results,
       
      });
    } else {
      res.status(400).send({ errors: [msg] });
    }

  });

}
