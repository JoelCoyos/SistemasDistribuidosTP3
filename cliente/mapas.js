//  mapa -->  "https://app.cartes.io/maps/986cfcf5-1956-4255-91fa-ae5299e460d5"
// En ese mapa podemos cargar a mano los markers que queramos, es unicamente para levantarlo y meterlo en el archivo JSON

const { error } = require('console')
const https = require('https')
const { resolve } = require('path')
const archivo = require('../archivos')

var link = ""
var sucursales = []

const sleep = async (milisegundos) => {
  await new Promise(resolve => {
    return setTimeout(resolve,milisegundos);
  })
}

const muestraLink = function(){
  console.log(link)
}

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
                sucursal.branchId = i + 1
                sucursal.lat = aux[i].location.coordinates[1]
                sucursal.lng = aux[i].location.coordinates[0]
                sucursal.name = aux[i].category.name 

                sucursales.push(sucursal)
          }
          archivo.escribirArchivoJson("../gestion_sucursales/sucursales.json",sucursales)
          //console.log(sucursales)
          })
      }
  }).on('error', error => console.error(error.message))
}

const generaMapa = function(sucursales) {  //Genera un mapa usando la API

  var data = JSON.stringify({
    title : "Hospitales",
    slug: "",
    description: "Mapa que muestra diversos hospitales de la ciudad de mar del plata",
    privacy : "unlisted",
    //users_can_create_markers : "only_logged_in"
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
      console.log(body)
      aux = (body[0]).split("'")
      mapaGen = aux[1]
      aux = mapaGen.split("/")
      ruta = options.path+"/"+aux[4]+"/markers"
      console.log("=============================================================================================")
      console.log("Map id: " + aux[4])
      console.log("Link del mapa generado: https://app.cartes.io/maps/"+aux[4])
      link = "https://app.cartes.io/maps/"+aux[4]
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

const generaMarkers = async function(sucursales, ruta) { //Genera markers en el mapa pasado por parametro
  
  for(let i=0;i<sucursales.length;i++){
    await sleep(200)
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
  
  //muestraLink()
};

const magia = async function() {

  let linkMapaExistente = "https://cartes.io/api/maps/986cfcf5-1956-4255-91fa-ae5299e460d5/markers"
  await levantaMapaExistente(linkMapaExistente)
  //console.log("esto no tiene que aparecer")
  //generaMapa(archivo.leerDatosJson("../gestion_sucursales/sucursales.json"))
}

magia()

