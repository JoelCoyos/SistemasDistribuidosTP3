const http = require('http');

var data = {
  fecha: new Date(2022,10,8,15,0),
  userId: 1,
  email: "usuario1@gmail.com",
  branchId: 15,
  idTurno: null
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/',
    method:'POST',
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(res);
    });
    res.on('end', () => {

    });
});

req.write(data);
req.end();