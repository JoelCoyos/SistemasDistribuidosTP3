const http = require('http');
const { arch } = require('os');
const PORT = 8080;
const archivo = require('./archivos')

const urlParse = require('url');

var sucursales = archivo.leerDatosJson('sucursales.json')

http.createServer((request, response) =>  {
  const { headers, method, url } = request;
  let body = [];

  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => 
  {
    body.push(chunk);
  }).on('end', async () => 
  {
    var msg = ''
    if(request.method === 'GET' && request.url == '/api/sucursales'){
      msg = JSON.stringify(sucursales)
    }
    else if(request.method == 'GET' && urlParse.parse(request.url,true).pathname == '/api/sucursales/')
    {
      let query = urlParse.parse(request.url,true).query;  
      let i = 0
      while(i<sucursales.length && sucursales[i].id != query.id) {i++}
      if(i == sucursales.length) 
        msg = JSON.stringify("No existe la sucursal")
      else{
        const rta = {
          lat : sucursales[i].lat,
          lng : sucursales[i].lng,
          name : sucursales[i].name
        }
        msg = JSON.stringify(rta)
      }
    } 
    response.end(msg);
  });
}).listen(PORT);
