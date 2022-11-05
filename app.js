
var app = new function () {

    this.mostrarReservas =  function()
    {
        let fecha_consultar =new Date(document.getElementById('fecha_consultar').value).toISOString();
        console.log(fecha_consultar);
        var url = new URL("http://localhost:8080/api/reservas/");
        url.search = new URLSearchParams({date:fecha_consultar})
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
                var fecha = reservas[i].date;
                var sucursal = reservas[i].branchId;
                var date = new Date(fecha);
                data += '<tr>';
                data += '<td id='+reservas[i].idTurno+'>Fecha: ' + date.toLocaleDateString() + ' Horario: '+ date.toLocaleTimeString() +' Sucursal: ' + sucursal +  '</td>'
                data += '<td><button onclick="app.Reservar(' + i + ')">Reservar</button></td>';
                data += '</tr>';
              }
            }
            document.getElementById('reservas').innerHTML = data;
            document.getElementById('reservas').style.display = 'block';
        })
        .catch((error) => {
           alert(error);
        });
    }

}

