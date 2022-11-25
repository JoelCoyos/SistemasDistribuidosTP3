const fs = require('fs');
const nombres = require('fake-people');
const fakePeople = require('fake-people');

let sucursales = [1,2,3,4,5,6,7];
const rand = max => Math.floor(Math.random() * max);

class Turno {
    constructor(idReserva,dateTime,userId,email,branchId,status)
    {
        this.idReserva = idReserva;
        this.dateTime = dateTime;
        this.email = email;
        this.branchId=branchId;
        this.userId=userId;
        this.status=status;
    }
}


//popularTurnosDia(10,1,8,18,1);
popularTurnosMes(10,8,18,1);

function popularTurnosDia(mes,dia,horaInicio,horaFin,duracionTurno)
{
    let turnos = [];
    let count = 0;
    sucursales.forEach(sucursal => {
        for(let i = horaInicio;i<=horaFin;i+=duracionTurno)
        {
            turnos.push(new Turno(count,new Date(2022,mes,dia,i),sucursal));
            count++;
        }
    });
    let turnosJson = JSON.stringify(turnos);
    fs.writeFile("reservas.json", turnosJson, (err) => {
        if (err) return "todo mal";
      });
}


function popularTurnosMes(mes,horaInicio,horaFin,duracionTurno)
{
    let turnos = [];
    let count = 0;
    let daysInMonth = new Date(2022, mes, 0).getDate();
    sucursales.forEach(sucursal => {
        for(let j =1;j < daysInMonth;j++)
        {
            for(let i =horaInicio;i<=horaFin;i+=duracionTurno)
            {
                    turnos.push(new Turno(count,new Date(2022,mes,j,i),-1,null,sucursal,0));

                /*else
                {
                    let personaRandom = fakePeople.generate();
                    turnos.push(new Turno(count,new Date(2022,mes,j,i),0,personaRandom.contacts.email,sucursal,2));
                }*/
                count++;
            }
        }
    });
    let turnosJson = JSON.stringify(turnos);
    fs.writeFile("reservas.json", turnosJson, (err) => {
        if (err) return "todo mal";
      });
}

