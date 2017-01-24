import request from 'request';
import map from 'lodash/map';
import {BASE_URL} from './constants';


class LocomoteAPIRequester {

  static airlines(){
    return new Promise ((resolve,reject) => {
      request.get({baseUrl:BASE_URL, url:'/airlines'}, function(error, response, body){
        if(!error && response.statusCode == 200){
          resolve(JSON.parse(body));
        }else{
          reject(body);
        }
      });
    });
  }

  static airports(city){
    return new Promise((resolve,reject) => {
      request.get({baseUrl:BASE_URL, url:'/airports', qs:{q:city}},function(error,response,body){
        if(!error && response.statusCode == 200){
          let data = JSON.parse(body);
          if(data.length>0){
            resolve(JSON.parse(body));
          }else{
            reject('No airport found in '+city);
          }
        }else{
          reject(body);
        }
      });
    });
  }

  static search(query){
    let self = this;
    return new Promise((resolve,reject) => {
      let airlines = self.airlines();
      airlines
      .then(airlines => {
        let requests = map(airlines,function(value){
              return new Promise((resolve)=>{
                let airline_code = value.code;
                resolve(self.flight_search(airline_code,query));
              });
          });
        Promise.all(requests)
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  static flight_search(airline_code,query){
     return new Promise((resolve,reject) => {
      request.get({baseUrl:BASE_URL, url:'/flight_search/' + airline_code, qs:query},function(error, response, body){
        if(!error && response.statusCode == 200){
          let data = JSON.parse(body);
          resolve({airline_code:airline_code,flights:data});
        }else{
          reject(body);
        }
     });
    });
  }
}

export default LocomoteAPIRequester;
