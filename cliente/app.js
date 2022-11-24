
var app = new function () {
    this.mostrarReservas =  function()
    {
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
            var data = '<br>';
            if (reservas.length > 0) {
              for (i = 0; i < reservas.length; i++) {
                var fecha = reservas[i].dateTime;
                var sucursal = reservas[i].branchId;
                var dateTime = new Date(fecha);
                data += '<tr>';
                data += '<td id='+reservas[i].idTurno+'>Fecha: ' + dateTime.toLocaleDateString() + ' Horario: '+ dateTime.toLocaleTimeString() +' Sucursal: ' + sucursal +  '</td>'
                data += '<td><input type="radio" name="turno" value="'+reservas[i].idReserva+'"></td>';
                data += '</tr>';
              }
            }
            data+='<h3>Email:<input type="text" id="email" name="email"><br><br></h3>'
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
            alert("El turno no se ha podido reservar" + error);    
        });


        
    }
}

function altaTurno(idReserva)
{
    var url = 'http://localhost:8080/api/reservas/confirmar/' + idReserva;
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
            throw new Error(JSON.parse(response.body).msg);   
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
                var id = sucursales[i].branchId;
                data +='<option value="'+id+'">'+nombre+'</option>'
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
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers': 'content-type' ,'Access-Control-Allow-Credentials': 'true'},
        mode : 'cors',
        body: data
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(JSON.parse(response.body).msg);
        } else {
          console.log("funciona pa")
        }
        

    })

    

    
    
    /*
    var options = {
        hostname: 'cartes.io',
        path: '/api/maps',
        method: 'POST',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
    }*/
  /*
    const req = https.request(options, res => {
      res.setEncoding('utf8');
      
      let body = [];
      
      res.on('data', (chunk) => {
        //process.stdout.write(chunk)
        body.push(chunk);
      });
      
      res.on('end', () => { 
        
        aux = (body[0]).split("'")
        mapaGen = aux[1]
        aux = mapaGen.split("/")
        ruta = options.path+"/"+aux[4]+"/markers"
        //console.log("Link del mapa generado: https://app.cartes.io/maps/"+aux[4])
        link = "https://app.cartes.io/maps/"+aux[4]
        generaMarkers(sucursales, ruta)
      });
  
      req.on('error', err =>{
      })
      
    });
    req.write(data)
    req.end()*/
  };
  
  async function generaMarkers(sucursales, ruta) { //Genera markers en el mapa pasado por parametro
    const https = require('https')

    for(let i=0;i<sucursales.length;i++){
      await sleep(200)
      var data = JSON.stringify({
        lat : sucursales[i].lat,
        lng: sucursales[i].lng,
        category_name : sucursales[i].name})
      
      var options = {
        hostname: 'cartes.io',
        path: ruta,
        method: 'POST',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }
      
      var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        
        let body = [];
        
        res.on('data', (chunk) => {
          body.push(chunk);
        });
        
        res.on('end', () => {
          //console.log(res.statusCode)
        });
    
        req.on('error', () =>{
          //console.log(error.message)
        })
    
        
      });
      //console.log(data)
      req.write(data)
      req.end()
    }
    
    
  };

mostrarSucursales();