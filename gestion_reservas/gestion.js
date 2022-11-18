const http = require('http');
const sendEmail = require('../gestion_notificaciones/gestionNotificaciones');
const PORT = 8082
const fs = require('fs');
const archivo = require('./archivos');
const urlParse = require('url');
const { setDefaultResultOrder } = require('dns');
const LIBRE=0
const BLOQUEADO=1
const RESERVADO=2



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
  response.setHeader('Content-Type', 'application/json');
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
      if(request.url.match(/\/api\/reservas\/confirmar\/\w+/))
      {
        console.log("alta");
        const idTurno = request.url.split('/')[4];
        msg = alta(idTurno,JSON.parse(body));
      }
      else if(request.url.match(/\/api\/reservas\/solicitar\/[0,1,2,3,4,5,6,7,8,9]+/)){
        idReserva=request.url.split('/')[4]
        bodyParsed = JSON.parse(body);
        console.log(bodyParsed);
        userId = JSON.parse(body).userId
        console.log("idReserva: "+idReserva+"\nuserId: "+userId)
        msg=verificaTurno(idReserva,userId)

      }
    }
    else if(request.method == 'GET')
    {
      if(urlParse.parse(request.url,true).pathname == '/api/reservas/') //get turnos
      {
        let query = urlParse.parse(request.url,true).query;
        msg = getTurnos(query.userId,query.dateTime,query.branchId);
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
    response.end(JSON.stringify(msg));
  });
}).listen(PORT);


function getTurnos(userId,dateTime,branchId)
{
  let turnos = [];
  //let reservas = archivo.leerDatosJson('./gestion_reservas/reservas.json');
  let reservas = archivo.leerDatosJson('reservas.json');
  turnos = reservas.filter(turno => 
    ( 
      (userId  == undefined  || turno.userId    == userId)  && 
      (dateTime     == undefined || new Date(turno.dateTime).toISOString().split('T')[0] == new Date(dateTime).toISOString().split('T')[0] )  && 
      (branchId == undefined || turno.branchId  == branchId)
    )
  )
  return turnos;
}

function alta(idReserva,newReserva) 
{ 
  //let reservas = archivo.leerDatosJson('./gestion_reservas/reservas.json');
  let reservas = archivo.leerDatosJson('reservas.json');
  if(reservas[idReserva].status==BLOQUEADO && reservas[idReserva].userId==newReserva.userId)
  {
    let reserva = reservas[idReserva];

    reserva.userId = newReserva.userId;
    reserva.email = newReserva.email;
    reserva.status = RESERVADO
    reservas[idReserva] = reserva;
    //archivo.escribirArchivoJson('./gestion_reservas/reservas.json',reservas);
    archivo.escribirArchivoJson('reservas.json',reservas);
    return "todo bien"
  }
  else
  {
    return "ya esta ocupado"
  }
}



function verificaTurno(idReserva,userId){
  const mutex = new Mutex();
  (async ()=>{
    console.log("Pidiendo el lock");
    const unlock = await mutex.lock();
    let reservas = archivo.leerDatosJson("reservas.json");
    if(reservas[idReserva].status==LIBRE){ //CREO QUE ESTO TIENE QUE SER SYNCRONICO
      msg="TURNO DISPONIBLE. AHORA TE MUESTRO LA VENTANA INTERMEDIA PARA QUE CONFIRMES LA RESERVA."
      reservas[idReserva].userId=userId;
      reservas[idReserva].status=BLOQUEADO;
      archivo.escribirArchivoJson("reservas.json",reservas); //VER ESTO capaz ambos clientes ven que el userId esta desocupado y entran ambos . VER COMO BLOQUEAR RECURSO. 
      idTimeOut=setTimeout(function(){
        if(reservas[idReserva].status==BLOQUEADO){
          reservas[idReserva].status=LIBRE
          console.log("Se te expiro el tiempo logiii")
          archivo.escribirArchivoJson("reservas.json",reservas);
        }
      },15000);
    }
    else
      msg="EL TURNO YA SE ENCUENTRA OCUPADO."
    console.log("Saco el lock");
    unlock();
    return msg
  })();
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

function Mutex() {
  let current = Promise.resolve();
  this.lock = () => {
      let _resolve;
      const p = new Promise(resolve => {
          _resolve = () => resolve();
      });
      const rv = current.then(() => _resolve);
      current = p;
      return rv;
  };
}
