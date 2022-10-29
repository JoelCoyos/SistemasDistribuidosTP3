const fs = require('fs')

function escribirArchivoJson(nombre,datos)
{
    datosJson = JSON.stringify(datos);
    fs.writeFile(nombre,datosJson,(err) =>{
        if (err) return "todo mal"
    })
}

function leerDatosJson(nombre)
{
    let datosJson = [];
    try{
        datosJson = fs.readFileSync(nombre);
    }catch(err){
        fs.openSync(nombre,'w');
    }
    return datosJson;
    
}

module.exports ={
    escribirArchivoJson,
    leerDatosJson
}