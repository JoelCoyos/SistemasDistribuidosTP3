const http = require('http');
const sendEmail = require('./gestionNotificaciones');
const PORT = 8080
const fs = require('fs');
const { setDefaultResultOrder } = require('dns');

class Turno {
    constructor(nroTurno, newReserva) {
        this.idTurno = nroTurno;
        this.date = newReserva.date;
        this.userId = newReserva.userId;
        this.email = newReserva.email;
        this.branchId = newReserva.branchId;
    }
}

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
    //No hay mas datos

    if(request.method === 'POST')
        msg = await alta(body)
    else if(request.method === 'PUT')
        modificacion(body)
    else if(request.method === 'DELETE')
        baja(body)

    response.end(msg);
  });
}).listen(PORT);

function newId(reservas){
  return reservas[reservas.length-1].idTurno + 1
}

function existe(reservas, newReserva){
  //const filteredRecords = reservas.filter(reservas => {reservas.date == newReserva.date && reservas.branchId == newReserva.branchId} )
  let filteredRecords = reservas.filter(function (currentElement) {
    return currentElement.date == newReserva.date && currentElement.branchId == newReserva.branchId;
  });
  return filteredRecords.length == 0
}

async function alta(datos) 
{ 
  try{
    var data = fs.readFileSync("reservas.json");
  } catch(err){
    fs.openSync("reservas.json", 'w')
    data = []
  }
  
  let newReserva = JSON.parse(datos)
  let nroTurno = 1
  
  if(data.length == 0){
    var reservas = []
  } else {
    var reservas = JSON.parse(data);
    nroTurno = newId(reservas)
  }
  
  if(existe(reservas,newReserva)){
    let turno = new Turno(nroTurno, newReserva)
    reservas.push(turno);


    var updateReservas = JSON.stringify(reservas);
    console.log(reservas)
    
    fs.writeFile("reservas.json", updateReservas, (err) => {
      if (err) return "todo mal";
    });

    //sendEmail(datos.email,"Benvenute","Hola has reservado un turno en la peluquerio bla bla blaa.")

    return  "todo joya"
  } else {
    console.log(reservas)
    return  "repetido capo"
  }
}

//Agustin
function baja(datos) 
{
  sol = JSON.parse(datos)

  
}

//Joel
function modificacion(datos) 
{
  sol = JSON.parse(datos)

  
}