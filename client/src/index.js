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
    // cheaper_flight(data);
    generate_tabs_nearby_dates(params);
  });
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
      href:'#'
    }).text(date)).data('params',params));
  });
  $('#tabs :nth-child(3)').addClass('active');
}

$('#tabs').on('click','li.nearby_dates',function(e){
  let date = e.target.innerText;
  let params = $('#'+date).data('params');
  params.date = date;
  console.log("ev: ",params);
});

// function cheaper_flight(data){
//
// }
