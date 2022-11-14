
const http = require('http');
const PORT = 8080

http.createServer((request, response) =>  {
    const { headers, method, url } = request;
    let body = [];
    response.setHeader('Access-Control-Allow-Origin', '*');
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => 
    {
      body.push(chunk);
    }).on('end', async () => 
    {
      if(request.method == 'OPTIONS')
      {
        response.setHeader('Access-Control-Allow-Methods', 'POST');
        response.setHeader('Access-Control-Allow-Headers', 'content-type');
        response.end();
        return;
      }
      if(request.url.split('/')[2] == 'sucursales'){
        puerto = 8081 // gestion sucursales
      } else if(request.url.split('/')[2] == 'reservas'){
        puerto = 8082 
      } else {
        puerto = -1 //error
      }

      let msg = ''
      var options2  = null;
      if(request.method == 'POST')
      {
        options2 = 
        {
          hostname: 'localhost',
          port: puerto,
          path: request.url,
          method: request.method,
        };
      }
      else
      {
        options2 = 
        {
          hostname: 'localhost',
          port: puerto,
          path: request.url,
          method: request.method,
        };
      }

      const req = http.request(options2, (res) => {
        res.setEncoding('utf8');
        let body2 = [];
        res.on('data', (chunk2) => {
          body2.push(chunk2);
        });
        res.on('end', () => {
          if(res.statusCode == 200){
            msg = JSON.parse(body2)
            msg = JSON.stringify(msg)
          } else {
            response.writeHead(res.statusCode,res.body)
            msg = JSON.stringify(body2)
          }
          response.end(msg);
        });
      });
      req.write(JSON.stringify(body));
      req.end();
    });
  }).listen(PORT);
  
