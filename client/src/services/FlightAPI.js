import {SERVER_URL} from './constants/constants';

class FlightAPI {

  static search(params){
    let request = $.ajax({
          url: SERVER_URL+'/search',
          method: 'GET',
          data: params
        });
    request.done(function(response){
      if(response.success){
        let flights = response.data;
        generate_flights(flights);
      }else{
        let message = response.msg || 'Unexpected error';
        stop_loading();
        show_alert(message);
      }
    });
    return request;
  }

  static airline_code(location){

    return new Promise((resolve)=>{
      let params = {q:location};
      $.ajax({
            url: SERVER_URL+'/airports',
            method: 'GET',
            data: params
          })
      .done(function(response){
        if(response.success){
          let airports = response.data;
          resolve(airports[0].airportCode);
        }else{
            let message = response.msg;
            stop_loading();
            show_alert(message);

        }
      });
    });
  }

}
 export default FlightAPI;
