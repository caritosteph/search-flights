import express from 'express';
import request from 'request'; // http calls

const app =  express();
const base_url = 'http://node.locomote.com/code-task/';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/airlines',function(req,res){
  request.get(base_url+'airlines', function(error, response, body){
    if(!error && response.statusCode == 200){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.parse(body));
    }
  });
});

app.listen(3001);
