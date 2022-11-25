
var nombres = []

var app = new function () {
    this.mostrarReservas =  function()
    {
        if(document.getElementById('fecha_consultar').value==null)
            alert('Ingrese una fecha');
        let fecha_consultar =new Date(document.getElementById('fecha_consultar').value).toISOString();
        let sucursal_consultar = document.getElementById('select-sucursal').value;
        var url = new URL("http://localhost:8080/api/reservas/");
        if(sucursal_consultar!=-1) url.search = new URLSearchParams({dateTime:fecha_consultar,branchId:sucursal_consultar,userId:-1})
        else url.search = new URLSearchParams({dateTime:fecha_consultar,userId:-1})
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
            if (reservas.length > 0) {
              var data = '';
              fechaAux = new Date(reservas[0].dateTime)
              //data+='<h2> Fecha: ' + fechaAux.toLocaleDateString()+' </h2>'
              //data+='<table class="centered"><thead><tr><th>Horario</th><th>Sucursal</th><th> </th></tr></thead><tbody>'
              for (i = 0; i < reservas.length; i++) {
                var fecha = reservas[i].dateTime;
                var sucursal = reservas[i].branchId;
                var dateTime = new Date(fecha);
                data += '<tr>';
                data += '<td id='+reservas[i].idTurno+'>' +dateTime.toLocaleTimeString() +'</td> <td id='+reservas[i].idTurno+'>' + nombres[sucursal]+'</td>';
                data += '<td><input type="radio" name="turno" value="'+reservas[i].idReserva+'"></td>';
                data += '</tr>';
              }
            }
            let dataBotones='<h3 class="email">Email:<input type="text" id="email" name="email"><br><br></h3>'
            dataBotones+='<button class="button-17" role="button" onclick="app.verificar();">Reservar</button>'
            dataBotones+='<p></p>'
            document.getElementById('reservas').innerHTML= data;
            document.getElementById('tabla-reservas').style.display = 'table';
            document.getElementById('botones-reservar').innerHTML=dataBotones;
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
        fetch(url,{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(bodyRequest)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(JSON.parse(response.body).msg);
            }
        })
        .then(() =>
        {
            let confirmacion = confirm("Esta seguro que quiere confirmar el turno?");       
            if(confirmacion == true)    
            {
                altaTurno(idReserva);  
            }    
            else    
            {    
                alert("El turno no se ha confirmado");   
                return;
            }    
  
        })
        .catch((error) => {
            alert("El turno no se ha podido reservar");    
        });


        
    }
}

function altaTurno(idReserva)
{
    var url = 'http://localhost:8080/api/reservas/confirmar/' + idReserva;
    if(document.getElementById('email').value == '')
    {
        alert("Ingrese un email");
        return;
    }
    const bodyRequest = {
        userId:'0',
        email:document.getElementById('email').value
    }
    fetch(url,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(bodyRequest)
    })
    .then((response) => {
        if (!response.ok) {
            alert("No se pudo reservar el turno");
        }
        alert("El turno se ha reservado con exito");  
    })
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
            generaMapa(sucursales)
            var data='<option value="-1">Cualquiera</option>'
            for (i = 0; i < sucursales.length; i++) {
                var nombre = sucursales[i].name;
                nombres[i] = nombre;
                var id = sucursales[i].branchId;
                let aux = i+1
                data +='<option value="'+id+'">'+nombre +" (Sucursal "+ aux +")"+'</option>'
            }
            document.getElementById('select-sucursal').innerHTML = data;
        }
    })
    .catch((error) => {
       alert(error);
    });
}

function generaMapa(sucursales) {  //Genera un mapa usando la API
    
  var data = JSON.stringify({
    title : "Hospitales",
    slug: "",
    description: "Mapa que muestra diversos hospitales de la ciudad de mar del plata",
    privacy : "unlisted",
    users_can_create_markers : "yes"})

  fetch('https://cartes.io/api/maps',{
    method:"POST",
    headers: {'Access-Control-Allow-Origin':'*','Accept': 'application/json','Content-Type': 'application/json','Content-Length': data.length},
    mode : 'cors',
    body: data
  }).then((response) => {
    if (!response.ok) throw new Error(JSON.parse(response.body).msg);
    return response.json();
  }).then(data => {
    console.log("Link del mapa: https://app.cartes.io/maps/"+data.slug)
    generaMarkers(sucursales,data.slug)
  })

};
  
  async function generaMarkers(sucursales, mapId) { //Genera markers en el mapa pasado por parametro
    
    
    for(let i = 0; i<sucursales.length; i++){
      
      var data = JSON.stringify({
        lat : sucursales[i].lat,
        lng: sucursales[i].lng,
        category_name : sucursales[i].name})
      
      ruta = "https://cartes.io/api/maps/" + mapId + "/markers"
      fetch(ruta,{
        method: 'POST',
        headers: {'Access-Control-Allow-Origin':'*','Accept': 'application/json','Content-Type': 'application/json','Content-Length': data.length},
        mode : 'cors',
        body: data
      }).then((response) => {
        if (!response.ok) throw new Error(JSON.parse(response.body).msg);
      })
    }
    var elementVar = document.getElementById("mapa");
    elementVar.setAttribute("src", "https://app.cartes.io/maps/" + mapId +"/embed?type=map&lat=-38.001540813477845&lng=-57.539949417114265&zoom=13"); 
  };

mostrarSucursales();