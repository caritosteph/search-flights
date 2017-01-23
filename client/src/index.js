import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min';
import '../../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import './assets/styles/main.css';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import moment from 'moment';

$('#travel-date input').datepicker({
    format: 'yyyy-mm-dd',
    startDate: 'today',
    autoclose: true,
    todayHighlight: true
});

$('#search-flight').submit(function(e){
  e.preventDefault();
  $('#loading').show();
  $('#tabs').empty();
  $('#flights').empty();
  $('html,body').animate({
    scrollTop: $("#tab-flights").offset().top},
  'slow');
  let from = $('input[name=from]').val();
  let to  = $('input[name=to]').val();
  let date = $('input[name=date]').val();
  let locations = [from,to];
  clean_form();
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
      class: 'col-md-4 list-flights',
      id: airline.airline_code
    }).append($('<div/>',{
      class: 'list-header'
    }).text(airline.flights[0].airline.name)));

    forEach(airline.flights, (flight) => {
      $('#'+flight.airline.code)
      .append($('<div/>',{
        class: 'list-body'
      }).append($('<div/>',{
        class: 'col-md-6'
      }).append($('<p/>').text('Flight Number: '+flight.flightNum))
        .append($('<p/>').text(moment.parseZone(flight.start.dateTime).format('hh:mm a')+' - '+moment.parseZone(flight.finish.dateTime).format('hh:mm a')))
        .append($('<p/>').text(flight.start.cityName+' - '+flight.finish.cityName)))
      .append($('<div/>',{
        class: 'col-md-6'
      }).append($('<p/>').text(flight.plane.shortName))
        .append($('<p/>').text('Flight Time: '+min_to_hours(flight.durationMin)))
        .append($('<p/>').text('Price: $AUD '+flight.price))));
    });
  });
}

function min_to_hours(duration){
  let hours = Math.floor(duration/60);
  let minutes = duration%60;
  return hours+'h '+minutes+'m';
}
function clean_form(){
  $('#search-flight').trigger("reset");
}
