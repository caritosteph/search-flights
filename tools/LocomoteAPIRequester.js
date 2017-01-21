var LocomoteAPIRequester {
  const base_url = 'http://node.locomote.com/code-task';

  airlines: function() {
    request.get({baseUrl:base_url, url:'/airlines'}, function(error, response, body){
      if(!error && response.statusCode == 200){
        return JSON.parse(body)
      }else{
        throw Error; //enviar excepcion
      }
    });
  }
}
