const http = require('http');
const { arch } = require('os');
const PORT = 8081;
const archivo = require('./archivos')

const urlParse = require('url');


http.createServer((request, response) =>  {
  const { headers, method, url } = request;
  let body = [];
  response.setHeader('Content-Type', 'application/json');
  var sucursales = archivo.leerDatosJson('sucursales.json')
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
    else if(request.url.match(/\/api\/sucursales\/\w+/))
    {
      const branchId = request.url.split('/')[3];
      let i = 0
      while(i<sucursales.length && sucursales[i].branchId != branchId) {i++}
      if(i == sucursales.length) {
        msg = "No existe la sucursal"
        response.writeHead(404,msg)
      }
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
