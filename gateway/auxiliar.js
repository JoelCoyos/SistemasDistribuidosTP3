
// este archivo es para probar el gateway (no va en la entrega final) sirve para imitar una solicitud realizada al gateway


const http = require('http');

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/reservas/?branchId=1',
    method:'GET',
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    });
    res.on('end', () => {
      if(res.statusCode == 200){
        console.log(JSON.parse(body))
      }else{
        console.log(res.statusCode)
        console.log(body)
      }
      
    });
});

//req.write(JSON.stringify(data));
req.end();