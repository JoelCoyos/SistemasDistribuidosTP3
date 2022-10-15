const http = require('http');
const PORT = 8080
const fs = require('fs');

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
    console.log("---------------------------------------------------------")
    if(request.method === 'POST'){
      msg = await alta(body)
    } else if(request.method === 'PUT'){
      msg = await modificacion(body)
    } else if(request.method === 'DELETE'){
      msg = await baja(body)
    }

    response.end(msg);
  });
}).listen(PORT);

function newId(reservas){
  return reservas[reservas.length-1].idTurno + 1
}

function existe(reservas, newReserva){
  let filteredRecords = reservas.filter(function (currentElement) {
    return currentElement.date == newReserva.date && currentElement.branchId == newReserva.branchId;
  });
  return filteredRecords.length == 0
}

function borra(reservas, reservaDelete){
  let filteredRecords = reservas.filter(function (currentElement) {
    return currentElement.date != reservaDelete.date || currentElement.branchId != reservaDelete.branchId;
  });
  return filteredRecords
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
  
  if(data.length <= 2){
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

    //nahuel

    return  "todo joya"
  } else {
    console.log(reservas)
    return  "repetido capo"
  }
}

//Agustin
function baja(datos) {
  try{
    var data = fs.readFileSync("reservas.json");
  } catch(err){
    fs.openSync("reservas.json", 'w')
    return "no existe el JSON, no se puede eliminar nada"
  }
  
  if(data.length > 2){
    let reservaDelete = JSON.parse(datos)
    var reservas = JSON.parse(data);
    let reservasAuxiliar = borra(reservas,reservaDelete)

    if(reservas == reservasAuxiliar){
      console.log(reservas)
      return "No existe el turno que se quiere eliminar"
    } else {
      var updateReservas = JSON.stringify(reservasAuxiliar);
      console.log(reservasAuxiliar)
      
      fs.writeFile("reservas.json", updateReservas, (err) => {
        if (err) return "todo mal";
      });
      return "eliminado con exito"
    }
  } else {
    return "el JSON esta vacio"
  }
}

//Joel
function modificacion(datos) {
  sol = JSON.parse(datos)

  
}