const fs = require('fs')

function escribirArchivoJson(nombre,datos)
{
    datosJson = JSON.stringify(datos);
    fs.writeFileSync(nombre,datosJson,(err) =>{
        if (err) return "todo mal"
    })
}

function leerDatosJson(nombre)
{
    let datosJson = [];
    let objeto;
    try{
        datosJson = fs.readFileSync(nombre);
        objeto = JSON.parse(datosJson);
    }catch(err){
        fs.openSync(nombre,'w');
    }
    return objeto;
    
}

module.exports ={
    escribirArchivoJson,
    leerDatosJson
}