const fs = require('fs');

let sucursales = [1];

class Turno {
    constructor(idTurno,date,branchId) {
        this.idTurno = idTurno;
        this.date = date
        this.userId = null;
        this.email = null;
        this.branchId = branchId;
    }
}

popularTurnosDia(10,1,8,18,1);
//popularTurnosMes(10,8,18,1);

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
                turnos.push(new Turno(count,new Date(2022,mes,j,i),sucursal));
                count++;
            }
        }
    });
    let turnosJson = JSON.stringify(turnos);
    fs.writeFile("reservas.json", turnosJson, (err) => {
        if (err) return "todo mal";
      });
}
