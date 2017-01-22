import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min';
import '../../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import './styles/main.css';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import moment from 'moment';

$('#travel-date input').datepicker({
    format: "yyyy-mm-dd",
    clearBtn: true,
    orientation: "bottom left",
    startDate: "today"
});

$('#search-flight').submit(function(e){
  e.preventDefault();
  let from = $('input[name=from]').val();
  let to  = $('input[name=to]').val();
  let date = $('input[name=date]').val();
  let locations = [from,to];
  let request = map(locations,function(location){
        return new Promise((resolve)=> {
          resolve(get_airline_code(location));
        });
      });
  Promise.all(request).then(data=> {
    let query = {from: data[0], to: data[1], date};
    generate_tabs_nearby_dates(query);
    search_flight(query);
  });
});

function search_flight(params){
  let request = $.ajax({
        url: 'http://localhost:3000/search',
        method: 'GET',
        data: params
      });
  request.done(function(airlines){
    // cheaper_flight(data);
    // generate_tabs_nearby_dates(params);
    generate_flights(airlines);
  });
  return request;
}
function get_airline_code(location){
  return new Promise((resolve)=>{
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

function generate_tabs_nearby_dates(params){
  let generate_dates = [-2,-1,0,1,2];
  let nearby_dates = [];
  forEach(generate_dates, (value) => {
    nearby_dates.push(moment(params.date).clone().add(value, 'day').format("YYYY-MM-DD"));
  });
  forEach(nearby_dates, (date) => {
    $('#tabs').append($('<li/>',{
      id: date,
      class: 'nearby_dates'
    }).append($('<a/>',{
      href:'#flights'
    }).text(date)).data('params',params));
  });
  $('#tabs :nth-child(3)').addClass('active');
  $('.tab-content').show();
}

$('#tabs').on('click','li.nearby_dates',function(e){
  let date = e.target.innerText;
  let params = $('#'+date).data('params');
  params.date = date;
  $('#tabs li').removeClass('active');
  $('#'+date).addClass('active');
  $('#flights').empty();
  search_flight(params);
});

function generate_flights(airlines){
  $('.tab-content').show();

  forEach(airlines, (airline) => {
    $('#flights').append($('<div/>',{
      class: 'col-md-4',
      id: airline.airline_code
    }).append($('<h3/>').text(airline.flights[0].airline.name)));

    forEach(airline.flights, (flight) => {
      $('#'+flight.airline.code)
      .append($('<p/>').text(flight.flightNum))
      .append($('<p/>').text(flight.start.cityName))
      .append($('<p/>').text(flight.finish.cityName));

    });
  });

}
