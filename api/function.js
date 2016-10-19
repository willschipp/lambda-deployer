var router = require('express').Router();
var unirest = require('unirest');
var Docker = require('dockerode');

var docker = new Docker({
  host:'172.16.217.132',
  port:'12375'
});


var urlTemplate = 'http://172.16.217.132/?functionName=';

router.post('/',function(req,res) {
  //create the url
  var invokeUrl = urlTemplate + req.query.functionName;
  unirest.post(urlTemplate + req.query.functionName).send().end(function(response) {
    if (response.status == undefined || response.status == 500) {
      //init the container --> get the image fro the
      docker.listContainers({'all':true},function(err,containers) {
        containers.forEach(function(containerInfo) {
          var containerName = containerInfo.Names[0].substring(1);
          if (containerName == req.query.functionName) {
            //this is the one --> start it
            docker.getContainer(containerInfo.Id).start(function(err,data) {
              //wait 5 seconds and hit it again --> arbitrary five minues
              setTimeout(function() {
                unirest.post(urlTemplate + req.query.functionName).send().end(function(resp) {
                  // return res.send(resp.body);
                  res.send(resp.body);
                  //shutdown the container
                  docker.getContainer(containerInfo.Id).stop(function(err,data) {
                    return;
                  });
                });
              },3000);
            });
          }//end if
        });
      });
    } else {
      return res.send(response.body);
    }//end if
  });
});

module.exports = router;
