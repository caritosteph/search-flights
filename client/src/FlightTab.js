"use strict";

import Utils from './utils/Utils';
import forEach from 'lodash/forEach';
import Search from './Search';
import Flight from './models/Flight';
import Airline from './models/Airline';

class FlightTab {

  static generate_tabs_nearby_dates(params) {
    let nearby_dates = Utils.generate_dates(params.date);
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

  static title_tab(airlines) {
    let f = new Flight(airlines[0].flights[0]);
    let start_city = f.get_departure_city();
    let finish_city = f.get_destiny_city();
    let duration = Utils.min_to_hours(f.get_duration());

    $('#flights').append($('<div/>',{
      class: 'col-md-12 cities-duration'
    }).append($('<div/>',{
      class: 'col-md-6 col-sm-6 cities'
    }).append($('<h2/>').text(start_city + ' - ' + finish_city)))
    .append($('<div/>',{
      class: 'col-md-6 col-sm-6 duration'
    }).append($('<h2/>').text('Flight Time: ' + duration))));
  }

  static generate_content_tab(airlines){
    forEach(airlines, (airline) => {
      let a = new Airline(airline);

      $('#flights').append($('<div/>',{
        class: 'col-md-4 col-sm-6 list-flights',
        id: a.get_airline_code()
      }).append($('<div/>',{
        class: 'list-header'
      }).text(a.get_flights()[0].airline.name)));

      forEach(a.get_flights(), (flight) => {

        let f = new Flight(flight);
        let start_time = Utils.parse_dateTime(f.get_start_time());
        let finish_time = Utils.parse_dateTime(f.get_finish_time());

        $('#' + flight.airline.code)
        .append($('<div/>',{
          class: 'list-body'
        }).append($('<div/>',{
          class: 'col-md-6 col-xs-6'
        }).append($('<p/>').text('Flight Number: ' + f.get_flight_number()))
          .append($('<p/>').text(start_time + ' - ' + finish_time)))
          .append($('<div/>',{
            class: 'col-md-6 col-xs-6'
          })
          .append($('<p/>').text(f.get_plane_name()))
          .append($('<p/>').text('Price: $AUD ' + f.get_price()))));
      });
    });
  }

  static search_by_tab(e) {
    Utils.loading();
    let date = e.target.innerText;
    let params = $('#' + date).data('params');
    params.date = date;
    $('#tabs li').removeClass('active');
    $('#' + date).addClass('active');
    $('#flights').empty();
    $('#search-again').remove();
    $('#search').hide();
    Search.search_flight(params);
  }

}

export default FlightTab;
