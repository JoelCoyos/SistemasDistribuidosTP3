const http = require('http');
const PORT = 8080
const fs = require('fs');
const archivo = require('./archivos');
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
    else if(request.method === 'PUT')
    {

    }
    else if(request.method === 'DELETE')
    {

    }
    response.end(msg);
  });
}).listen(PORT);



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