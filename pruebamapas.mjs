
//  mapa -->  "https://app.cartes.io/maps/986cfcf5-1956-4255-91fa-ae5299e460d5?lat=-37.98689013347518&lng=-57.52990722656251&zoom=13"

// 1) Escribir en terminal "npm init"
// 2) Escribir en terminal: "npm i node-fetch"
// 3) Agregar "import fetch from 'node-fetch'"
// 4) Cambiar extension del archivo a ".mjs"

const API = "https://cartes.io/maps"
const mapa = "/986cfcf5-1956-4255-91fa-ae5299e460d5?lat=-37.98689013347518&lng=-57.52990722656251&zoom=13"
//fetch(API_URL).then(res => console.log(res))

import fetch from 'node-fetch';

const cargarMapas = async() => {
    try {
        const mapas = await fetch(`${API}${mapa}`)
        console.log(mapas)
        const marcas = await fetch(`${API}${mapa}/markers`)
        console.log(marcas)

    } catch (error) {
        console.log(error)
    }
}

cargarMapas();





