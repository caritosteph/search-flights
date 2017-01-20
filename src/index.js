import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import './styles/main.css';

$('#travel-date input').datepicker({
    format: "yyyy/mm/dd",
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
  let query = {from, to, date};
  search_flight(query);
});

function search_flight(params){
  let request = $.ajax({
                  url: 'http://localhost:3002/search',
                  method: 'GET',
                  data: params
                });
  request.done(function(){
    console.log("work");
  });
}
