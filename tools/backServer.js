import express from 'express';
import request from 'request'; // http calls
import map from 'lodash/map';

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
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.parse(body));
    }
  });
});

app.get('/airports', function(req,res){
    let q = req.query.q;
    request.get({baseUrl:base_url, url:'/airports', qs:{q:q}},function(error,response,body){
      if(!error && response.statusCode == 200){
        res.send(JSON.parse(body));
      }else{
        res.send(error);
      }
    });
});

app.get('/search', function(req,res){
  let from = req.query.from;
  let to = req.query.to;
  let date = req.query.date;
  let query = {from,to,date};
  console.log("query: ",query);
  request.get({baseUrl:base_url, url:'/airlines'}, function(error, response, body){
    if(!error && response.statusCode == 200){
      let airlines = JSON.parse(body);
      let requests = map(airlines,function(value){
            return new Promise((resolve)=>{
              let airline_code = value.code;
              resolve(flight_per_airlines(airline_code,query));
            });
        });
      Promise.all(requests).then((data) => res.send(data));
    }else{
      res.send(error);
    }
  });

});

const flight_per_airlines = function(airline_code,query){
   return new Promise((resolve,reject) => {
    request.get({baseUrl:base_url, url:'/flight_search/'+airline_code, qs:query},function(error, response, body){
      if(!error && response.statusCode == 200){
        let data = JSON.parse(body);
        resolve({airline_code:airline_code,flights:data});
      }else{
        reject(error)
      }
   })
  });
};

app.listen(3000);
