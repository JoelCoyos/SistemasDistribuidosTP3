const http = require('http');
const PORT = 8080

//let turno1 = new Turno(1,new Date(2022,10,8,15,0),1,"usuario1@gmail.com",1)
//let turno2 = new Turno(2,new Date(2022,10,9,19,30),1,"usuario2@gmail.com",2)

class Turno {
    constructor(id, dateTime, userId, email, branchId) {
        this.id = id;
        this.dateTime = dateTime;
        this.userId = userId;
        this.email = email;
        this.branchId = branchId;
    }
}

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];

  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => 
  {
    body.push(chunk);

  }).on('end', () => 
  {
    //No hay mas datos
    console.log(body.toString());


    if(request.method === 'POST')
        alta(body)
    else if(request.method === 'PUT')
        modificacion(body)
    else if(request.method === 'DELETE')
        baja(body)
  });
}).listen(PORT);

//Joel
function alta(datos) 
{
  sol = JSON.parse(body)
  
  console.log("alta")
  console.log("fecha:",sol.fecha) 
  console.log("userId:",sol.userId)
  console.log("email:",sol.email)
  console.log("branchId:",sol.branchId)
}

//Nahuel
function baja(datos) 
{
  sol = JSON.parse(body)

  console.log("baja")
  console.log("idTurno:",idTurno) 
}

//Agustin
function modificacion(datos) 
{
  sol = JSON.parse(body)

  console.log("mod")
  console.log("idTurno:",idTurno)
  console.log("fecha:",newDate) 
}