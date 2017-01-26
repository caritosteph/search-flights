"use strict";

import {SERVER_URL} from '../constants/constants';

class FlightAPI {
  static search(params){
    let promise = $.ajax({
          url: SERVER_URL+'/search',
          method: 'GET',
          data: params
        });
    return promise;
  }

  static airline_code(location){
    let params = {q:location};

    let promise = $.ajax({
          url: SERVER_URL+'/airports',
          method: 'GET',
          data: params
        });
    return promise;
  }
}
 export default FlightAPI;
