"use strict";

import Utils from './utils/Utils';
import FlightAPI from './services/FlightAPI';
import FlightTab from './FlightTab';

class Search {
  static search_flight(params) {
    let search = FlightAPI.search(params);
    search
    .done(response => {
      if(response.success){
        let flights = response.data;
        Search.generate_flights(flights);
      }else{
        let message = response.msg || 'Unexpected error';
        Utils.stop_loading();
        Utils.message_error(message);
      }
    });
  }

  static generate_flights(airlines) {
    Utils.clean_form();
    Utils.create_navbar_search();
    $('#search').hide();
    Utils.stop_loading();
    $('#tabs').show();
    $('.tab-content').show();
    $('#airline-title').show();
    FlightTab.title_tab(airlines);
    FlightTab.generate_content_tab(airlines);
  }

}

export default Search;
