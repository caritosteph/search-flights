import express from 'express';
import request from 'request'; // http calls

const app =  express();
const base_url = 'http://node.locomote.com/code-task';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/airlines',function(req,res){
  request.get({baseUrl:base_url, url:'/airlines'}, function(error, response, body){
    if(!error && response.statusCode == 200){
      res.send(JSON.parse(body));
    }
  });
});

app.get('/airports', function(req,res){
    let q = req.query.q;
    request.get({baseUrl:base_url, url:'/airports', qs:{q:q}},function(error,response,body){
      if(!error && response.statusCode == 200){
        res.send(JSON.parse(body));
      }
    });
});

app.listen(3002);
