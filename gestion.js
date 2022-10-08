var turnos = [];

var turno =
{
    id,
    dateTime,
    userId,
    email,
    branchId
}
 
//comentario de prueba

class Turno {
    constructor(id, dateTime, userId, email, branchId) {
        this.id = id;
        this.dateTime = dateTime;
        this.userId = userId;
        this.email = email;
        this.branchId = branchId;
    }
}

let turno1 = new turno(1,new Date(2022,10,8,15,0),1,"usuario1@gmail.com",1)
let turno2 = new turno(2,new Date(2022,10,9,19,30),1,"usuario2@gmail.com",2)

import { createServer } from 'http';

const server = createServer((request, response) => {

});

server.on('request', (request, response) => {

});

//Joel
function alta(date,userId,email,branch) 
{
    
}

//Nahuel
function baja(idTurno) 
{
    
}

//Agustin
function modificacion(idTurno,newDate) 
{
    
}