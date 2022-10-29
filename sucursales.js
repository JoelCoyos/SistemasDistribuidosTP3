const http = require('http');
const PORT = 8081;
const archivo = require('./archivos')

class Sucursal{
    constructor(id,lat,lng,name){
        this.id=id;
        this.lat=lat;
        this.lng = lng;
        this.name=name;
    }
}

http.createServer((request, response) =>  {
    const { headers, method, url } = request;
    let body = [];
    let res = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => 
    {
      body.push(chunk);
  
    }).on('end', async () => 
    {
        if(request.method == 'GET' && request.url == '/api/sucursales')
        {
          res = getSucursales();
        }
        response.end(res);
    });
  }).listen(PORT);

  function getSucursales()
  {
    let sucursales = archivo.leerDatosJson("sucursales.json");
    return sucursales;
  }
  

  /*let sucursal1 = new Sucursal(1,1,1,"Sucursal 1");
  let sucursal2 = new Sucursal(2,2,2,"Sucursal 2");
  let sucursal3 = new Sucursal(3,3,3,"Sucursal 3");

  let sucursales = [sucursal1,sucursal2,sucursal3];

  archivo.escribirArchivoJson('sucursales.json',sucursales);*/


