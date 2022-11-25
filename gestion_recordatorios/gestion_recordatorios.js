const archivo = require('./archivos');
http = require('http')


setInterval(function() {
    let reservas = archivo.leerDatosJson('../gestion_reservas/reservas.json');
    
    for(i=0;i<reservas.length;i++) {
        
        if(cantHorasDiferencia(reservas[i].dateTime)==24 && reservas[i].status==2){ //manda el recordatorio reservas[i].dateTime - fechaAcutal < 1 dia
            var fechaReserva = new Date(reservas[i].dateTime)
            fechaReserva.toLocaleDateString()
            
            enviaMail(reservas[i].email,"Recordatorio de turno","<p>Hola te queriamos recordar que tenes un turno en la siguiente fecha: <strong>"+fechaReserva+"</strong></p>")
        }
    }
    
},3600000);



//enviaMail("spateranahuel@gmail.com","Recordatorio de turno","<p>Hola te queriamos recordar "+fechaReserva.getDate()+"/"+fechaReserva.getMonth()+"/"+fechaReserva.getFullYear+"que tenes un turno para tal dia<strong>verso en negrita</strong></p>")


//1 hora = 3600000
//1 minuto = 60.000

function cantHorasDiferencia(fechaTurno){
    var today = new Date();
    today.toISOString()

    var fechaReserva = new Date(fechaTurno)
    fechaReserva.toISOString()

    diferencia = Math.abs(fechaReserva.getTime()-today.getTime());
    let horasDiferencia = (diferencia / 3600000) + 3
    return Math.ceil(horasDiferencia)
}



function enviaMail(to,subject,value){
    var data = {
      destinatario: to,
      asunto: subject,
      cuerpo: value
    }
    
    const options = 
    {
        hostname: 'localhost',
        port: 8089,
        path:'/api/notificacion',
        method:'POST',
    };
  
    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      res.on('end', () => {
        if(res.statusCode == 200)
        {
          //console.log(JSON.parse(body))
        }
        else{
          
        }
      });
    });
  
    req.write(JSON.stringify(data))
    req.end();  
  }


