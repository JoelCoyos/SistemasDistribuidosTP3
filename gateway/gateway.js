
const http = require('http');
const PORT = 8081

http.createServer((request, response) =>  {
    const { headers, method, url } = request;
    let body = [];
  
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => 
    {
      body.push(chunk);
    }).on('end', async () => 
    {
      
      if(request.url.split('/')[2] == 'sucursales'){
        puerto = 8080 // gestion sucursales
      } else if(request.url.split('/')[2] == 'reservas'){
        puerto = 8082 
      } else {
        puerto = -1 //error
      }

      let msg = ''
      var options2 = 
      {
        hostname: 'localhost',
        port: puerto,
        path: request.url,
        method: request.method,
      };

      const req = http.request(options2, (res) => {
        res.setEncoding('utf8');
        let body2 = [];
        res.on('data', (chunk2) => {
          body2.push(chunk2);
        });
        res.on('end', () => {
          
          if(res.statusCode == 200){
            msg = JSON.parse(body2)
            console.log(msg)
            msg = JSON.stringify(msg)
          } else {
            response.writeHead(res.statusCode,res.body)
            msg = JSON.stringify(body2)
          }
          console.log(msg)
          response.end(msg);
        });
      });
    
      req.end();

      
    });
  }).listen(PORT);
  
/*
const solicitud = function(puerto, ruta, metodo){

    var options2 = 
    {
      hostname: 'localhost',
      port: puerto,
      path: ruta,
      method: metodo,
    };

    const req = http.request(options2, (res) => {
        res.setEncoding('utf8');
        let body = [];
        res.on('data', (chunk) => {
          body.push(chunk);
        });
        res.on('end', () => {
          
          return res.body
        });
    });
    
    req.end();
}*/

/*  gateway anterior
const http = require('http');

var data = {
  userId: 0
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/sucursales/?branchId=5',
    method:'GET',
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    });
    res.on('end', () => {
      if(res.statusCode == 200)
        console.log(JSON.parse(body))
      else{
        console.log(res.statusCode)
        console.log(body)
      }
      
    });
});

//req.write(JSON.stringify(data));
req.end();*/