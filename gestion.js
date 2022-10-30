const http = require('http');
const sendEmail = require('./gestionNotificaciones');
const PORT = 8080
const fs = require('fs');
const archivo = require('./archivos');
const urlParse = require('url');
const { setDefaultResultOrder } = require('dns');

class Turno {
    constructor(nroTurno, newReserva) {
        this.id = nroTurno;
        this.date = newReserva.date;
        this.userId = newReserva.userId;
        this.email = newReserva.email;
        this.branchId = newReserva.branchId;
    }
}

http.createServer((request, response) =>  {
  const { headers, method, url } = request;
  let body = [];
  let msg = '';
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => 
  {
    body.push(chunk);

  }).on('end', async () => 
  {
    //No hay mas datos

    if(request.method === 'POST')
    {
      if(request.url.match(/\/api\/reserva\/\w+/))
      {
        const idTurno = request.url.split('/')[3];
        msg = alta(idTurno,JSON.parse(body));
      }
    }
    else if(request.method == 'GET')
    {
      if(urlParse.parse(request.url,true).pathname == '/api/reserva/') //get turnos
      {
        let query = urlParse.parse(request.url,true).query;
        console.log(query.userId +' '+ query.date + ' '+ query.branchId);
        msg = getTurnos(query.userId,query.date,query.branchId);
      }
      else if(request.url.match(/\/api\/reserva\/\w+/)) //Get reserva
      {
        msg = '';
      }
    }
    else if(request.method === 'PUT')
    {

    }
    else if(request.method === 'DELETE')
    {

    }
    response.end(msg);
  });
}).listen(PORT);


function getTurnos(userId,date,branchId)
{
  let turnos = [];
  let reservas = archivo.leerDatosJson("reservas.json");
  turnos = reservas.filter(turno => 
    ( 
      (userId  == undefined  || turno.userId    == userId)  && 
      (date     == undefined || turno.date      == date)  && 
      (branchId == undefined || turno.branchId  == branchId)
    )
  )
  return JSON.stringify(turnos);
}

function alta(idTurno,newReserva) 
{ 
  let reservas = archivo.leerDatosJson("reservas.json");
  if(libre(reservas,idTurno))
  {
    let reserva = reservas[idTurno];
    reserva.userId = newReserva.userId;
    reserva.email = newReserva.email;
    reservas[idTurno] = reserva;
    archivo.escribirArchivoJson("reservas.json",reservas);
    return "todo bien"
  }
  else
  {
    return "ya esta ocupado"
  }
}

function libre(reservas, idTurno){
  if(reservas[idTurno].userId==-1) 
    return true;
  else 
    return false;
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