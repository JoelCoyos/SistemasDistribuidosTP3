const http = require('http');

const data = 'Hola mundo!';

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