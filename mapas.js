
//  mapa -->  "https://app.cartes.io/maps/986cfcf5-1956-4255-91fa-ae5299e460d5"

const API = "https://cartes.io/api/maps"
const mapa = "/986cfcf5-1956-4255-91fa-ae5299e460d5"

const linkMapas = `${API}${mapa}`
const linkMarkers = `${API}${mapa}/markers`

const http = require('http')
const https = require('https')

const PORT = 8080
var sucursales = []

https.get(linkMarkers, res => {
    //console.log(res.statusCode) si es 200 todo OK
    //console.log(res.headers)

    let body = ''

    res.on('data', data => {
        body += data
    })

    res.on('end', () => {
        let aux = JSON.parse(body)
        for(let i = 0; i < aux.length; i++){
                  
            let sucursal = new Object()
            sucursal.id = i + 1
            sucursal.lat = aux[i].location.coordinates[1]
            sucursal.lng = aux[i].location.coordinates[0]
            sucursal.name = aux[i].category.name 

            sucursales.push(sucursal)
      }

      //habria que escribir el archivo json



      //console.log(sucursales)
    })
}).on('error', error => console.error(error.message))


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
      if(request.method === 'GET'){
        msg = JSON.stringify(sucursales)
      } 
      response.end(msg);
    });
  }).listen(PORT);

/* cliente (en nuestro caso seria el gateway)

const http = require('http');

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/',
    method:'GET',
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    });
    res.on('end', () => {
      console.log(JSON.parse(body));
    });
});

req.end();


