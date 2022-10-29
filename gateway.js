const http = require('http');

var data = {
  userId: 0,
  email: "juan@gmail.com"
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/reserva/2',
    method:'POST',
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    });
    res.on('end', () => {
      console.log(body.toString());
    });
});

req.write(JSON.stringify(data));
req.end();