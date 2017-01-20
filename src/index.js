import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';
import './styles/main.css';

$('#travel-date input').datepicker({
    clearBtn: true,
    orientation: "bottom left",
    keyboardNavigation: false,
    forceParse: false
});
