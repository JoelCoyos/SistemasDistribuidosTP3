//  mapa -->  "https://app.cartes.io/maps/986cfcf5-1956-4255-91fa-ae5299e460d5"
// En ese mapa podemos cargar a mano los markers que queramos, es unicamente para levantarlo y meterlo en el archivo JSON

const API = "https://cartes.io/api/maps"
const mapa = "/986cfcf5-1956-4255-91fa-ae5299e460d5"

const linkMarkers = `${API}${mapa}/markers`

const { error } = require('console')
const https = require('https')
const archivo = require('./archivos')

const PORT = 8080
var sucursales = []

const levantaMapaExistente = function(link){
  https.get(link, res => {
      
    if(res.statusCode == 200){
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
          archivo.escribirArchivoJson("sucursales.json",sucursales)
          //console.log(sucursales)
          })
      }
  }).on('error', error => console.error(error.message))
}

/*
const escucha = function(){ 
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
}
*/

const generaMapa = function(sucursales,titulo,descripcion) {  //Genera un mapa usando la API
  
  var data = JSON.stringify({
    title : titulo,
    slug: "",
    description: descripcion,
    privacy : "unlisted",
    users_can_create_markers : "yes"})
  
  
  var options = {
      hostname: 'cartes.io',
      path: '/api/maps',
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
  }

  const req = https.request(options, res => {
    res.setEncoding('utf8');
    
    let body = [];
    
    res.on('data', (chunk) => {
      //process.stdout.write(chunk)
      body.push(chunk);
    });
    
    res.on('end', () => {
      //console.log(res.statusCode)
      //console.log(body)
      //console.log(JSON.parse(body))   <--- no baila      
      
      aux = (body[0]).split("'")
      mapaGen = aux[1]
      aux = mapaGen.split("/")
      ruta = options.path+"/"+aux[4]+"/markers"
      console.log("=============================================================================================")
      console.log("Map id: " + aux[4])
      console.log("Link del mapa generado: https://app.cartes.io/maps/"+aux[4])
      console.log("=============================================================================================")
      generaMarkers(sucursales, ruta)

    });

    req.on('error', err =>{
      console.log(err.message)
    })

    
  });
  req.write(data)
  req.end()

};

const generaMarkers = function(sucursales, ruta) { //Genera markers en el mapa pasado por parametro
  
  for(let i=0;i<sucursales.length;i++){
    
    var data = JSON.stringify({
      lat : sucursales[i].lat,
      lng: sucursales[i].lng,
      category_name : sucursales[i].name})
    
    var options = {
      hostname: 'cartes.io',
      path: ruta,
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    
    var req = https.request(options, (res) => {
      res.setEncoding('utf8');
      
      let body = [];
      
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      
      res.on('end', () => {
        console.log(res.statusCode)
      });
  
      req.on('error', () =>{
        console.log(error.message)
      })
  
      
    });
    //console.log(data)
    req.write(data)
    req.end()
  }
  
};

const magia = async function() {


  await levantaMapaExistente(linkMarkers)
  //escucha()
  await generaMapa(archivo.leerDatosJson("sucursales.json"),"Mapa Sucursales","hola breo")

}

magia()

