let http = require('http');
let fs = require('fs');
const { url } = require('inspector');
const urlParse = require('url');
const { serialize } = require('v8');
const querystring = require('querystring')

let handleRequest = (request,response) => {

    if(request.url == '/' && request.method == 'GET')
    {
        fs.readFile('./testFront.html',null,function(error,data){
            if(error){
                response.writeHead(404);
                response.write('Error');
            }
            else{
                response.writeHead(200,{
                    'Content-Type':'text/html'
                });
                response.write(data);
            }
            response.end();
        });
    }
    else if(request.url == '/favicon.ico' && request.method == 'GET')
    {
        response.writeHead(200);
        response.end();
    }
    else if(request.url == '/alta')
    {
        let body = [];
        request.on('data', (data) => {

            body += data;
    
        });
        request.on('end', () => {
            let parsedForm = querystring.decode(body)
            let mensaje = {email:parsedForm.email,idUser:0};
            EnviarCliente(8080,'/api/reserva/'+parsedForm.idReserva,'POST',mensaje);

        });
    }
}
function EnviarCliente(puerto,path,metodo,body)
{
    const options = 
    {
        hostname: 'localhost',
        port: puerto,
        path:path,
        method:metodo
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
    req.write(JSON.stringify(body));
    req.end();
}

http.createServer(handleRequest).listen(8000);