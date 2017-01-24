
/* eslint-disable no-console */
import express from 'express';
import API from './LocomoteAPIRequester';
import Utils from './Utils';
import {PORT} from './constants';

const app =  express();
const api = new API();
const utils = new Utils();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/airlines',function(req,res){
    api.airlines()
    .then(data => {
      utils.send_data(res,true,data);
    })
    .catch(error => {
      utils.send_data(res,false,error);
    });
});

app.get('/airports', function(req,res){
    let city = req.query.q;

    api.airports(city)
    .then(data => {
      utils.send_data(res,true,data);
    })
    .catch(error => {
      utils.send_data(res,false,error);
    });
});

app.get('/search', function(req,res){
  let from = req.query.from;
  let to = req.query.to;
  let date = req.query.date;
  let query = {from,to,date};

  api.search(query)
  .then(data => {
    utils.send_data(res,true,data);
  })
  .catch(error => {
    utils.send_data(res,false,error);
  });
});

app.listen(PORT,function(){
 console.log("Server listening at port ",PORT);
});
