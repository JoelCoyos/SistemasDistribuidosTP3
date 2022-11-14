
var app = new function () {
    this.mostrarReservas =  function()
    {
        let fecha_consultar =new Date(document.getElementById('fecha_consultar').value).toISOString();
        let sucursal_consultar = document.getElementById('select-sucursal').value;
        var url = new URL("http://localhost:8080/api/reservas/");
        if(sucursal_consultar!=-1) url.search = new URLSearchParams({dateTime:fecha_consultar,branchId:sucursal_consultar})
        else url.search = new URLSearchParams({dateTime:fecha_consultar})
        fetch(url,{
            method:'GET',
        })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        })
        .then((reservas) => {
            var data = '<br>';
            if (reservas.length > 0) {
              for (i = 0; i < reservas.length; i++) {
                var fecha = reservas[i].dateTime;
                var sucursal = reservas[i].branchId;
                var dateTime = new Date(fecha);
                data += '<tr>';
                data += '<td id='+reservas[i].idTurno+'>Fecha: ' + dateTime.toLocaleDateString() + ' Horario: '+ dateTime.toLocaleTimeString() +' Sucursal: ' + sucursal +  '</td>'
                data += '<td><input type="radio" name="turno" value="'+i+'"></td>';
                data += '</tr>';
              }
            }
            data+='<button onclick="app.verificar();">Reservar</button>'
            document.getElementById('reservas').innerHTML = data;
            document.getElementById('reservas').style.display = 'block';
        })
        .catch((error) => {
           alert(error);
        });
    }

    this.verificar = function()
    {
        var turnos = document.getElementsByName('turno');
        let idReserva;
        for(i=0; i< turnos.length;i++)
        {
            if(turnos[i].checked)
            {
                idReserva = turnos[i].value;
            }
        }
        var url = 'http://localhost:8080/api/reservas/solicitar/' + idReserva;
        const bodyRequest = {
            userId:'0'
        }
        console.log(JSON.stringify(bodyRequest));
        fetch(url,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(bodyRequest)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
        })
        .catch((error) => {
           alert(error);
        });

    }
}

function mostrarSucursales()
{
    var url = new URL("http://localhost:8080/api/sucursales");
    fetch(url,{
        method:'GET'
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json();
    })
    .then((sucursales) => {
        if (sucursales.length > 0) {
            var data='<option value="-1">Cualquiera</option>'
            for (i = 0; i < sucursales.length; i++) {
                var nombre = sucursales[i].name;
                var id = sucursales[i].branchId;
                data +='<option value="'+id+'">'+nombre+'</option>'
            }
        }
        document.getElementById('select-sucursal').innerHTML = data;
    })
    .catch((error) => {
       alert(error);
    });
}

mostrarSucursales();