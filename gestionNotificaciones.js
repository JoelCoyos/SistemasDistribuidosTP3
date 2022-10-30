function sendEmail(destinatario,asunto,cuerpo){
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey("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") 
    const msg = {
    to:destinatario,
    from:"somosmasongarg@outlook.com", //configurarlo como variable de entorno
    subject: asunto,
    html: '<strong>'+cuerpo+'</strong>',
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}
module.exports = sendEmail;