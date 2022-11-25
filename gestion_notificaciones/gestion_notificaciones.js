///////////////////////////REQUEST HTTP A API DE SENDGRID/////////////////////////
http = require('http')
https = require('https')

var options = {
    hostname: 'api.sendgrid.com',
    path: '/v3/mail/send',
    method: 'POST',
    headers: {
        'Authorization':'Bearer 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',
        'Content-Type': 'application/json',
    }
}



const mailBody = {
  "personalizations": [
    {
      "to": [
        {
          "email": "spateranahuel@gmail.com",
        }
      ],

      /*"dynamic_template_data":{
        "user_name":"",
        "institucion_name":"Hospital Britanico",
      }*/
    }
    
  ],

  //"template_id":"d-5e984603748d4ff09b29293a81a01988",
  
  "from": {
    "email": "trabajoSD@outlook.com",
    
  },
  "subject": "Your Example Order Confirmation",
  "content": [
    {
      "type": "text/html",
      "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
    }
  ],
}

const PORT = 8089


http.createServer((request, response) =>  {
    let body = [];
    let msg = '';

    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => 
    {
      body.push(chunk);
  
    }).on('end', async () => 
    {
  
      if(request.method === 'POST')
      {
        if(request.url.match(/\/api\/notificacion/))
        {
     
          enviarMail(JSON.parse(body).destinatario, JSON.parse(body).asunto, JSON.parse(body).cuerpo)
        }
      }
      response.end(msg);
    });
  }).listen(PORT);





function enviarMail(destinatario,asunto,cuerpo){

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        
        console.log("Status code: "+res.statusCode);
    
        let body = [];
        res.on('data', (chunk) => {
          body.push(chunk);
        });
        res.on('end', () => {
          
        });
    });
    
    mailBody.personalizations[0].to[0].email = destinatario;
    mailBody.subject = asunto
    mailBody.content[0].value = cuerpo
    req.write(JSON.stringify(mailBody))
    req.end(); 
}


/*

<p style="text-align: center;"><span style="font-size: 16px;">Su registro a {{institucion_name}} ha sido realizado con exito.</span></p>

*/


