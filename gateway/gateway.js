const http = require('http');

var data = {
  userId: 0
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/reservas/solicitar/4',
    method:'POST',
};

/*var data = {
  email:"spateranahuel"
  userId: 0
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/reservas/confirmar/4',
    method:'POST',
};*/


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
req.end();