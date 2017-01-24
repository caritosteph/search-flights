class Utils {
  send_data(res,value,data){
    let json = {};
    value ? json = {success: value, data: data } : json = {success: value, msg: data };
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  }
}
export default Utils;
