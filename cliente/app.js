
var app = new function () {

    this.mostrarReservas =  function()
    {
        let fecha_consultar =new Date(document.getElementById('fecha_consultar').value).toISOString();
        console.log(fecha_consultar);
        var url = new URL("http://localhost:8080/api/reservas/");
        url.search = new URLSearchParams({dateTime:fecha_consultar})
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
                data += '<td><input type="radio" onclick="app.Reservar(' + i + ')"></td>';
                data += '</tr>';
              }
            }
            data+='<button>Reservar</button>'
            document.getElementById('reservas').innerHTML = data;
            document.getElementById('reservas').style.display = 'block';
        })
        .catch((error) => {
           alert(error);
        });
    }

}

