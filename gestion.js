class Turno {
    constructor(id, dateTime, userId, email, branchId) {
        this.id = id;
        this.dateTime = dateTime;
        this.userId = userId;
        this.email = email;
        this.branchId = branchId;
    }
}

let turno1 = new Turno(1,new Date(2022,10,8,15,0),1,"usuario1@gmail.com",1)
let turno2 = new Turno(2,new Date(2022,10,9,19,30),1,"usuario2@gmail.com",2)

const http = require('http');

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
        alta();
    else if(request.method === 'PUT')
        modificacion();
    else if(request.method === 'DELETE')
        baja();
  });
}).listen(8080);

//Joel
function alta(datos) 
{
    
}

//Nahuel
function baja(datos) 
{
    
}

//Agustin
function modificacion(datos) 
{
    
}