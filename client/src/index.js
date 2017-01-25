import './assets/styles/main.css';

import '../../node_modules/bootstrap/dist/js/bootstrap.min';
import '../../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import moment from 'moment';

$('#travel-date input').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true
});

$('#nav-search').click(function(){
  clean_form();
  $('#search').show();
  $('#tabs').empty();
  $('#flights').empty();
  $('#airline-title').hide();
  $('#search-again').remove();
});

$('#search-flight').submit(function(e){
  e.preventDefault();
  $('#tabs').empty();
  $('#flights').empty();
  loading();
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
    $('#tabs li.active').off('click');
    search_flight(query);
  });
});

function search_flight(params){
  let request = $.ajax({
        url: 'http://localhost:3000/search',
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
function get_airline_code(location){

  return new Promise((resolve)=>{
    let params = {q:location};
    $.ajax({
          url: 'http://localhost:3000/airports',
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

$('#tabs').on('click','li.nearby_dates:not(.active)',function(e){
  loading();
  let date = e.target.innerText;
  let params = $('#'+date).data('params');
  params.date = date;
  $('#tabs li').removeClass('active');
  $('#'+date).addClass('active');
  $('#flights').empty();
  $('#search-again').remove();
  $('#search').hide();
  search_flight(params);
});

function generate_flights(airlines){
  clean_form();
  navbar_search();
  $('#search').hide();
  stop_loading();
  $('#tabs').show();
  $('.tab-content').show();
  $('#airline-title').show();
  cities_duration(airlines);

  forEach(airlines, (airline) => {
    $('#flights').append($('<div/>',{
      class: 'col-md-4 col-sm-6 list-flights',
      id: airline.airline_code
    }).append($('<div/>',{
      class: 'list-header'
    }).text(airline.flights[0].airline.name)));

    forEach(airline.flights, (flight) => {
      $('#'+flight.airline.code)
      .append($('<div/>',{
        class: 'list-body'
      }).append($('<div/>',{
        class: 'col-md-6 col-xs-6'
      }).append($('<p/>').text('Flight Number: '+flight.flightNum))
        .append($('<p/>').text(moment.parseZone(flight.start.dateTime).format('hh:mm a')+' - '+moment.parseZone(flight.finish.dateTime).format('hh:mm a'))))
        .append($('<div/>',{
          class: 'col-md-6 col-xs-6'
        })
        .append($('<p/>').text(flight.plane.shortName))
        .append($('<p/>').text('Price: $AUD '+flight.price))));
    });
  });

}

function loading(){
  $('#redoverlay').show();
  $('#loading').show();
}
function stop_loading(){
  $('#redoverlay').hide();
  $('#loading').hide();
}
function navbar_search(){
  $('#nav-search').append($('<li/>',{
    class: 'active',
    id: 'search-again'
  }).append($('<a/>',{
    href: "#search"
  }).text('Search')));
}

$('#logo').click(function(){
  clean_form();


  $('#search').show();
  $('#tabs').empty();
  $('#flights').empty();
  $('#airline-title').hide();
  $('#search-again').remove();
});

function cities_duration(airlines){
  let start_city = airlines[0].flights[0].start.cityName;
  let finish_city = airlines[0].flights[0].finish.cityName;
  let duration = min_to_hours(airlines[0].flights[0].durationMin);

  $('#flights').append($('<div/>',{
    class: 'col-md-12 cities-duration'
  }).append($('<div/>',{
    class: 'col-md-6 col-sm-6 cities'
  }).append($('<h2/>').text(start_city+' - '+finish_city)))
  .append($('<div/>',{
    class: 'col-md-6 col-sm-6 duration'
  }).append($('<h2/>').text('Flight Time: '+duration))));
}
function min_to_hours(duration){
  let hours = Math.floor(duration/60);
  let minutes = duration%60;
  return hours+'h '+minutes+'m';
}
function clean_form(){
  $('#search-flight').trigger("reset");
}

function show_alert(message){
  $('#myAlert strong').text(message);
  $("#myAlert").slideDown(3000, function(){
    $(this).hide();
  });
  $("#myAlert").slideUp(3000, function(){
    $(this).hide();
  });
}
