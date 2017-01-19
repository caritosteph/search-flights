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

app.get('/flight_search/:airline_code', function(req,res){
    let airline_code = req.params.airline_code;
    let date = req.query.date;
    let from = req.query.from;
    let to = req.query.to;
    let query = {date:date, from:from, to:to};
    request.get({baseUrl:base_url, url:'/flight_search/'+airline_code, qs:query},function(error,response,body){
      if(!error && response.statusCode == 200){
        res.send(JSON.parse(body));
      }
    });
});

app.listen(3002);
