const http = require('http');
const PORT = 8082
const fs = require('fs');
const archivo = require('./archivos');
const urlParse = require('url');
const { setDefaultResultOrder } = require('dns');
const LIBRE=0
const BLOQUEADO=1
const RESERVADO=2
const mutexReservas =new Mutex();

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
        msg= await verificaTurno(idReserva,userId)
        console.log("Salgo del verificar turno");

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

async function alta(idReserva,newReserva) 
{ 
  //let reservas = archivo.leerDatosJson('./gestion_reservas/reservas.json');
  console.log("Pido el lock alta");
  const unlock = await mutexReservas.lock();
  let msg ="";
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
    enviaMail(newReserva.email,"Registro de turno","<p>Hola te has registrado correctamente <strong>verso en negrita</strong>, <strong>otro verso. Integrar una plantilla</strong></p>");
    msg ="todo bien"
  }
  else
  {
    msg = "ya esta ocupado"
  }
  console.log("Liberando lock verificacion");
  unlock();
  return msg;

}



async function verificaTurno(idReserva,userId){

    console.log("Pido el lock verificacion");
    const unlock = await mutexReservas.lock();
    //let reservas = archivo.leerDatosJson('./gestion_reservas/reservas.json');
    let reservas = archivo.leerDatosJson('reservas.json');
    if(reservas[idReserva].status==LIBRE){ //CREO QUE ESTO TIENE QUE SER SYNCRONICO
      msg="TURNO DISPONIBLE. AHORA TE MUESTRO LA VENTANA INTERMEDIA PARA QUE CONFIRMES LA RESERVA."
      reservas[idReserva].userId=userId;
      reservas[idReserva].status=BLOQUEADO;
      //archivo.escribirArchivoJson('./gestion_reservas/reservas.json',reservas); //VER ESTO capaz ambos clientes ven que el userId esta desocupado y entran ambos . VER COMO BLOQUEAR RECURSO. 
      archivo.escribirArchivoJson('reservas.json',reservas);
      idTimeOut=setTimeout(function(){
        let newReservas = archivo.leerDatosJson('reservas.json');
        if(newReservas[idReserva].status==BLOQUEADO){
          newReservas[idReserva].status=LIBRE
          console.log("Se te expiro el tiempo logiii")
         // archivo.escribirArchivoJson('./gestion_reservas/reservas.json',reservas);
          archivo.escribirArchivoJson('reservas.json',reservas);
        }
      },10000);
    }
    else
      msg="EL TURNO YA SE ENCUENTRA OCUPADO."
    console.log("Liberando lock verificacion");
    unlock();
    return msg
}

function enviaMail(to,subject,value){
  var data = {
    destinatario: to,
    asunto: subject,
    cuerpo: value
  }
  
  const options = 
  {
      hostname: 'localhost',
      port: 8083,
      path:'/api/notificacion',
      method:'POST',
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    });
    res.on('end', () => {
      if(res.statusCode == 200)
        //console.log(JSON.parse(body))
        console.log("HOLA")
      else{
        console.log(res.statusCode)
        console.log(body)
      }

    });
  });

  req.write(JSON.stringify(data))
  req.end();  
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
      // Caller gets a promise that resolves when the current outstanding
      // lock resolves
      const rv = current.then(() => _resolve);
      // Don't allow the next request until the new promise is done
      current = p;
      // Return the new promise
      return rv;
  };
}