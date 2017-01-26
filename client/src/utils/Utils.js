import moment from 'moment';
import forEach from 'lodash/forEach';
import FlightAPI from '../services/FlightAPI';

class Utils {
  static clean_form() {
    $('#search-flight').trigger("reset");
  }

  static loading() {
    $('#redoverlay').show();
    $('#loading').show();
  }

  static stop_loading() {
    $('#redoverlay').hide();
    $('#loading').hide();
  }

  static message_error(message) {
    $('#myAlert strong').text(message);
    $("#myAlert").slideDown(3000, function(){
      $(this).hide();
    });
    $("#myAlert").slideUp(3000, function(){
      $(this).hide();
    });
  }

  static parse_dateTime(date) {
    return moment.parseZone(date).format('hh:mm a');
  }

  static min_to_hours(duration) {
    let hours = Math.floor(duration/60);
    let minutes = duration%60;
    return hours + 'h ' + minutes + 'm';
  }

  static generate_dates(date) {
    let ranges = [-2,-1,0,1,2];
    let nearby_dates = [];
    forEach(ranges, (value) => {
      nearby_dates.push(moment(date).clone().add(value, 'day').format("YYYY-MM-DD"));
    });
    return nearby_dates;
  }

  static get_airline_code(location) {
    return new Promise((resolve)=>{
      let airline_code = FlightAPI.airline_code(location);
      airline_code
      .done(response => {
        if(response.success){
          let airports = response.data;
          resolve(airports[0].airportCode);
        }else{
            let message = response.msg;
            Utils.stop_loading();
            Utils.message_error(message);
        }
      });
    });
  }

  static show_form_search() {
    Utils.clean_form();
    $('#search').show();
    $('#tabs').empty();
    $('#flights').empty();
    $('#airline-title').hide();
    $('#search-again').remove();
  }

  static create_navbar_search() {
    $('#nav-search').append($('<li/>',{
      class: 'active',
      id: 'search-again'
    }).append($('<a/>',{
      href: "#search"
    }).text('Search')));
  }
}

export default Utils;
