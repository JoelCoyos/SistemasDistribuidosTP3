
//  mapa -->  "https://app.cartes.io/maps/986cfcf5-1956-4255-91fa-ae5299e460d5"

// 1) "npm init"
// 2) "npm i node-fetch"

import fetch from 'node-fetch'

const API = "https://cartes.io/api/maps"
const mapa = "/986cfcf5-1956-4255-91fa-ae5299e460d5"

const linkMapas = `${API}${mapa}`
const linkMarkers = `${API}${mapa}/markers`

const markers = []

const getMapas = async function(link){
      fetch(link)
      .then(async response => await response.json())
      .then(async data => {
            for(let i = 0; i < data.length; i++){
                  
                  let marca = new Object()
                  marca.branchID = i + 1
                  marca.longitud = await data[i].location.coordinates[0]
                  marca.latitud = await data[i].location.coordinates[1]
                  marca.nombre = await data[i].category.name 

                  markers.push(marca)
            }
            console.log(markers)

      })
}

getMapas(linkMarkers)




