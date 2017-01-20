import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import './styles/main.css';
import map from 'lodash/map';

$('#travel-date input').datepicker({
    format: "yyyy-mm-dd",
    clearBtn: true,
    orientation: "bottom left",
    keyboardNavigation: false,
    forceParse: false
});

$('#search-flight').submit(function(e){
  e.preventDefault();
  let from = $('input[name=from]').val();
  let to  = $('input[name=to]').val();
  let date = $('input[name=date]').val();
  let locations = [from,to];
  let request = map(locations,function(location){
        return new Promise((resolve)=> {
          resolve(get_airline_code(location))
        });
      });
  Promise.all(request).then(data=> {
    let query = {from: data[0], to: data[1], date};
    console.log("query: ",query);
    search_flight(query);
  });
});

function search_flight(params){
  let request = $.ajax({
        url: 'http://localhost:3000/search',
        method: 'GET',
        data: params
      });
  request.done(function(data){
    console.log("data: ",data);
  });
}
function get_airline_code(location){
  return new Promise((resolve,reject)=>{
    let params = {q:location};
    $.ajax({
          url: 'http://localhost:3000/airports',
          method: 'GET',
          data: params
        })
    .done(function(data){
      resolve(data[0].airportCode);
    });
  });
}
