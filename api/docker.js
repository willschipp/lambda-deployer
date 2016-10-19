var express = require('express');
var router = express.Router();

var Docker = require('dockerode');
var fs = require('fs');
// var btoa = require('btoa');
var atob = require('atob');
// var targz = require('tar.gz');
// var tar = new targz({},{fromBase:true,});
var tar = require('tar');
var fstream = require('fstream');
// var tar = new targz();

var docker = new Docker({
  host:'172.16.217.132',
  port:'12375'
});

var DockerfileTemplate = 'FROM iron/node:dev\n LABEL FaaS=true\n WORKDIR /app\n ADD . /app\n RUN npm install express body-parser %%\n EXPOSE 3000\nENTRYPOINT ["node","index.js"]';
var functionJs = 'var exports = module.exports = {}; exports.execute = function(req) { return new Promise(function(fulfill,reject) { fulfill(%%(req.body)); }); }'
var codeJs = 'var router = require("express").Router(); var func = require("./function"); router.post("/",function(req,res) { func.execute(req).then(function(resp) { return res.send(resp); },function(err) { console.log(err); return res.sendStatus(500); }); }); module.exports = router;';
var indexJs = 'var express = require("express"); var app = express(); app.use(require("body-parser").json()); app.use("/",require("./code")); app.listen(3000,function() { console.log("running"); }); ';


router.get('/list',function(req,res) {
  docker.listImages(function(err,resp) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }//end if
    return res.send(resp);
  });
});

router.get('/containers',function(req,res) {
  docker.listContainers({'all':true},function(err,resp) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }//end if
    return res.send(resp);
  });
});

router.post('/container/:id/start',function(req,res) {
  var container = docker.getContainer(req.params.id);
  container.start(function(err,data) {
    console.log(data);
    return res.sendStatus(200);
  });
});

router.put('/container/:id/stop',function(req,res) {
  var container = docker.getContainer(req.params.id);
  container.stop(function(err,data) {
    console.log(data);
    return res.sendStatus(200);
  });
});

router.put('/container/:id/start',function(req,res) {
  var container = docker.getContainer(req.params.id);
  container.stop(function(err,data) {
    console.log(data);
    return res.sendStatus(200);
  });
});

router.delete('/container/:id',function(req,res) {
  var container = docker.getContainer(req.params.id);
  //get the image name
  container.remove(function(err,data) {
    console.log(data);
    return res.sendStatus(200);
  });
});


router.delete('/image/:id',function(req,res) {
  var image = docker.getImage(req.params.id);
  //destroy
  image.remove(function(err,data) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }//end if
    return res.sendStatus(200);
  });
});

router.post('/container',function(req,res) {
  //build a simple container and run it
  // docker.createContainer({Image:req.body.appName,name:req.body.appName,ExposedPorts:{"3000":{}},Hostname:req.body.appName + '.weave.local'},function(err,container) {
  docker.createContainer({Image:req.body.appName,name:req.body.appName,Labels:{"FaaS":"true"}},function(err,container) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }//end if
    //continue
    container.start(function(err,data) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }//end if
      console.log(data);
      return res.sendStatus(200);
    });
  });
});

router.post('/build',function(req,res) {
  //components of the build
  //- the script (as a string)
  //- the installation routines
  //- compose the docker file
  //- create the tar
  //- submit
  //- start it

  //setup the directory
  var directory = __dirname + '/../tmp/' + req.body.appName + '/';
  //check
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  //write the Dockerfile
  var dockerFile = DockerfileTemplate.replace("%%",req.body.packages);
  fs.writeFile(directory + 'Dockerfile',dockerFile,function(err) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }//end if
    //now write out the code
    var functionText = buildFunctionJs(req.body.function);
    fs.writeFile(directory + 'function.js',functionText,function(err) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }//end if
      //now add the additional index and code js
      fs.writeFile(directory + 'index.js',indexJs,function(err) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }//end if
        fs.writeFile(directory + 'code.js',codeJs,function(err) {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }//end if
          //now tar it up
          var write = fs.createWriteStream('/tmp/' + req.body.appName + '.tar');
          var packer = tar.Pack({fromBase:true}).on('end',function() {
            //now submit the file to dockerode to build
            docker.buildImage('/tmp/' + req.body.appName + '.tar',{t:req.body.appName,labels:"faas"},function(err,resp){
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              }//end if
              return res.sendStatus(201);
            });
          });

          fstream.Reader({path:directory,type:'Directory'})
          .pipe(packer)
          .pipe(write);
        });
      });
    });
  });

});


function buildFunctionJs(rawFunction) {
  //decode content from base64
  var decodedFunction = atob(rawFunction);
  //extract the function name
  var funcName = decodedFunction.substring(decodedFunction.indexOf(' '),decodedFunction.indexOf('('));
  //substitute
  var functionText = functionJs.replace('%%',funcName);
  //append and return
  return decodedFunction + '\n' + functionText;
}



module.exports = router;

/*

  //create a read stream from the source directory
  // //write it to a temp location
  var write = fs.createWriteStream('/tmp/test-app.tar');
  // //create
  // read.pipe(write);
  var packer = tar.Pack({fromBase:true}).on('end',function() {
    //now submit the file to dockerode to build
    docker.buildImage('/tmp/test-app.tar',{t:req.body.appName},function(err,resp){
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }//end if
      return res.sendStatus(201);
    });
  });

  fstream.Reader({path:'/tmp/test-app',type:'Directory'})
  .pipe(packer)
  .pipe(write);
*/
