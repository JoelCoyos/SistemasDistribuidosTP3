const http = require('http');

var data = {
  date: new Date(2081,10,8,15,0),
  userId: 0,
  email: "mail@gmail.com",
  branchId: 10
}

const options = 
{
    hostname: 'localhost',
    port: 8080,
    path:'/api/reservas/2',
    method:'PUT',
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