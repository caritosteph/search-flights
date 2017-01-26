"use strict";

import '../../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import map from 'lodash/map';
import Utils from './utils/Utils';
import FlightTab from './FlightTab';
import Search from './Search';

$('#travel-date input').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true
});

$('#nav-search').click(function(){
  Utils.show_form_search();
});

$('#logo').click(function(){
  Utils.show_form_search();
});

$('#search-flight').submit(function(e){
  e.preventDefault();

  $('#tabs').empty();
  $('#flights').empty();
  Utils.loading();

  let from = $('input[name=from]').val();
  let to  = $('input[name=to]').val();
  let date = $('input[name=date]').val();
  let locations = [from,to];

  let request = map(locations,function(location){
        return new Promise((resolve)=> {
          resolve(Utils.get_airline_code(location));
        });
      });
  Promise.all(request).then(data=> {
    let query = {from: data[0], to: data[1], date};
    FlightTab.generate_tabs_nearby_dates(query);
    $('#tabs li.active').off('click');
    Search.search_flight(query);
  });
});

$('#tabs').on('click','li.nearby_dates:not(.active)',function(e){
  FlightTab.search_by_tab(e);
});
